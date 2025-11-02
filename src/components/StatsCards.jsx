function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${color}`}>{value}</div>
    </div>
  )
}

export default function StatsCards({ run }) {
  const total = run?.total ?? 0
  const passed = run?.passed ?? 0
  const failed = run?.failed ?? 0
  const skipped = run?.skipped ?? 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Stat label="Total" value={total} color="text-foreground" />
      <Stat label="Passed" value={passed} color="text-emerald-600" />
      <Stat label="Failed" value={failed} color="text-rose-600" />
      <Stat label="Skipped" value={skipped} color="text-amber-600" />
    </div>
  )
}
