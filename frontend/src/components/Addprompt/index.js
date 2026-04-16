import { useState } from "react"
import "./index.css"

function AddPrompt({ onAdd }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [complexity, setComplexity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    // validation
    if (title.length < 3) {
      return setError("Title must be at least 3 characters")
    }
    if (content.length < 20) {
      return setError("Content must be at least 20 characters")
    }
    if (complexity < 1 || complexity > 10) {
      return setError("Complexity must be between 1 and 10")
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/prompts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content,
          complexity: Number(complexity)
        })
      })

      const data = await res.text()

      if (res.status === 200) {
        setTitle("")
        setContent("")
        setComplexity(1)
        onAdd()
      } else {
        setError(data)
      }
    } catch (e) {
      setError("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <div className="form-card">
      <h2>Add Prompt</h2>

      <form className="prompt-form" onSubmit={handleSubmit}>
        
        {error && <p className="error-msg">{error}</p>}

        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter prompt title"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter detailed prompt..."
            rows="4"
          />
          <span className="char-count">{content.length} characters</span>
        </div>

        <div className="form-group">
          <label className="form-label">Complexity (1–10)</label>
          <input
            type="number"
            className="form-input"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          />

          <div className="complexity-bar">
            <div
              className="complexity-fill"
              style={{ width: `${complexity * 10}%` }}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Prompt"}
          </button>
        </div>

      </form>
    </div>
  )
}

export default AddPrompt