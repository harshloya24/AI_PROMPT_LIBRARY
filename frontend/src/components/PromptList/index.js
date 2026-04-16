import { useEffect, useState } from "react"
import "./index.css"

function PromptList({ onSelect, reload }) {
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")

      try {
        const res = await fetch(
          "https://ai-prompt-library-wdav.onrender.com/prompts/"
        )

        if (res.status === 200) {
          const data = await res.json()
          setPrompts(data)
        } else {
          const msg = await res.text()
          setError(msg)
        }
      } catch (e) {
        // better message for Render cold start
        setError("Server is starting... please wait and try again")
      }

      setLoading(false)
    }

    fetchData()
  }, [reload])

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="center-screen">
        <div className="loader"></div>
        <p>Loading prompts...</p>
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

  // ---------------- UI ----------------
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">All Prompts</h2>
        <p className="page-subtitle">Browse your saved AI prompts</p>
      </div>

      {prompts.length === 0 ? (
        <div className="empty-state">
          <p>No prompts found</p>
        </div>
      ) : (
        <div className="prompt-grid">
          {prompts.map(item => (
            <div
              key={item.id}
              className="prompt-card"
              onClick={() => onSelect(item.id)}
            >
              <div className="card-header">
                <h3 className="card-title">{item.title}</h3>

                <span
                  className={`badge ${
                    item.complexity <= 3
                      ? "badge-low"
                      : item.complexity <= 7
                      ? "badge-medium"
                      : "badge-high"
                  }`}
                >
                  {item.complexity}
                </span>
              </div>

              <p className="card-content">
                {item.content.slice(0, 80)}...
              </p>

              <div className="card-footer">
                <span className="card-date">Prompt</span>
                <span className="card-view-btn">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PromptList
