import { API_ENDPOINTS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

export default function ApiReferenceView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <div className={`glass-card overflow-hidden animate-fade-slide-up delay-1`}>
        <div className={`px-5 py-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <h3 className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>API Reference</h3>
          <p className={`text-[12px] mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>FastAPI backend, 12 endpoints</p>
        </div>
        <div className="font-mono">
          {API_ENDPOINTS.map((e, i) => (
            <div key={e.path} className={`flex items-center gap-4 px-5 py-3 flex-wrap ${
              i < API_ENDPOINTS.length - 1 ? `border-b ${isDark ? 'border-white/5' : 'border-gray-100'}` : ''
            }`}>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                e.method === 'GET'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`} style={{ minWidth: 44, textAlign: 'center' }}>
                {e.method}
              </span>
              <span className={`text-[13px] ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ minWidth: 260 }}>{e.path}</span>
              <span className={`text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{e.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
