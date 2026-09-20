import { REGIMES, REGIME_DISTRIBUTION } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

export default function RegimePanel({ regime }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const regimeType = regime?.type || null;
  const regimeInfo = regimeType ? (REGIMES[regimeType] || REGIMES.active_monsoon) : { label: 'Awaiting Data', IconComponent: null };
  const confidence = regime?.confidence ?? null;
  const IconComp = regimeInfo.IconComponent;

  const maxCount = Math.max(...REGIME_DISTRIBUTION.map(r => r.count));

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl p-6 border relative overflow-hidden ${
        isDark ? 'bg-gradient-to-r from-cyan-600/80 to-blue-700/80 border-cyan-500/20' : 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-300'
      }`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex items-start gap-4 text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/10">
            {IconComp && <IconComp className="w-8 h-8 text-white" />}
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-cyan-200/70 mb-1">Current Weather Regime</div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">{regimeInfo.label}</h2>
              <span className="px-3 py-1 rounded-full bg-white/15 text-[12px] font-bold backdrop-blur-sm border border-white/10">
                Confidence: {confidence !== null ? `${(confidence * 100).toFixed(0)}%` : '--'}
              </span>
            </div>
            <p className="text-[13px] text-cyan-100/60 leading-relaxed max-w-md">
              {regimeType === 'active_monsoon' && 'Strong monsoon flow over central India with widespread rainfall activity.'}
              {regimeType === 'break_monsoon' && 'Suppressed rainfall over central India with monsoon trough weakened.'}
              {regimeType === 'depression' && 'Cyclonic circulation over Bay of Bengal bringing heavy rainfall to coastal and central regions.'}
              {regimeType === 'orographic' && 'Terrain-enhanced rainfall over Western Ghats and northeastern hills.'}
              {regimeType === 'coastal' && 'Sea-breeze convergence zones triggering localized heavy rainfall along coast.'}
              {regimeType === 'western_disturbance' && 'Extratropical system from Mediterranean bringing winter rainfall to northwest India.'}
            </p>
          </div>
        </div>
      </div>

      <div className={`glass-card p-5`}>
        <div className={`text-[12px] mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Training set composition \u2014 14,152 samples across 116 districts, 122 dates (2024-06-01 to 2024-09-30)
        </div>
        <div className="space-y-3">
          {REGIME_DISTRIBUTION.map((r) => (
            <div key={r.id} className="flex items-center gap-3">
              <div className={`w-[150px] text-[12px] flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{r.label}</div>
              <div className={`flex-1 h-4 rounded-md overflow-hidden border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                <div className="h-full rounded-md transition-all duration-500" style={{ width: `${(r.count / maxCount) * 100}%`, background: r.color }} />
              </div>
              <div className={`w-[56px] text-[12px] font-mono text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>{r.count.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
