const express = require("express")
const Database = require("better-sqlite3")
const path = require("path")
const cors = require("cors")
const redis = require("redis")

const app = express()
app.use(express.json())
app.use(cors())

// -------------------- REDIS --------------------

let client = null
let redisConnected = false

const initRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    })

    client.on("error", () => {})

    await client.connect()
    redisConnected = true
    console.log("Redis connected")
  } catch (e) {
    console.log("Redis not available, continuing without it")
    redisConnected = false
  }
}

initRedis()

// -------------------- DATABASE --------------------

const dbPath = path.join(__dirname, "prompts.db")
const db = new Database(dbPath)

// Create table
db.exec(`
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

// GET ALL PROMPTS
app.get("/prompts/", (req, res) => {
  try {
    const data = db.prepare(`SELECT * FROM prompts`).all()
    res.send(data)
  } catch (e) {
    res.status(500).send("Error fetching prompts")
  }
})

// CREATE PROMPT
app.post("/prompts/", (req, res) => {
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
    db.prepare(
      `INSERT INTO prompts (title, content, complexity)
       VALUES (?, ?, ?)`
    ).run(title, content, complexity)

    res.send("Prompt created")
  } catch (e) {
    res.status(500).send("Error creating prompt")
  }
})

// GET SINGLE PROMPT + REDIS VIEW COUNT
app.get("/prompts/:id/", async (req, res) => {
  const { id } = req.params

  try {
    const prompt = db
      .prepare(`SELECT * FROM prompts WHERE id = ?`)
      .get(id)

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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
