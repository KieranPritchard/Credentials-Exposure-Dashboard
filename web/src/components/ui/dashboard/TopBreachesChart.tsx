import { ShieldCheck } from "lucide-react";
import type { Credential } from "../../../types/Credential";

interface TopBreachesChartProps {
    data: Credential[];
}

export default function TopBreachesChart({ data }: TopBreachesChartProps) {
    // Collect all breach names and count frequency
    const breachCounts: Record<string, number> = {};

    data.forEach((cred) => {
        const raw = cred.breachDetails ?? cred.breach_details;
        if (!raw) return;

        let parsed: unknown = raw;
        if (typeof raw === "string") {
            try {
                parsed = JSON.parse(raw);
            } catch {
                parsed = [raw];
            }
        }

        if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
                const name = typeof item === "string" ? item : (item?.name ?? item?.title ?? JSON.stringify(item));
                if (name && typeof name === "string") {
                    breachCounts[name] = (breachCounts[name] ?? 0) + 1;
                }
            });
        } else if (typeof parsed === "object" && parsed !== null) {
            const obj = parsed as Record<string, unknown>;
            if (obj.description && typeof obj.description === "string") {
                breachCounts[obj.description] = (breachCounts[obj.description] ?? 0) + 1;
            } else {
                Object.keys(obj).forEach((k) => {
                    breachCounts[k] = (breachCounts[k] ?? 0) + 1;
                });
            }
        }
    });

    const sortedBreaches = Object.entries(breachCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const maxCount = sortedBreaches.length > 0 ? sortedBreaches[0].count : 1;

    return (
        <div className="w-full rounded-xl bg-white p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Top Breach Incidents</h2>
                    <p className="text-xs text-slate-500">Most frequent breaches compromising your monitored accounts</p>
                </div>
                {sortedBreaches.length > 0 && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                        {Object.keys(breachCounts).length} Distinct Source{Object.keys(breachCounts).length === 1 ? "" : "s"}
                    </span>
                )}
            </div>

            {sortedBreaches.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">No breach incidents reported</p>
                    <p className="text-xs text-slate-400 mt-0.5">Your monitored credentials haven't been linked to known data dumps.</p>
                </div>
            ) : (
                <div className="space-y-3.5 py-1">
                    {sortedBreaches.map((item, index) => {
                        const percentage = Math.round((item.count / maxCount) * 100);
                        return (
                            <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs" title={item.name}>
                                        {item.name}
                                    </span>
                                    <span className="text-slate-500 font-semibold tabular-nums">
                                        {item.count} account{item.count === 1 ? "" : "s"}
                                    </span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                                        style={{ width: `${Math.max(percentage, 6)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

