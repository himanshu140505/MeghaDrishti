import { AlertTriangle, AlertOctagon } from 'lucide-react';
import { WORST_CASES } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

export default function KnownIssuesView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gaps = [
    { title: 'Dry-day over-prediction', desc: 'Served mean 2.47mm vs observed 0.10mm on near-dry days — 6.6% falsely flagged ≥10mm.' },
    { title: 'Missed-wet rate', desc: '7.6% of observed wet days predicted dry.' },
    { title: 'False blowups', desc: '8.3% of predictions spike well above both raw and observed.' },
    { title: 'Contradictions', desc: '11.1% where the correction moves the forecast the wrong direction relative to observed.' },
    { title: 'Heavy rain', desc: 'POD is 0.003 at 64.5mm and 0.000 at 124.5mm — extreme events remain essentially unpredicted despite reasonable AUC.' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <div className={`glass-card p-6 border ${isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'} animate-fade-slide-up delay-1`}>
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>The 72-hour forecast is not real yet</h3>
            <p className={`text-[13px] leading-relaxed max-w-[700px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Every training row used lead_time = 24, so none of the four models ever learned how skill
              degrades with lead time. Verified directly: lead 24, 72, and 120 all return
              corrected = 24.3mm, wet = 0.781, p(moderate) = 0.379 — bit-identical output. The T+72 toggle
              is left in to make that visible, not to hide it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 animate-fade-slide-up delay-2">
        <div className={`glass-card overflow-hidden`}>
          <div className={`px-5 py-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <h3 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Worst Cases, 2025 (Honest Failures)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  {['District', 'Date', 'Raw', 'Served', 'Observed', 'Note'].map(h => (
                    <th key={h} className={`text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WORST_CASES.map(w => (
                  <tr key={w.id} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                    <td className={`px-4 py-3 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{w.name}</td>
                    <td className={`px-4 py-3 font-mono text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{w.date}</td>
                    <td className={`px-4 py-3 font-mono ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{w.raw}</td>
                    <td className={`px-4 py-3 font-mono ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{w.corrected}</td>
                    <td className="px-4 py-3 font-mono font-bold text-red-400">{w.observed}</td>
                    <td className={`px-4 py-3 text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{w.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`glass-card p-5`}>
          <h3 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Other Confirmed Gaps</h3>
          <div className="space-y-3">
            {gaps.map((g, i) => (
              <div key={i} className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{g.title}</span>
                </div>
                <p className={`text-[12px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
