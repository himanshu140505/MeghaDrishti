import { CloudRain, Sparkles, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SummaryStats({ districts = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (districts.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`glass-card p-5 flex items-center gap-4 flex-1`}>
            <div className="w-12 h-12 rounded-xl skeleton" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 skeleton" />
              <div className="h-7 w-16 skeleton" />
              <div className="h-2 w-32 skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const n = districts.length;

  const avgRaw = districts.reduce((s, d) => s + (d.raw || 0), 0) / n;
  const avgCorrected = districts.reduce((s, d) => s + (d.corrected || 0), 0) / n;
  const avgHeavy = districts.reduce((s, d) => s + (d.p_heavy ?? d.pHeavy ?? 0), 0) / n;
  const avgModerate = districts.reduce((s, d) => s + (d.p_moderate ?? d.pModerate ?? 0), 0) / n;

  const improvement = avgRaw > 0 ? ((avgCorrected - avgRaw) / avgRaw * 100) : 0;

  const heavyPct = avgHeavy * 100;
  const moderatePct = avgModerate * 100;

  const states = [...new Set(districts.map(d => d.state).filter(Boolean))];

  const stats = [
    { label: 'Avg Raw NWP Rainfall', value: `${avgRaw.toFixed(1)}mm`, sub: `Mean across ${n} districts`, icon: Activity, iconBg: 'bg-orange-500/20', iconColor: 'text-orange-400', valueColor: 'text-orange-400' },
    { label: 'Avg AI Corrected Rainfall', value: `${avgCorrected.toFixed(1)}mm`, sub: `${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}% vs raw`, icon: TrendingUp, iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-400', valueColor: 'text-cyan-400' },
    { label: 'Avg Heavy Rain P(>64.5mm)', value: `${heavyPct.toFixed(1)}%`, sub: `avg pHeavy across ${n} districts`, icon: CloudRain, iconBg: 'bg-teal-500/20', iconColor: 'text-teal-400', valueColor: 'text-teal-400' },
    { label: 'Avg Moderate Rain P(>7.5mm)', value: `${moderatePct.toFixed(1)}%`, sub: `avg pModerate across ${n} districts`, icon: Sparkles, iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400', valueColor: 'text-emerald-400' },
    { label: 'Districts Analyzed', value: `${n}`, sub: `${states.length} unique state${states.length !== 1 ? 's' : ''}`, icon: AlertTriangle, iconBg: 'bg-red-500/20', iconColor: 'text-red-400', valueColor: 'text-red-400' },
  ];

  return (
    <div className="flex flex-col gap-3 h-full">
      {stats.map((s, i) => (
        <div key={s.label} className={`glass-card glass-card-hover p-4 flex items-center gap-4 flex-1 animate-fade-slide-up delay-${i + 1}`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.iconBg} flex-shrink-0`}>
            <s.icon className={`w-5 h-5 ${s.iconColor}`} />
          </div>
          <div className="min-w-0">
            <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{s.label}</div>
            <div className={`text-[17px] font-extrabold font-mono tracking-tight mt-0.5 ${s.valueColor || (isDark ? 'text-white' : 'text-gray-900')}`}>{s.value}</div>
            <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
