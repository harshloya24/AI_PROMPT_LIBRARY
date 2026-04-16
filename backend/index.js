const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const cors = require("cors")
const redis = require("redis")

const app = express()
app.use(express.json())
app.use(cors())


let client = null
let redisConnected = false

const initRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    })

    client.on("error", () => {}) // suppress spam

    await client.connect()
    redisConnected = true
    console.log("Redis connected")
  } catch (e) {
    console.log("Redis not available, continuing without it")
    redisConnected = false
  }
}

initRedis()



const dbPath = path.join(__dirname, "prompts.db")
let db = null

// -------------------- INIT --------------------

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    // Create table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        complexity INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // -------------------- ROUTES --------------------

    app.get("/", (req, res) => {
      res.send("Server running")
    })

    // ✅ GET ALL PROMPTS
    app.get("/prompts/", async (req, res) => {
      try {
        const data = await db.all(`SELECT * FROM prompts`)
        res.send(data)
      } catch (e) {
        res.status(500).send("Error fetching prompts")
      }
    })

  
    app.post("/prompts/", async (req, res) => {
      const { title, content, complexity } = req.body

      if (!title || title.length < 3) {
        return res.status(400).send("Title too short")
      }

      if (!content || content.length < 20) {
        return res.status(400).send("Content too short")
      }

      if (complexity < 1 || complexity > 10) {
        return res.status(400).send("Invalid complexity")
      }

      try {
        await db.run(
          `INSERT INTO prompts (title, content, complexity)
           VALUES (?, ?, ?)`,
          [title, content, complexity]
        )

        res.send("Prompt created")
      } catch (e) {
        res.status(500).send("Error creating prompt")
      }
    })

    
    app.get("/prompts/:id/", async (req, res) => {
      const { id } = req.params

      try {
        const prompt = await db.get(
          `SELECT * FROM prompts WHERE id = ?`,
          [id]
        )

        if (!prompt) {
          return res.status(404).send("Prompt not found")
        }

        let views = 0

        if (redisConnected) {
          try {
            const key = `prompt:${id}:views`
            views = await client.incr(key)
          } catch (e) {}
        }

        res.send({
          ...prompt,
          view_count: views
        })

      } catch (e) {
        res.status(500).send("Error fetching prompt")
      }
    })


    

    // -------------------- SERVER --------------------

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000/")
    })

  } catch (e) {
    console.log("DB Error:", e.message)
    process.exit(1)
  }
}

initializeDBAndServer()