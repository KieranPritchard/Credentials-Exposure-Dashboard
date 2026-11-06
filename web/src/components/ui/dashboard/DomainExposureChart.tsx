import { Globe } from "lucide-react";
import type { Credential } from "../../../types/Credential";

interface DomainExposureChartProps {
    data: Credential[];
}

export default function DomainExposureChart({ data }: DomainExposureChartProps) {
    const domainStats: Record<string, { total: number; breached: number }> = {};

    data.forEach((cred) => {
        const email = cred.email || "";
        const parts = email.split("@");
        const domain = parts.length > 1 ? parts[1].toLowerCase() : "other";

        if (!domainStats[domain]) {
            domainStats[domain] = { total: 0, breached: 0 };
        }

        domainStats[domain].total += 1;
        const breaches = cred.timesBreached ?? cred.times_breached ?? 0;
        if (breaches > 0) {
            domainStats[domain].breached += 1;
        }
    });

    const sortedDomains = Object.entries(domainStats)
        .map(([domain, stats]) => ({
            domain,
            total: stats.total,
            breached: stats.breached,
            safe: stats.total - stats.breached,
            breachRate: Math.round((stats.breached / stats.total) * 100),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    return (
        <div className="w-full rounded-xl bg-white p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Domain Exposure Analysis</h2>
                    <p className="text-xs text-slate-500">Security standing grouped by provider & domain</p>
                </div>
                {sortedDomains.length > 0 && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                        {Object.keys(domainStats).length} Domain{Object.keys(domainStats).length === 1 ? "" : "s"}
                    </span>
                )}
            </div>

            {sortedDomains.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                        <Globe className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">No domains detected</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add credentials to see domain risk breakdown.</p>
                </div>
            ) : (
                <div className="space-y-3.5 py-1">
                    {sortedDomains.map((item, index) => {
                        const safePercent = 100 - item.breachRate;
                        return (
                            <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                        <span className="truncate max-w-[150px] sm:max-w-xs font-mono">@{item.domain}</span>
                                        <span className="text-slate-400 font-normal">({item.total} email{item.total === 1 ? "" : "s"})</span>
                                    </div>
                                    <span
                                        className={`font-semibold tabular-nums ${
                                            item.breached > 0 ? "text-rose-600" : "text-emerald-600"
                                        }`}
                                    >
                                        {item.breached > 0 ? `${item.breachRate}% breached` : "100% safe"}
                                    </span>
                                </div>
                                {/* Stacked Progress Bar */}
                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                                    {safePercent > 0 && (
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-500"
                                            style={{ width: `${safePercent}%` }}
                                            title={`Safe: ${item.safe}`}
                                        ></div>
                                    )}
                                    {item.breachRate > 0 && (
                                        <div
                                            className="h-full bg-rose-500 transition-all duration-500"
                                            style={{ width: `${item.breachRate}%` }}
                                            title={`Breached: ${item.breached}`}
                                        ></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

