import { CloudLightning, Sun, Tornado, Mountain, Waves, Wind } from 'lucide-react';

export const REGIMES = {
  active_monsoon: { label: 'Active Monsoon', color: '#22c55e', icon: 'CloudLightning', severity: 'high', IconComponent: CloudLightning },
  break_monsoon: { label: 'Break Monsoon', color: '#f59e0b', icon: 'Sun', severity: 'low', IconComponent: Sun },
  depression: { label: 'Depression', color: '#ef4444', icon: 'Tornado', severity: 'extreme', IconComponent: Tornado },
  orographic: { label: 'Orographic', color: '#a855f7', icon: 'Mountain', severity: 'moderate', IconComponent: Mountain },
  coastal: { label: 'Coastal', color: '#06b6d4', icon: 'Waves', severity: 'moderate', IconComponent: Waves },
  western_disturbance: { label: 'Western Disturbance', color: '#6366f1', icon: 'Wind', severity: 'moderate', IconComponent: Wind },
};

export const THRESHOLDS = [
  { name: 'Moderate', value: 7.5, color: '#60a5fa', label: '>= 7.5 mm' },
  { name: 'Heavy', value: 64.5, color: '#f97316', label: '>= 64.5 mm' },
  { name: 'Very Heavy', value: 124.5, color: '#ef4444', label: '>= 124.5 mm' },
  { name: 'Extreme', value: 244.5, color: '#dc2626', label: '>= 244.5 mm' },
];

export const indiaCenter = [20.5937, 78.9629];

export const REGIME_DISTRIBUTION = [
  { id: 'active_monsoon', label: 'Active monsoon', count: 403, color: '#22c55e' },
  { id: 'break_monsoon', label: 'Break monsoon', count: 1230, color: '#f59e0b' },
  { id: 'depression', label: 'Depression', count: 131, color: '#ef4444' },
  { id: 'orographic', label: 'Orographic', count: 5115, color: '#a855f7' },
  { id: 'coastal', label: 'Coastal', count: 3847, color: '#06b6d4' },
  { id: 'western_disturbance', label: 'Western disturbance', count: 3426, color: '#6366f1' },
];

export const MODEL_CARDS = [
  {
    key: 'regime',
    name: 'Regime Classifier',
    algo: 'XGBoost XGBClassifier (fallback: Random Forest)',
    task: '6-class monsoon regime classification',
    metrics: [
      { label: 'Accuracy', value: '98.11%' },
      { label: 'Weighted F1', value: '0.9807' },
      { label: 'Macro F1', value: '0.9444' },
      { label: 'CV mean (5-fold)', value: '0.9239' },
      { label: 'Train / test', value: '11,321 / 2,831' },
    ],
    topFeature: 'Top features: wind speed (0.185), month (0.131), CAPE (0.130), radiation (0.082), pressure (0.079)',
    color: '#06b6d4',
  },
  {
    key: 'bias',
    name: 'Bias Corrector',
    algo: '6 per-regime XGBoost XGBRegressor models, soft-blended',
    task: 'Regress observed-like rainfall from raw NWP + features',
    metrics: [
      { label: 'Raw RMSE > Corrected', value: '24.83 > 7.14 mm' },
      { label: 'Improvement', value: '71.3%' },
      { label: 'R-squared (raw > corrected)', value: '-0.867 > 0.8458' },
      { label: 'Orographic RMSE', value: '14.98 (n=5,115)' },
      { label: 'Western disturbance RMSE', value: '15.33 (n=3,426)' },
    ],
    topFeature: 'Soft blending averages all 6 regime models by regime probability instead of a hard argmax.',
    color: '#8b5cf6',
  },
  {
    key: 'hurdle',
    name: 'Dry / Wet Hurdle',
    algo: 'XGBoost XGBClassifier (fallback: Gradient Boosting)',
    task: 'Binary P(observed >= 1.0mm), gates spurious rain on dry days',
    metrics: [
      { label: 'Zero threshold', value: 'p < 0.5 AND raw < 2mm > 0' },
      { label: 'Best config', value: 'n_estimators=250, depth=7, lr=0.05' },
      { label: 'Selection metric', value: 'AUC (or accuracy if single-class)' },
    ],
    topFeature: 'On the 2025 test, near-dry days still average 2.47mm served vs 0.10mm observed - over-prediction persists.',
    color: '#f59e0b',
  },
  {
    key: 'prob',
    name: 'Probability Estimator',
    algo: '4 independent XGBoost XGBClassifier models',
    task: 'P(rain >= 7.5 / 64.5 / 124.5 / 244.5 mm)',
    metrics: [
      { label: 'Brier @ 7.5mm', value: '0.1806 (train) . 0.109 (2025 test)' },
      { label: 'Brier @ 64.5mm', value: '0.2121 (train) . 0.0073 (2025 test)' },
      { label: 'Brier @ 124.5mm', value: '0.2153 (train)' },
      { label: 'AUC @ 124.5mm (2025)', value: '0.752, but POD = 0.000' },
    ],
    topFeature: 'Selected per-threshold by Brier score across 3 candidate configs.',
    color: '#ef4444',
  },
];

export const API_ENDPOINTS = [
  { method: 'GET', path: '/', desc: 'Root info' },
  { method: 'GET', path: '/api/v1/health', desc: 'Health check + model versions' },
  { method: 'GET', path: '/api/v1/forecast/process', desc: 'Full forecast for all districts' },
  { method: 'GET', path: '/api/v1/regime/classify/{date}', desc: 'Regime classification only' },
  { method: 'GET', path: '/api/v1/forecast/district/{district_id}', desc: 'Single district forecast' },
  { method: 'GET', path: '/api/v1/probability/map/{date}', desc: 'Probability map, all districts' },
  { method: 'GET', path: '/api/v1/forecast/table/{date}', desc: 'Tabular forecast data' },
  { method: 'GET', path: '/api/v1/verification/report/{date}', desc: 'Verification vs IMD observations' },
  { method: 'POST', path: '/api/v1/models/train', desc: 'Trigger retraining' },
  { method: 'GET', path: '/api/v1/models/versions', desc: 'List all model versions' },
  { method: 'GET', path: '/api/v1/models/latest', desc: 'Latest model metadata' },
  { method: 'POST', path: '/api/v1/models/evaluate', desc: 'Evaluate model on a specific date' },
];

export const MONTHLY_GAIN = [
  { month: 'Jan', gain: -20, disclosed: true },
  { month: 'Feb', gain: 12, disclosed: true },
  { month: 'Mar', gain: -15, disclosed: true },
  { month: 'Apr', gain: 11, disclosed: true },
  { month: 'May-Nov', gain: 9, disclosed: false },
  { month: 'Dec', gain: 21, disclosed: true },
];

export const WORST_CASES = [
  { id: 'mancherial', name: 'Mancherial', state: 'Telangana', date: '2025-09-08', raw: 3.2, corrected: 5.3, observed: 376.8, note: 'Extreme event, ~100x miss' },
  { id: 'mirzapur', name: 'Mirzapur', state: 'Uttar Pradesh', date: '2025-08-28', raw: 0.4, corrected: 13.8, observed: 315.3, note: 'False blowup + massive miss' },
  { id: 'kaimur', name: 'Kaimur', state: 'Bihar', date: '2025-10-30', raw: 21.7, corrected: 2.3, observed: 304.4, note: 'Dry-hurdle killed a real event' },
];

export const VERIFICATION_DATA = {
  continuous: {
    raw: { rmse: 14.10, mae: 5.60, medae: 0.30, p90: 17.0, p99: 59.4, r2: -0.33, r: 0.14, rho: 0.45, bias: 0.99, kge: 0.102 },
    served: { rmse: 12.98, mae: 5.23, medae: 0.00, p90: 16.0, p99: 50.7, r2: -0.13, r: 0.23, rho: 0.45, bias: 0.98, kge: 0.163 },
  },
  wetDay: {
    raw: { acc: 0.7343, prec: 0.4092, recall: 0.5330, f1: 0.4630, predWet: 26153 },
    served: { acc: 0.7475, prec: 0.4371, recall: 0.6074, f1: 0.5083, predWet: 27903 },
    obsWet: 20080,
    obsWetPct: 21.5,
  },
  thresholds: [
    { thr: 7.5, method: 'raw', pod: 0.345, far: 0.717, csi: 0.184, ets: 0.105, freqBias: 1.22 },
    { thr: 7.5, method: 'served', pod: 0.427, far: 0.677, csi: 0.225, ets: 0.144, freqBias: 1.32 },
    { thr: 24.5, method: 'served', pod: 0.120, far: 0.854, csi: 0.070, ets: 0.050, freqBias: 0.82 },
    { thr: 64.5, method: 'served', pod: 0.003, far: 0.933, csi: 0.003, ets: 0.002, freqBias: 0.04 },
    { thr: 124.5, method: 'served', pod: 0.000, far: null, csi: 0.000, ets: 0.000, freqBias: 0.00 },
  ],
  probabilistic: [
    { thr: '>= 7.5mm', brier: 0.109, bss: 0.070, auc: 0.762 },
    { thr: '>= 64.5mm', brier: 0.0073, bss: 0.005, auc: 0.786 },
    { thr: '>= 124.5mm', brier: null, bss: null, auc: 0.752 },
  ],
};

export const SEVERITY = {
  red: { label: 'Red', color: '#ef4444', action: 'Take action', bg: 'rgba(239,68,68,0.10)' },
  orange: { label: 'Orange', color: '#f97316', action: 'Be prepared', bg: 'rgba(249,115,22,0.10)' },
  yellow: { label: 'Yellow', color: '#eab308', action: 'Stay updated', bg: 'rgba(234,179,8,0.10)' },
};
