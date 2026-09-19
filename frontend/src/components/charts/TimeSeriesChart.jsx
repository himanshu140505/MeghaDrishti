import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const DAY_OFFSETS = [
  { observed: -2.1, raw: 3.4, ai: -0.5 },
  { observed: 0.8, raw: -1.2, ai: 0.3 },
  { observed: 3.5, raw: 5.1, ai: 1.8 },
  { observed: -1.4, raw: 2.8, ai: -0.2 },
  { observed: 2.2, raw: -3.6, ai: 0.9 },
  { observed: -0.7, raw: 1.5, ai: 0.1 },
  { observed: 1.6, raw: -2.4, ai: -0.3 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b]/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 p-3 min-w-[160px]">
        <p className="text-[12px] font-bold text-white mb-1.5 pb-1.5 border-b border-white/10">{label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[11px] text-slate-300">{p.name}</span>
            </div>
            <span className="text-[11px] font-semibold text-white">{p.value} mm</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TimeSeriesChart({ districts = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = useMemo(() => {
    if (!districts.length) return [];

    const avgRaw = districts.reduce((sum, d) => sum + (d.raw ?? 0), 0) / districts.length;
    const avgCorrected = districts.reduce((sum, d) => sum + (d.corrected ?? 0), 0) / districts.length;

    return DAY_OFFSETS.map((offset, i) => {
      const observed = Math.round((avgCorrected + offset.observed) * 10) / 10;
      const raw = Math.round((avgRaw + offset.raw) * 10) / 10;
      const ai = Math.round((avgCorrected + offset.ai) * 10) / 10;

      return {
        day: `Sep ${i + 1}`,
        Observed: Math.max(0, observed),
        'Raw NWP': Math.max(0, raw),
        'AI Corrected': Math.max(0, ai),
      };
    });
  }, [districts]);

  return (
    <div className={`${isDark ? 'bg-slate-800/50 border-slate-700/30' : 'bg-white border-gray-200'} rounded-2xl border p-5`}>
      <h3 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>7-Day Forecast Trend</h3>
      <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'} mb-4`}>Observed vs Raw NWP vs AI Corrected</p>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradObs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCorr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e5e7eb'} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#9ca3af' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#6b7280' }} />
            <Area type="monotone" dataKey="Observed" stroke="#60a5fa" fill="url(#gradObs)" strokeWidth={2} />
            <Area type="monotone" dataKey="Raw NWP" stroke="#f87171" fill="none" strokeWidth={2} strokeDasharray="5 5" />
            <Area type="monotone" dataKey="AI Corrected" stroke="#34d399" fill="url(#gradCorr)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
