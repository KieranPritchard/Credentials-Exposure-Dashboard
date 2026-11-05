import type { Credential } from "../../../types/Credential";

interface ExposureBreakdownChartProps {
    data: Credential[];
}

export default function ExposureBreakdownChart({ data }: ExposureBreakdownChartProps) {
    const total = data.length;

    const safeCount = data.filter((c) => (c.timesBreached ?? c.times_breached ?? 0) === 0).length;
    const moderateCount = data.filter((c) => {
        const count = c.timesBreached ?? c.times_breached ?? 0;
        return count >= 1 && count <= 2;
    }).length;
    const criticalCount = data.filter((c) => (c.timesBreached ?? c.times_breached ?? 0) >= 3).length;

    const segments = [
        { label: "Safe (0 breaches)", count: safeCount, color: "#10b981", bgClass: "bg-emerald-500" },
        { label: "Moderate (1-2)", count: moderateCount, color: "#f59e0b", bgClass: "bg-amber-500" },
        { label: "Critical (3+)", count: criticalCount, color: "#ef4444", bgClass: "bg-rose-500" },
    ];

    const radius = 55;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPercentage = 0;
    const renderedSegments = segments.map((seg) => {
        const percentage = total > 0 ? seg.count / total : 0;
        const strokeDasharray = `${percentage * circumference} ${circumference}`;
        const strokeDashoffset = -accumulatedPercentage * circumference;
        accumulatedPercentage += percentage;
        return {
            ...seg,
            percentage,
            strokeDasharray,
            strokeDashoffset,
        };
    });

    const safePercentage = total > 0 ? Math.round((safeCount / total) * 100) : 100;

    return (
        <div className="w-full rounded-xl bg-white p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Exposure Breakdown</h2>
                    <p className="text-xs text-slate-500">Risk classification across credentials</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {total} Total
                </span>
            </div>

            {total === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-slate-400">
                    No credentials available to analyze.
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                    {/* Donut Chart */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                            {/* Background Track */}
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="#f1f5f9"
                                strokeWidth="20"
                                fill="transparent"
                            />
                            {/* Segments */}
                            {renderedSegments.map((seg, idx) => (
                                <circle
                                    key={idx}
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    stroke={seg.color}
                                    strokeWidth="20"
                                    fill="transparent"
                                    strokeDasharray={seg.strokeDasharray}
                                    strokeDashoffset={seg.strokeDashoffset}
                                    className="transition-all duration-500 ease-out"
                                />
                            ))}
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-bold text-slate-800">{safePercentage}%</span>
                            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Safe</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                        {renderedSegments.map((seg, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${seg.bgClass}`}></span>
                                    <span className="text-slate-600 font-medium">{seg.label}</span>
                                </div>
                                <div className="text-slate-900 font-semibold tabular-nums">
                                    {seg.count} ({Math.round(seg.percentage * 100)}%)
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
