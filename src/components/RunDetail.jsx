import { useEffect, useState } from 'react'
import StatsCards from './StatsCards'

const statusColor = (status) => ({
  passed: 'text-emerald-600',
  failed: 'text-rose-600',
  running: 'text-blue-600',
  skipped: 'text-amber-600',
  blocked: 'text-gray-600',
}[status] || 'text-foreground')

export default function RunDetail({ apiBase, run }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!run) return
      setLoading(true)
      try {
        const res = await fetch(`${apiBase}/api/runs/${run.id}`)
        const data = await res.json()
        setDetail(data)
      } catch (e) {
        setDetail(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [apiBase, run])

  if (!run) {
    return (
      <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
        Select a run to view details
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">{run.name}</div>
          <div className="text-sm text-muted-foreground">
            {run.environment || 'env'} • {run.branch || run.build || 'build'}
          </div>
        </div>
        <div className={`text-sm font-medium ${statusColor(run.status)}`}>{run.status}</div>
      </div>

      <div className="mt-4">
        <StatsCards run={detail || run} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading details...</div>
        ) : detail?.suites?.length ? (
          <div className="space-y-4">
            {detail.suites.map((suite) => (
              <div key={suite.id} className="rounded-lg border">
                <div className="px-4 py-2 bg-muted/40 flex items-center justify-between">
                  <div className="font-medium text-sm">{suite.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {suite.total ?? suite.cases?.length ?? 0} cases
                  </div>
                </div>
                <div className="divide-y">
                  {suite.cases?.map((c) => (
                    <details key={c.id} className="group">
                      <summary className="px-4 py-2 bg-background hover:bg-muted/30 cursor-pointer flex items-center justify-between">
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className={`text-xs ${statusColor(c.status)}`}>{c.status}</div>
                      </summary>
                      {c.logs?.length ? (
                        <div className="px-4 py-3 bg-muted/20 text-xs">
                          <ul className="space-y-1">
                            {c.logs.map((l) => (
                              <li key={l.id} className="flex items-start gap-2">
                                <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-gray-400"></span>
                                <div>
                                  <div className="text-muted-foreground">
                                    {l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : ''} • {l.level}
                                  </div>
                                  <div className="text-foreground">{l.message}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-xs text-muted-foreground">No logs</div>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No suites to display</div>
        )}
      </div>
    </div>
  )
}
