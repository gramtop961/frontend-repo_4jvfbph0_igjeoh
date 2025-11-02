import { useEffect, useState } from 'react'

const statusBadge = (status) => {
  const map = {
    passed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed: 'bg-rose-50 text-rose-700 border-rose-200',
    running: 'bg-blue-50 text-blue-700 border-blue-200',
    skipped: 'bg-amber-50 text-amber-700 border-amber-200',
    blocked: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return `inline-flex items-center px-2 py-0.5 rounded border text-xs ${map[status] || 'bg-muted text-foreground'}`
}

export default function RunsList({ apiBase, onSelect, selectedId }) {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRuns = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/api/runs`)
      const data = await res.json()
      setRuns(data)
    } catch (e) {
      setError('Failed to load runs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRuns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="bg-muted/50 px-4 py-2 text-sm">Recent Runs</div>
      {loading ? (
        <div className="p-4 text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="p-4 text-sm text-rose-600">{error}</div>
      ) : (
        <ul className="divide-y">
          {runs.map((run) => (
            <li
              key={run.id}
              onClick={() => onSelect(run)}
              className={`px-4 py-3 cursor-pointer hover:bg-muted/50 ${selectedId === run.id ? 'bg-muted/70' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{run.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {run.environment || 'env'} • {run.branch || run.build || 'build'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={statusBadge(run.status)}>{run.status}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {run.started_at ? new Date(run.started_at).toLocaleString() : ''}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
