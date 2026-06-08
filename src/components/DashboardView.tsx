import { motion } from 'motion/react';
import { 
  Sun, 
  Settings, 
  Lightbulb, 
  Thermometer, 
  Zap, 
  Info, 
  Waves, 
  CheckCircle2, 
  XCircle,
  TrendingDown,
  Activity,
  Gauge
} from 'lucide-react';
import { Appliance, EnergyStats } from '../types';
import StatsRow from './StatsRow';

interface DashboardViewProps {
  appliances: Appliance[];
  onToggleAppliance: (id: string) => void;
  onToggleOptimization: (id: string) => void;
  stats: EnergyStats;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export default function DashboardView({
  appliances,
  onToggleAppliance,
  onToggleOptimization,
  stats,
  isSimulating,
  onToggleSimulation
}: DashboardViewProps) {
  
  // Calculate aggregate live load
  const totalLiveLoad = appliances
    .filter(a => a.isOn)
    .reduce((acc, curr) => {
      // If optimized, usage is reduced during peak periods
      const actualPower = curr.isOptimized ? curr.powerUsage * 0.8 : curr.powerUsage;
      return acc + actualPower;
    }, 0);

  // Solar simulation values
  const simulatedSolarGen = isSimulating ? 3420 : 1200; // in Watts
  const gridNetFlow = totalLiveLoad - simulatedSolarGen;

  const getSgIcon = (cat: string) => {
    switch (cat) {
      case 'climate': return <Thermometer className="w-5 h-5" />;
      case 'lighting': return <Lightbulb className="w-5 h-5" />;
      case 'water': return <Waves className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div id="dashboard-view-container" className="space-y-10">
      {/* Editorial Title */}
      <section id="dashboard-welcome" className="mb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-on-surface pb-6">
          <div className="max-w-xl font-serif">
            <span className="caps text-on-surface-variant font-semibold mb-3 block">
              {isSimulating ? 'SIMULAR STATE: SURPLUS' : 'LIVE GRID TELEMETRY'}
            </span>
            <h2 className="font-headline text-5xl font-light italic leading-none mb-4 text-on-surface">
              Grid Diagnostics
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed font-serif font-light">
              Interactive diagnostic dashboard. Monitor smart meters, calculate consumption profiles, and toggle appliances below with museum-grade precision.
            </p>
          </div>
          <button
            id="simulation-trigger-btn"
            onClick={onToggleSimulation}
            className={`px-4 py-2 border text-xs caps tracking-widest font-semibold transition-all ${
              isSimulating
                ? 'bg-on-surface text-background border-on-surface font-bold'
                : 'bg-transparent border-on-surface/30 text-on-surface hover:border-on-surface hover:bg-on-surface/5'
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Solar Feed High' : 'Simulate Surplus'}</span>
          </button>
        </div>
      </section>

      {/* Dynamic Stats Grid */}
      <StatsRow stats={stats} />

      {/* Energy Stream / Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Live Diagram Card */}
        <div className="lg:col-span-7 bg-surface border border-on-surface/15 p-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 pb-4 border-b border-on-surface/10">
              <h3 className="font-headline text-2xl italic font-light text-on-surface flex items-center gap-2">
                Live Power Flow Diagram
              </h3>
              <span className="text-[10px] caps font-semibold text-on-surface-variant">
                Total load: {totalLiveLoad.toLocaleString()} W
              </span>
            </div>

            {/* Visualizer Flow Box */}
            <div className="h-44 border border-on-surface/10 bg-surface-container-low flex items-center justify-around p-4 relative overflow-hidden rounded-none">
              
              {/* Solar Node */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-14 h-14 border flex items-center justify-center transition-all ${
                  isSimulating 
                    ? 'border-on-surface bg-on-surface text-background scale-110 shadow-lg' 
                    : 'border-on-surface/20 text-on-surface-variant'
                }`}>
                  <Sun className="w-6 h-6" />
                </div>
                <span className="text-[11px] caps mt-2">Solar Panel</span>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  +{simulatedSolarGen} W
                </span>
              </div>

              {/* Central Controller */}
              <div className="flex flex-col items-center z-10">
                <div className="w-16 h-16 border-2 border-on-surface bg-on-surface flex items-center justify-center text-background relative">
                  <Gauge className="w-6 h-6" />
                </div>
                <span className="text-[11px] caps mt-2 font-bold">Nitro Hub</span>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-400">Active</span>
              </div>

              {/* House Load Node */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-14 h-14 border flex items-center justify-center transition-all ${
                  totalLiveLoad > 0 
                    ? 'border-on-surface bg-on-surface/5 text-on-surface scale-105' 
                    : 'border-on-surface/10 text-on-surface-variant'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[11px] caps mt-2">House Load</span>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  {totalLiveLoad} W
                </span>
              </div>

              {/* Streaming particle lines simulated with CSS absolute layers */}
              <div className="absolute left-[15%] right-[15%] top-[45%] h-1 border-t border-dashed border-on-surface/25 -z-0"></div>
            </div>
          </div>

          <div id="diagram-footer" className="mt-4 pt-4 border-t border-on-surface/15 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-on-surface-variant gap-2">
            <span className="flex items-center gap-1.5 font-serif italic text-on-surface-variant">
              <Info size={14} className="text-on-surface shrink-0" />
              {gridNetFlow < 0 
                ? 'Exporting excess clean energy back to the grid.' 
                : 'Importing remaining demand offset from sustainable grid sources.'
              }
            </span>
            <span className="font-mono text-[11px] font-bold text-on-surface uppercase tracking-wider">
              Net import: {gridNetFlow > 0 ? `${gridNetFlow} W` : '0 W'}
            </span>
          </div>
        </div>

        {/* Live Summary Stats Card */}
        <div className="lg:col-span-5 bg-surface border border-on-surface/15 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-2xl italic font-light mb-4 text-on-surface">Grid Health & Tariffs</h3>
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low border border-on-surface/10">
                <span className="text-[10px] caps text-on-surface-variant font-semibold block mb-1">
                  Peak Price Rate
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="font-headline text-2xl font-light italic text-on-surface">$0.32 <span className="text-xs font-serif font-light text-on-surface-variant">/ kWh</span></span>
                  <span className="text-[9px] font-bold uppercase tracking-widest border border-on-surface bg-on-surface text-background px-2 py-0.5">Active 4PM-8PM</span>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low border border-on-surface/10">
                <span className="text-[10px] caps text-on-surface-variant font-semibold block mb-1">
                  Off-Peak Price Rate
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="font-headline text-2xl font-light italic text-on-surface">$0.14 <span className="text-xs font-serif font-light text-on-surface-variant">/ kWh</span></span>
                  <span className="text-[9px] font-bold uppercase tracking-widest border border-on-surface/20 text-on-surface-variant px-2 py-0.5">Standard Economy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-surface border border-on-surface/15 flex items-center gap-3">
            <TrendingDown className="text-on-surface w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface">Weekly carbon reduction</h4>
              <p className="text-xs font-serif italic text-on-surface-variant">Saved 14.8kg CO₂, equivalent to planting 1 new high-absorption Douglas Fir.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Connected Appliances Panel */}
      <section id="appliances-control" className="space-y-4 pt-6 border-t border-on-surface/10">
        <h3 className="font-headline text-3xl font-light italic">Connected Smart Appliances</h3>
        <p className="text-sm font-serif font-light text-on-surface-variant max-w-2xl mb-6">
          Toggle appliances directly to simulate usage impact on efficiency scorecard, daily savings, and live flow loads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliances.map((appliance) => {
            const currentWatts = appliance.isOptimized ? appliance.powerUsage * 0.8 : appliance.powerUsage;
            return (
              <div 
                id={`appliance-card-${appliance.id}`}
                key={appliance.id}
                className={`p-6 border transition-all flex flex-col justify-between h-[180px] ${
                  appliance.isOn 
                    ? 'bg-surface border-on-surface' 
                    : 'bg-surface-container-low border-on-surface/15 opacity-70'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 border flex items-center justify-center ${
                      appliance.isOn ? 'border-on-surface text-on-surface' : 'border-on-surface/10 text-on-surface-variant/40'
                    }`}>
                      {getSgIcon(appliance.category)}
                    </div>
                    <div>
                      <h4 className="font-headline text-lg italic font-light text-on-surface leading-tight">
                        {appliance.name}
                      </h4>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant">
                        {appliance.category}
                      </span>
                    </div>
                  </div>

                  {/* Appliance On/Off toggle */}
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={appliance.isOn} 
                      onChange={() => onToggleAppliance(appliance.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-surface border border-on-surface/20 peer-focus:outline-none peer peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-on-surface after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-on-surface after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-on-surface/10"></div>
                  </label>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div className="text-xs">
                    <span className="text-[9px] uppercase tracking-wider text-on-surface-variant block">Draw Load</span>
                    <span className="font-headline text-xl italic font-light text-on-surface">
                      {appliance.isOn ? `${Math.round(currentWatts)} W` : '0 W'}
                    </span>
                  </div>

                  {/* Eco Optimization Check */}
                  {appliance.isOn && (
                    <button
                      id={`opt-btn-${appliance.id}`}
                      onClick={() => onToggleOptimization(appliance.id)}
                      className={`text-[10px] uppercase font-semibold tracking-wider px-3 py-1 border border-on-surface/25 bg-transparent hover:bg-on-surface/5 transition-all flex items-center gap-1.5 ${
                        appliance.isOptimized ? 'text-on-surface border-on-surface font-bold' : 'text-on-surface'
                      }`}
                    >
                      {appliance.isOptimized ? (
                        <>
                          <CheckCircle2 size={12} className="text-on-surface" />
                          <span>Eco On</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="text-on-surface-variant/40" />
                          <span>Optimize</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
