import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PAGE_SIZE = 40;

export default function DistrictTable({ districts = [], onDistrictClick, hoveredDistrict, onRowHover }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return districts;
    return districts.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.state?.toLowerCase().includes(q)
    );
  }, [districts, search]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filtered.length));
    }
  }, [filtered.length]);

  const regimeDot = {
    active_monsoon: 'bg-emerald-400',
    break_monsoon: 'bg-amber-400',
    depression: 'bg-red-400',
    orographic: 'bg-purple-400',
    coastal: 'bg-cyan-400',
    western_disturbance: 'bg-indigo-400',
  };

  const headers = ['District', 'State', 'Regime', 'Raw (mm)', 'Corrected (mm)', 'P(>7.5mm)', 'P(>64.5mm)', 'P(wet)'];

  return (
    <div className={`glass-card flex flex-col overflow-hidden h-full`}>
      <div className={`px-2.5 py-1.5 border-b flex items-center gap-1.5 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <Search className={`w-3 h-3 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder={`Search ${districts.length} districts...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 bg-transparent text-[11px] outline-none ${isDark ? 'text-white placeholder:text-slate-600' : 'text-gray-900 placeholder:text-gray-300'}`}
        />
        {search && (
          <button onClick={() => setSearch('')} className={`flex-shrink-0 ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>
            <X className="w-3 h-3" />
          </button>
        )}
        <span className={`text-[9px] flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
          {search ? `${filtered.length}/${districts.length}` : districts.length}
        </span>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="overflow-auto flex-1">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} sticky top-0 ${isDark ? 'bg-[#0f172a]/95' : 'bg-white/95'} backdrop-blur-sm z-10`}>
              {headers.map(h => (
                <th key={h} className={`text-left text-[10px] font-semibold uppercase tracking-wider px-3 py-2 ${isDark ? 'text-slate-400' : 'text-gray-500'} whitespace-nowrap`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((d, i) => {
              const dot = regimeDot[d.regime] || 'bg-slate-400';
              const pHeavy = d.p_heavy || d.pHeavy || 0;
              const pModerate = d.p_moderate || d.pModerate || 0;
              const wetProb = d.wet || 0;
              const isHovered = hoveredDistrict === (d.district_id || d.id);
              return (
                <tr
                  key={d.district_id || d.id || i}
                  onClick={() => onDistrictClick?.(d)}
                  onMouseEnter={() => onRowHover?.(d.district_id || d.id)}
                  onMouseLeave={() => onRowHover?.(null)}
                  className={`border-b cursor-pointer transition-colors ${
                    isHovered
                      ? isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'
                      : isDark ? 'border-white/5 hover:bg-white/[0.03]' : 'border-gray-50 hover:bg-gray-50'
                  }`}
                >
                  <td className={`px-3 py-2 text-[11px] font-semibold ${isDark ? 'text-white' : 'text-gray-900'} whitespace-nowrap`}>{d.name}</td>
                  <td className={`px-3 py-2 text-[10px] ${isDark ? 'text-slate-400' : 'text-gray-500'} whitespace-nowrap`}>{d.state}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{d.regime?.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-right">
                    <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{d.raw}</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-right font-bold">
                    <span className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{d.corrected}</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-right">
                    <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{(pModerate * 100).toFixed(0)}%</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-right">
                    <span className={`${pHeavy > 0.2 ? 'text-orange-400 font-bold' : isDark ? 'text-slate-400' : 'text-gray-500'}`}>{(pHeavy * 100).toFixed(0)}%</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-right">
                    <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{(wetProb * 100).toFixed(0)}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibleCount < filtered.length && (
          <div className={`px-2 py-1.5 text-center text-[9px] ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
            {visible.length}/{filtered.length}
          </div>
        )}
        {filtered.length === 0 && (
          <div className={`px-2 py-4 text-center text-[10px] ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>No matches</div>
        )}
      </div>
    </div>
  );
}
