import { useState } from 'react';
import RegimePanel from '../panels/RegimePanel';
import SummaryStats from '../SummaryStats';
import RainfallMap from '../maps/RainfallMap';
import DistrictTable from '../tables/DistrictTable';
import HeavyRainProbability from '../HeavyRainProbability';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import VerificationPanel from '../panels/VerificationPanel';

export default function DashboardView({ regime, districts, verificationData, setSelectedDistrict }) {
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null);

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-slide-up delay-1">
        <div className="lg:col-span-2"><RegimePanel regime={regime} /></div>
        <div><SummaryStats districts={districts} /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 animate-fade-slide-up delay-2">
        <div className="lg:col-span-3 h-[520px]"><RainfallMap districts={districts} onDistrictClick={setSelectedDistrict} /></div>
        <div className="lg:col-span-2 h-[520px]">
          <DistrictTable
            districts={districts}
            onDistrictClick={setSelectedDistrict}
            hoveredDistrict={hoveredDistrictId}
            onRowHover={setHoveredDistrictId}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-slide-up delay-3">
        <div><HeavyRainProbability districts={districts} /></div>
        <div><TimeSeriesChart districts={districts} /></div>
        <div><VerificationPanel verification={verificationData} /></div>
      </div>
    </div>
  );
}
