// Stores the interface for the metric card props
interface MetricCardProps {
    title: string,
    metric: number | string
}

export default function MetricCard({title, metric}:MetricCardProps) {
    return(
        <div className="w-full rounded-lg bg-white p-6 border border-slate-200/80 shadow-sm">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-3xl font-semibold text-slate-900 mt-2 tabular-nums">{metric}</p>
        </div>
    )
}