import { useMemo, useState } from 'react'
import Header from './components/Header'
import RunsList from './components/RunsList'
import RunDetail from './components/RunDetail'

function IngestModal({ open, onClose, onSubmit, apiBase }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setError('')
    let payload
    try {
      payload = JSON.parse(text)
    } catch (e) {
      setError('Invalid JSON')
      return
    }
    setBusy(true)
    try {
      const res = await fetch(`${apiBase}/api/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to ingest')
      onSubmit?.()
      onClose?.()
      setText('')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl border bg-background p-4 shadow-xl">
        <div className="text-lg font-semibold">Ingest Execution JSON</div>
        <p className="text-sm text-muted-foreground mb-3">Paste a run payload with suites, cases and logs.</p>
        <textarea
          className="w-full h-64 rounded-md border bg-card p-3 font-mono text-xs"
          placeholder='{"name":"Run","status":"passed","suites":[]}'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <div className="mt-2 text-sm text-rose-600">{error}</div>}
        <div className="mt-3 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          <button
            disabled={busy}
            onClick={submit}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const apiBase = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [selectedRun, setSelectedRun] = useState(null)
  const [ingestOpen, setIngestOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSelect = (run) => setSelectedRun(run)

  const triggerRefresh = () => setRefreshKey((k) => k + 1)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4">
        <Header onRefresh={triggerRefresh} onOpenIngest={() => setIngestOpen(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <RunsList key={refreshKey} apiBase={apiBase} onSelect={handleSelect} selectedId={selectedRun?.id} />
          </div>
          <div className="lg:col-span-2">
            <RunDetail apiBase={apiBase} run={selectedRun} />
          </div>
        </div>
      </div>

      <IngestModal
        open={ingestOpen}
        onClose={() => setIngestOpen(false)}
        apiBase={apiBase}
        onSubmit={triggerRefresh}
      />
    </div>
  )
}
