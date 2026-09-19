import { useState, useMemo } from 'react';
import { AlertTriangle, Bell, Send } from 'lucide-react';
import { SEVERITY } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

const SEV_ORDER = ['red', 'orange', 'yellow'];

function classify(d, trigger) {
  if (d.pHeavy >= trigger + 0.10) return 'red';
  if (d.pHeavy >= trigger) return 'orange';
  if (d.pModerate >= 0.60) return 'yellow';
  return null;
}

export default function AlertsView({ districts = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [trigger, setTrigger] = useState(0.15);

  const alerts = useMemo(() => {
    return districts
      .map((d) => {
        const sev = classify(d, trigger);
        if (!sev) return null;
        const reason = sev === 'yellow'
          ? `P(>=7.5mm) ${((d.pModerate || d.p_moderate || 0) * 100).toFixed(0)}% \u00b7 corrected ${(d.corrected || 0).toFixed(1)}mm`
          : `P(>=64.5mm) ${((d.pHeavy || d.p_heavy || 0) * 100).toFixed(0)}% \u00b7 corrected ${(d.corrected || 0).toFixed(1)}mm`;
        return { id: d.district_id || d.id, name: d.name, state: d.state, regime: d.regime, sev, reason, corrected: d.corrected || 0 };
      })
      .filter(Boolean)
      .sort((a, b) => SEV_ORDER.indexOf(a.sev) - SEV_ORDER.indexOf(b.sev) || b.corrected - a.corrected);
  }, [districts, trigger]);

  const counts = SEV_ORDER.map(k => alerts.filter(a => a.sev === k).length).filter(n => n > 0);

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <div className={`glass-card p-5 animate-fade-slide-up delay-1`}>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 min-w-[320px]">
            <div className={`text-[12px] mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Heavy-rain trigger — issue an orange alert at or above this P(&ge;64.5mm), red at 10 points higher
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range" min="5" max="40" step="1" value={Math.round(trigger * 100)}
                onChange={(e) => setTrigger(Number(e.target.value) / 100)}
                className="flex-1 accent-cyan-500"
              />
              <span className="font-mono text-cyan-400 font-bold text-[15px] min-w-[44px] text-right">{(trigger * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {SEV_ORDER.map(k => (
              <div key={k}>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{SEVERITY[k].label}</div>
                <div className="font-mono text-[20px] font-bold" style={{ color: SEVERITY[k].color }}>
                  {alerts.filter(a => a.sev === k).length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`glass-card overflow-hidden animate-fade-slide-up delay-2`}>
        {alerts.length === 0 ? (
          <div className={`px-5 py-8 text-center ${isDark ? 'text-slate-400' : 'text-gray-500'} text-[13px]`}>
            No district crosses the trigger. Lower the threshold to see which districts would be flagged.
          </div>
        ) : (
          alerts.map((a, i) => {
            const s = SEVERITY[a.sev];
            return (
              <div key={a.id} className={`flex items-center gap-4 px-5 py-3 flex-wrap border-l-4 ${
                i < alerts.length - 1 ? `border-b ${isDark ? 'border-white/5' : 'border-gray-100'}` : ''
              }`} style={{ borderLeftColor: s.color, background: `${s.color}08` }}>
                <span className="text-[11px] font-bold uppercase w-[54px] flex-shrink-0" style={{ color: s.color }}>{s.label}</span>
                <span className={`text-[13px] font-semibold min-w-[110px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{a.name}</span>
                <span className={`text-[12px] min-w-[130px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{a.state}</span>
                <span className={`text-[12px] min-w-[160px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{a.regime?.replace(/_/g, ' ')}</span>
                <span className={`text-[12px] font-mono ml-auto ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{a.reason}</span>
              </div>
            );
          })
        )}
      </div>

      <div className={`glass-card p-5 border ${isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'} animate-fade-slide-up delay-3`}>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <h3 className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Read these as guidance, not detection</h3>
        </div>
        <p className={`text-[13px] leading-relaxed max-w-[720px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          At 64.5mm the served model's probability of detection is 0.003 and its false alarm ratio is 0.933;
          at 124.5mm, POD is 0.000. Orange and red alerts here rank districts by relative risk \u2014 they do not
          reliably catch heavy rainfall events, and they should not be wired to any public warning channel
          until heavy-rain recall improves. Yellow alerts sit at the 7.5mm threshold, where skill is real
          (POD 0.427, BSS +0.070).
        </p>
      </div>
    </div>
  );
}
