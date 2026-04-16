import { useState } from "react"
import AddPrompt from "./components/Addprompt"
import PromptList from "./components/PromptList"
import PromptDetail from "./components/PromptDetail"
import "./App.css"

function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [reload, setReload] = useState(false)

  return (
    <div className="app-container">
      <h1 className="app-title">AI Prompt Library</h1>

      <AddPrompt onAdd={() => setReload(!reload)} />

      <PromptList onSelect={setSelectedId} reload={reload} />

      {selectedId && <PromptDetail id={selectedId} />}
    </div>
  )
}

export default App