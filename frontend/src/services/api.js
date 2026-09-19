import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';
const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

export const fetchForecast = async (date, leadTime = 24) => {
  const { data } = await api.get('/forecast/process', { params: { date, lead_time: leadTime } });
  return data;
};

export const fetchVerificationReport = async (date, leadTime = 24) => {
  const { data } = await api.get('/verification/report/' + date, { params: { lead_time: leadTime } });
  return data;
};

export const fetchDistricts = async (date) => {
  const d = date || new Date().toISOString().split('T')[0];
  const { data } = await api.get('/forecast/table/' + d, { params: { lead_time: 24 } });
  return data;
};

export const fetchDistrictSearch = async (query, date) => {
  const d = date || new Date().toISOString().split('T')[0];
  const { data } = await api.get('/forecast/table/' + d, { params: { lead_time: 24 } });
  const districts = data.districts || [];
  const ql = query.toLowerCase();
  return {
    results: districts
      .filter(district => district.name?.toLowerCase().includes(ql) || district.state?.toLowerCase().includes(ql))
      .slice(0, 50)
  };
};

export const fetchHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export const fetchModelVersions = async () => {
  const { data } = await api.get('/models/versions');
  return data;
};

export const fetchLatestModel = async () => {
  const { data } = await api.get('/models/latest');
  return data;
};

export default api;
