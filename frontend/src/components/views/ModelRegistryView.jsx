import { MODEL_CARDS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { Cpu, GitBranch, RotateCcw } from 'lucide-react';

export default function ModelRegistryView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 animate-fade-slide-up delay-1">
        {MODEL_CARDS.map((m) => (
          <div key={m.key} className={`glass-card glass-card-hover p-5 flex flex-col`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}20` }}>
                <Cpu className="w-5 h-5" style={{ color: m.color }} />
              </div>
              <div>
                <div className={`text-[14px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{m.name}</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{m.algo}</div>
              </div>
            </div>
            <div className={`text-[12px] mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{m.task}</div>
            <div className={`flex-1 space-y-2 pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              {m.metrics.map((mt) => (
                <div key={mt.label} className="flex items-center justify-between text-[12px] gap-2">
                  <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{mt.label}</span>
                  <span className={`font-mono font-semibold text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>{mt.value}</span>
                </div>
              ))}
            </div>
            <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{m.topFeature}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`glass-card p-6 animate-fade-slide-up delay-2`}>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className={`text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Versions in registry</div>
            <div className="flex items-center gap-2 mt-1">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span className={`text-[20px] font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>v1 \u2013 v15</span>
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Latest pointer file tracks active version</div>
          </div>
          <div>
            <div className={`text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Auto-retrain trigger</div>
            <div className="flex items-center gap-2 mt-1">
              <RotateCcw className="w-4 h-4 text-teal-400" />
              <span className={`text-[20px] font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>+20%</span>
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Dataset growth, plus a dataset hash change</div>
          </div>
          <div>
            <div className={`text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Holdout strategy</div>
            <div className={`text-[20px] font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>Temporal</div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Last 20% of unique dates</div>
          </div>
          <div>
            <div className={`text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Reference snapshot</div>
            <div className={`text-[20px] font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-1`}>v9</div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Per-regime metrics above are from this version</div>
          </div>
        </div>
      </div>
    </div>
  );
}
