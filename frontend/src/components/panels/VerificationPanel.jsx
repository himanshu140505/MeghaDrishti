import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { VERIFICATION_DATA, MONTHLY_GAIN } from '../../data/mockData';

export default function VerificationPanel({ verification }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const vData = useMemo(() => {
    if (!verification) return VERIFICATION_DATA;

    const cont = verification.continuous || verification.overall || {};
    const raw = cont.raw || {};
    const served = cont.served || cont.corrected || {};

    const wet = verification.wetDay || verification.wet_day || {};
    const wetRaw = wet.raw || {};
    const wetServed = wet.served || wet.corrected || {};

    const thresh = (verification.thresholds || []).map(t => ({
      thr: t.thr || t.threshold,
      method: t.method || 'served',
      pod: t.pod ?? 0,
      far: t.far ?? null,
      csi: t.csi ?? 0,
      ets: t.ets ?? 0,
      freqBias: t.freq_bias ?? t.freqBias ?? 0,
    }));

    const prob = (verification.probabilistic || verification.probability || []).map(p => ({
      thr: p.thr || p.threshold || '',
      brier: p.brier ?? null,
      bss: p.bss ?? null,
      auc: p.auc ?? 0,
    }));

    return {
      continuous: {
        raw: {
          rmse: raw.rmse ?? VERIFICATION_DATA.continuous.raw.rmse,
          mae: raw.mae ?? VERIFICATION_DATA.continuous.raw.mae,
          medae: raw.medae ?? VERIFICATION_DATA.continuous.raw.medae,
          p90: raw.p90 ?? VERIFICATION_DATA.continuous.raw.p90,
          p99: raw.p99 ?? VERIFICATION_DATA.continuous.raw.p99,
          r2: raw.r2 ?? VERIFICATION_DATA.continuous.raw.r2,
          r: raw.r ?? VERIFICATION_DATA.continuous.raw.r,
          rho: raw.rho ?? VERIFICATION_DATA.continuous.raw.rho,
          bias: raw.bias ?? VERIFICATION_DATA.continuous.raw.bias,
          kge: raw.kge ?? VERIFICATION_DATA.continuous.raw.kge,
        },
        served: {
          rmse: served.rmse ?? VERIFICATION_DATA.continuous.served.rmse,
          mae: served.mae ?? VERIFICATION_DATA.continuous.served.mae,
          medae: served.medae ?? VERIFICATION_DATA.continuous.served.medae,
          p90: served.p90 ?? VERIFICATION_DATA.continuous.served.p90,
          p99: served.p99 ?? VERIFICATION_DATA.continuous.served.p99,
          r2: served.r2 ?? VERIFICATION_DATA.continuous.served.r2,
          r: served.r ?? VERIFICATION_DATA.continuous.served.r,
          rho: served.rho ?? VERIFICATION_DATA.continuous.served.rho,
          bias: served.bias ?? VERIFICATION_DATA.continuous.served.bias,
          kge: served.kge ?? VERIFICATION_DATA.continuous.served.kge,
        },
      },
      wetDay: {
        raw: {
          acc: wetRaw.acc ?? wetRaw.accuracy ?? VERIFICATION_DATA.wetDay.raw.acc,
          prec: wetRaw.prec ?? wetRaw.precision ?? VERIFICATION_DATA.wetDay.raw.prec,
          recall: wetRaw.recall ?? VERIFICATION_DATA.wetDay.raw.recall,
          f1: wetRaw.f1 ?? VERIFICATION_DATA.wetDay.raw.f1,
          predWet: wetRaw.predWet ?? wetRaw.pred_wet ?? VERIFICATION_DATA.wetDay.raw.predWet,
        },
        served: {
          acc: wetServed.acc ?? wetServed.accuracy ?? VERIFICATION_DATA.wetDay.served.acc,
          prec: wetServed.prec ?? wetServed.precision ?? VERIFICATION_DATA.wetDay.served.prec,
          recall: wetServed.recall ?? VERIFICATION_DATA.wetDay.served.recall,
          f1: wetServed.f1 ?? VERIFICATION_DATA.wetDay.served.f1,
          predWet: wetServed.predWet ?? wetServed.pred_wet ?? VERIFICATION_DATA.wetDay.served.predWet,
        },
        obsWet: wet.obsWet ?? wet.obs_wet ?? VERIFICATION_DATA.wetDay.obsWet,
        obsWetPct: wet.obsWetPct ?? wet.obs_wet_pct ?? VERIFICATION_DATA.wetDay.obsWetPct,
      },
      thresholds: thresh.length > 0 ? thresh : VERIFICATION_DATA.thresholds,
      probabilistic: prob.length > 0 ? prob : VERIFICATION_DATA.probabilistic,
    };
  }, [verification]);

  const rows = [
    ['RMSE (mm)', vData.continuous.raw.rmse, vData.continuous.served.rmse],
    ['MAE (mm)', vData.continuous.raw.mae, vData.continuous.served.mae],
    ['Median AE (mm)', vData.continuous.raw.medae, vData.continuous.served.medae],
    ['P90 error (mm)', vData.continuous.raw.p90, vData.continuous.served.p90],
    ['P99 error (mm)', vData.continuous.raw.p99, vData.continuous.served.p99],
    ['R-squared', vData.continuous.raw.r2, vData.continuous.served.r2],
    ['Pearson r', vData.continuous.raw.r, vData.continuous.served.r],
    ['Spearman rho', vData.continuous.raw.rho, vData.continuous.served.rho],
    ['Bias ratio', vData.continuous.raw.bias, vData.continuous.served.bias],
    ['KGE', vData.continuous.raw.kge, vData.continuous.served.kge],
  ];

  const maxGain = Math.max(...MONTHLY_GAIN.map(m => Math.abs(m.gain)));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
        <div className={`glass-card overflow-hidden`}>
          <div className="px-5 pt-4 pb-2">
            <div className={`text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>2025 full year . 93,440 district-days . exact IMD ground truth</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <th className={`text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Metric</th>
                  <th className={`text-center text-[11px] font-semibold uppercase tracking-wider px-5 py-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Raw NWP</th>
                  <th className={`text-center text-[11px] font-semibold uppercase tracking-wider px-5 py-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>Served</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, raw, served]) => (
                  <tr key={label} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                    <td className={`px-5 py-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{label}</td>
                    <td className="px-5 py-2 font-mono text-center">
                      <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{typeof raw === 'number' ? raw.toFixed(2) : raw}</span>
                    </td>
                    <td className="px-5 py-2 font-mono text-center font-bold">
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{typeof served === 'number' ? served.toFixed(2) : served}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className={`glass-card p-5`}>
            <div className={`text-[12px] mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Wet-day classification (&ge; 2.5mm)</div>
            <div className="space-y-2">
              {[
                { label: 'Accuracy', raw: vData.wetDay.raw.acc, served: vData.wetDay.served.acc },
                { label: 'Precision', raw: vData.wetDay.raw.prec, served: vData.wetDay.served.prec },
                { label: 'Recall', raw: vData.wetDay.raw.recall, served: vData.wetDay.served.recall },
                { label: 'F1', raw: vData.wetDay.raw.f1, served: vData.wetDay.served.f1 },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between text-[12px]">
                  <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{m.label}</span>
                  <span className="font-mono">
                    <span className={`${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{typeof m.raw === 'number' ? m.raw.toFixed(4) : m.raw}</span>
                    <span className={`mx-1 ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>{' > '}</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{typeof m.served === 'number' ? m.served.toFixed(4) : m.served}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className={`text-[11px] mt-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              Observed wet days: {(vData.wetDay.obsWet || 0).toLocaleString()} ({vData.wetDay.obsWetPct || 0}%) . predicted wet, served: {(vData.wetDay.served.predWet || 0).toLocaleString()}
            </div>
          </div>

          <div className={`glass-card p-5`}>
            <div className={`text-[12px] mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>RMSE improvement by month</div>
            <div className="flex items-end gap-3 h-[120px]">
              {MONTHLY_GAIN.map((m, i) => {
                const h = Math.max(4, (Math.abs(m.gain) / maxGain) * 70);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center" style={{ height: 70 }}>
                      {m.gain >= 0 && (
                        <div className="w-[24px] rounded-t-sm transition-all duration-500" style={{ height: h, background: '#14b8a6', opacity: m.disclosed ? 1 : 0.5 }} />
                      )}
                    </div>
                    <div className={`h-px w-full my-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <div className="w-full flex items-start justify-center" style={{ height: 50 }}>
                      {m.gain < 0 && (
                        <div className="w-[24px] rounded-b-sm transition-all duration-500" style={{ height: h, background: '#ef4444', opacity: m.disclosed ? 1 : 0.5 }} />
                      )}
                    </div>
                    <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{m.month}</div>
                    <div className={`text-[10px] font-mono font-bold ${m.gain >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                      {m.gain > 0 ? '+' : ''}{m.gain}%
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`text-[10px] mt-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              Solid bars are individually disclosed months. Faded bar averages remaining months.
            </div>
          </div>
        </div>
      </div>

      <div className={`glass-card overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <div className={`text-[12px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Skill collapses fast as the threshold rises - this is the depression / extreme-event blind spot.
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                {['Threshold', 'Method', 'POD', 'FAR', 'CSI', 'ETS', 'Freq. bias'].map(h => (
                  <th key={h} className={`text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-2 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vData.thresholds.map((t, i) => (
                <tr key={i} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-50'} ${t.method === 'raw' ? isDark ? 'bg-white/[0.02]' : 'bg-gray-50' : ''}`}>
                  <td className="px-4 py-2 font-mono whitespace-nowrap">{t.thr}mm</td>
                  <td className="px-4 py-2 capitalize whitespace-nowrap">
                    <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t.method}</span>
                  </td>
                  <td className="px-4 py-2 font-mono">
                    <span className={`${t.pod > 0.3 ? 'text-emerald-400' : isDark ? 'text-slate-400' : 'text-gray-500'}`}>{typeof t.pod === 'number' ? t.pod.toFixed(3) : t.pod}</span>
                  </td>
                  <td className="px-4 py-2 font-mono">
                    <span className={`${t.far === null ? 'text-slate-500' : t.far > 0.8 ? 'text-red-400' : isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {t.far === null ? '--' : typeof t.far === 'number' ? t.far.toFixed(3) : t.far}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono">
                    <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{typeof t.csi === 'number' ? t.csi.toFixed(3) : t.csi}</span>
                  </td>
                  <td className="px-4 py-2 font-mono">
                    <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{typeof t.ets === 'number' ? t.ets.toFixed(3) : t.ets}</span>
                  </td>
                  <td className="px-4 py-2 font-mono">
                    <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{typeof t.freqBias === 'number' ? t.freqBias.toFixed(2) : t.freqBias}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`px-5 py-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <div className={`text-[12px] mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Probabilistic skill (served)</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {vData.probabilistic.map(p => (
              <div key={p.thr} className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className={`text-[12px] font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.thr}</div>
                <div className="font-mono text-[11px] mt-1">
                  <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {p.brier !== null ? `Brier ${p.brier}` : 'Brier --'} . {p.bss !== null ? `BSS +${p.bss}` : 'BSS --'} . AUC {p.auc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
