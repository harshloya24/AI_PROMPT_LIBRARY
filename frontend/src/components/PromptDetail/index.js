import { useEffect, useState } from "react"
import "./index.css"

function PromptDetail({ id }) {
  const [prompt, setPrompt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")

      try {
        const res = await fetch(`http://localhost:5000/prompts/${id}/`)

        if (res.status === 200) {
          const data = await res.json()
          setPrompt(data)
        } else {
          const msg = await res.text()
          setError(msg)
        }
      } catch (e) {
        setError("Something went wrong")
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="center-screen">
        <div className="loader"></div>
        <p>Loading details...</p>
      </div>
    )
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="center-screen">
        <p className="error-text">{error}</p>
      </div>
    )
  }

  // ---------------- NO DATA ----------------
  if (!prompt) {
    return null
  }

  // ---------------- UI ----------------
  return (
    <div className="page-container">
      <div className="detail-card">

        <div className="detail-header">
          <h2 className="detail-title">{prompt.title}</h2>

          <span
            className={`badge badge-large ${
              prompt.complexity <= 3
                ? "badge-low"
                : prompt.complexity <= 7
                ? "badge-medium"
                : "badge-high"
            }`}
          >
            {prompt.complexity}
          </span>
        </div>

        <div className="detail-section">
          <span className="section-label">Prompt Content</span>

          <div className="content-box">
            <p className="content-text">{prompt.content}</p>
          </div>
        </div>

        <div className="detail-meta">
          <span>ID: {prompt.id}</span>
          <span>Created: {prompt.created_at}</span>
        </div>

      </div>
    </div>
  )
}

export default PromptDetail