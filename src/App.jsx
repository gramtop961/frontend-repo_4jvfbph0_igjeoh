import { useMemo, useState } from 'react'
import Header from './components/Header'
import RunsList from './components/RunsList'
import RunDetail from './components/RunDetail'
import IngestModal from './components/IngestModal'

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
