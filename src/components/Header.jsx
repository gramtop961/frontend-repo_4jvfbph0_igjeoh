import { useState } from 'react'
import { Rocket, RefreshCw, Upload } from 'lucide-react'

export default function Header({ onRefresh, onOpenIngest }) {
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    try {
      await onRefresh?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center shadow">
          <Rocket size={20} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Automation Report Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visualize executions, drill into suites, cases and logs</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
        <button
          onClick={onOpenIngest}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
        >
          <Upload size={16} />
          Ingest JSON
        </button>
      </div>
    </div>
  )
}
