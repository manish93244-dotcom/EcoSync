import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Calendar, 
  Download, 
  TrendingUp, 
  Sun, 
  TrendingDown, 
  Zap, 
  Share2 
} from 'lucide-react';

interface UsageDataPoint {
  timeLabel: string;
  gridImportKwh: number;
  solarGeneratedKwh: number;
  costEstimate: number;
}

export default function UsageView() {
  const [activeInterval, setActiveInterval] = useState<'day' | 'week' | 'month'>('day');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // High fidelity datasets
  const dailyDataset: UsageDataPoint[] = [
    { timeLabel: '00:00', gridImportKwh: 1.2, solarGeneratedKwh: 0.0, costEstimate: 0.17 },
    { timeLabel: '04:00', gridImportKwh: 0.9, solarGeneratedKwh: 0.0, costEstimate: 0.13 },
    { timeLabel: '08:00', gridImportKwh: 2.1, solarGeneratedKwh: 1.1, costEstimate: 0.32 },
    { timeLabel: '12:00', gridImportKwh: 0.5, solarGeneratedKwh: 4.8, costEstimate: 0.07 },
    { timeLabel: '16:00', gridImportKwh: 3.8, solarGeneratedKwh: 2.5, costEstimate: 1.22 },
    { timeLabel: '20:00', gridImportKwh: 2.9, solarGeneratedKwh: 0.1, costEstimate: 0.93 },
  ];

  const weeklyDataset: UsageDataPoint[] = [
    { timeLabel: 'Mon', gridImportKwh: 14.2, solarGeneratedKwh: 10.4, costEstimate: 2.45 },
    { timeLabel: 'Tue', gridImportKwh: 12.8, solarGeneratedKwh: 11.2, costEstimate: 2.12 },
    { timeLabel: 'Wed', gridImportKwh: 15.6, solarGeneratedKwh: 8.9, costEstimate: 2.89 },
    { timeLabel: 'Thu', gridImportKwh: 11.1, solarGeneratedKwh: 15.1, costEstimate: 1.84 },
    { timeLabel: 'Fri', gridImportKwh: 13.9, solarGeneratedKwh: 12.0, costEstimate: 2.37 },
    { timeLabel: 'Sat', gridImportKwh: 9.4, solarGeneratedKwh: 16.8, costEstimate: 1.45 },
    { timeLabel: 'Sun', gridImportKwh: 10.5, solarGeneratedKwh: 17.5, costEstimate: 1.58 },
  ];

  const monthlyDataset: UsageDataPoint[] = [
    { timeLabel: 'Jan', gridImportKwh: 410, solarGeneratedKwh: 120, costEstimate: 84.10 },
    { timeLabel: 'Feb', gridImportKwh: 380, solarGeneratedKwh: 190, costEstimate: 75.40 },
    { timeLabel: 'Mar', gridImportKwh: 320, solarGeneratedKwh: 280, costEstimate: 62.30 },
    { timeLabel: 'Apr', gridImportKwh: 240, solarGeneratedKwh: 420, costEstimate: 45.10 },
    { timeLabel: 'May', gridImportKwh: 190, solarGeneratedKwh: 510, costEstimate: 31.80 },
    { timeLabel: 'Jun', gridImportKwh: 160, solarGeneratedKwh: 540, costEstimate: 28.50 },
  ];

  const getDataset = () => {
    if (activeInterval === 'week') return weeklyDataset;
    if (activeInterval === 'month') return monthlyDataset;
    return dailyDataset;
  };

  const currentDataset = getDataset();
  
  // Calculate stats summary
  const totalGridImport = currentDataset.reduce((sum, item) => sum + item.gridImportKwh, 0);
  const totalSolarGen = currentDataset.reduce((sum, item) => sum + item.solarGeneratedKwh, 0);
  const totalCost = currentDataset.reduce((sum, item) => sum + item.costEstimate, 0);

  // SVG dimensions for custom visual charts
  const width = 600;
  const height = 240;
  const padding = 40;
  
  const maxVal = Math.max(
    ...currentDataset.map(d => Math.max(d.gridImportKwh, d.solarGeneratedKwh))
  ) * 1.15 || 1;

  return (
    <div id="usage-view-container" className="space-y-10">
      
      {/* Title */}
      <section id="usage-header">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-on-surface pb-6">
          <div className="max-w-xl">
            <span className="caps text-on-surface-variant font-semibold mb-3 block">
              Historical Registry / Grid Ledger
            </span>
            <h2 className="font-headline text-5xl font-light italic leading-none mb-4">
              Power Ledger
            </h2>
            <p className="text-on-surface-variant text-base font-serif font-light leading-relaxed">
              Analyze historical telemetry, examine energy source ratios, and evaluate long-term financial saving profiles with high graphic fidelity.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex border border-on-surface bg-transparent p-1">
            {['day', 'week', 'month'].map((interval) => (
              <button
                key={interval}
                onClick={() => {
                  setActiveInterval(interval as any);
                  setHoveredPointIndex(null);
                }}
                className={`px-4 py-1 flex items-center justify-center text-xs caps tracking-widest font-semibold transition-all cursor-pointer ${
                  activeInterval === interval
                    ? 'bg-on-surface text-background'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {interval}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Aggregate Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-on-surface/15 p-6 flex items-center justify-between">
          <div>
            <span className="caps text-[10px] text-on-surface-variant mb-1 block">
              Grid Import
            </span>
            <span className="font-headline text-3xl font-light italic text-on-surface">
              {totalGridImport.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh
            </span>
          </div>
          <div className="w-8 h-8 border border-on-surface/15 flex items-center justify-center text-on-surface">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-surface border border-on-surface/15 p-6 flex items-center justify-between">
          <div>
            <span className="caps text-[10px] text-on-surface-variant mb-1 block">
              Clean Solar Gen
            </span>
            <span className="font-headline text-3xl font-light italic text-on-surface">
              {totalSolarGen.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh
            </span>
          </div>
          <div className="w-8 h-8 border border-on-surface/15 flex items-center justify-center text-on-surface">
            <Sun className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-surface border border-on-surface/15 p-6 flex items-center justify-between">
          <div>
            <span className="caps text-[10px] text-on-surface-variant mb-1 block">
              Estimated Cost
            </span>
            <span className="font-headline text-3xl font-light italic text-on-surface">
              ${totalCost.toFixed(2)}
            </span>
          </div>
          <div className="w-8 h-8 border border-on-surface/15 flex items-center justify-center text-on-surface">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Exquisite SVG Line Chart Panel */}
      <div className="bg-surface border border-on-surface/15 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-headline text-2xl italic font-light text-on-surface">Interactive Generation vs. Import Ratio</h3>
            <p className="text-xs text-on-surface-variant font-serif italic mt-1">Click or hover over chart parameters to audit custom interval points.</p>
          </div>
          <div className="flex gap-4 text-[10px] caps tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-neutral-400" /> Grid Load</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-on-surface" /> Solar</span>
          </div>
        </div>

        {/* Scalable Vector Graphics Visualizer */}
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid horizontal guidelines */}
            {[0, 1, 2, 3].map((g, gi) => {
              const y = padding + (gi * (height - 2 * padding)) / 3;
              return (
                <line 
                  key={gi} 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="#1A1A1A" 
                  strokeOpacity="0.1" 
                  strokeWidth="1"
                />
              );
            })}

            {/* Render bars and data points */}
            {currentDataset.map((d, index) => {
              const numPoints = currentDataset.length;
              const xRange = width - 2 * padding;
              const x = padding + (index * xRange) / (numPoints - 1 || 1);
              
              // Solar height
              const solarY = height - padding - (d.solarGeneratedKwh / maxVal) * (height - 2 * padding);
              // Grid height
              const gridY = height - padding - (d.gridImportKwh / maxVal) * (height - 2 * padding);

              const isHovered = hoveredPointIndex === index;

              return (
                <g key={d.timeLabel} className="cursor-pointer">
                  {/* Invisible broad hover target rectangle */}
                  <rect
                    x={x - 20}
                    y={padding}
                    width={40}
                    height={height - 2 * padding}
                    fill="transparent"
                    onMouseEnter={() => setHoveredPointIndex(index)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />

                  {/* Vertical coordinate guideline on hover */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding}
                      x2={x}
                      y2={height - padding}
                      stroke="#1A1A1A"
                      strokeDasharray="4,4"
                      strokeWidth="1"
                    />
                  )}

                  {/* Grid Point Marker */}
                  <circle
                    cx={x}
                    cy={gridY}
                    r={isHovered ? 6 : 4}
                    fill="#a3a3a3"
                    className="transition-all duration-150"
                  />

                  {/* Solar Point Marker */}
                  <circle
                    cx={x}
                    cy={solarY}
                    r={isHovered ? 6 : 4}
                    fill="#1A1A1A"
                    className="transition-all duration-150"
                  />

                  {/* Bottom Text Label */}
                  <text
                    x={x}
                    y={height - padding + 20}
                    fill="#1A1A1A"
                    fontSize="10"
                    textAnchor="middle"
                    className="caps font-bold fill-on-surface-variant font-mono"
                  >
                    {d.timeLabel}
                  </text>
                </g>
              );
            })}

            {/* Baseline draw line */}
            <line 
              x1={padding} 
              y1={height - padding} 
              x2={width - padding} 
              y2={height - padding} 
              stroke="#1A1A1A" 
              strokeOpacity="0.2" 
              strokeWidth="1"
            />
          </svg>

          {/* Custom absolute Popover markup on graph point interaction */}
          {hoveredPointIndex !== null && (
            <div 
              style={{ 
                left: `${(hoveredPointIndex / (currentDataset.length - 1)) * 80 + 10}%`,
                top: '20%'
              }}
              className="absolute pointer-events-none bg-on-surface text-background p-4 shadow-xl text-xs z-10 transition-all duration-150 border border-on-surface"
            >
              <p className="caps font-semibold border-b border-background/25 pb-1 flex items-center justify-between gap-10">
                <span>Node: {currentDataset[hoveredPointIndex].timeLabel}</span>
              </p>
              <div className="space-y-1 mt-2 font-serif font-light">
                <p className="flex justify-between gap-6">Grid Imported: <strong className="font-mono text-neutral-300">{currentDataset[hoveredPointIndex].gridImportKwh} kWh</strong></p>
                <p className="flex justify-between gap-6">Solar Clean Gen: <strong className="font-mono text-white">{currentDataset[hoveredPointIndex].solarGeneratedKwh} kWh</strong></p>
                <p className="flex justify-between gap-6">Calculated Fee: <strong className="font-mono">${currentDataset[hoveredPointIndex].costEstimate.toFixed(2)}</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historical Ledger Ledger list */}
      <section id="historical-ticker-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-headline text-2xl italic font-light flex items-center gap-2">
            <Calendar className="w-5 h-5 text-on-surface-variant/80" />
            Audit Ledger Log
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => alert('Grid database telemetry export triggered successfully in csv format.')}
              className="px-3 py-1.5 border border-on-surface/20 text-xs caps tracking-wider font-semibold hover:border-on-surface hover:bg-on-surface/5 transition-all flex items-center gap-2"
            >
              <Download size={12} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => alert('PDF generation process initiated.')}
              className="px-3 py-1.5 border border-on-surface/20 text-xs caps tracking-wider font-semibold hover:border-on-surface hover:bg-on-surface/5 transition-all flex items-center gap-2"
            >
              <Share2 size={12} />
              <span>Share Registry</span>
            </button>
          </div>
        </div>

        <div className="bg-surface border border-on-surface/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface border-b border-on-surface/15 text-[10px] tracking-widest font-bold uppercase text-on-surface-variant">
                  <th className="p-4 font-semibold">Time Entry</th>
                  <th className="p-4 font-semibold">Status Check</th>
                  <th className="p-4 font-semibold">Import Rate</th>
                  <th className="p-4 font-semibold">Solar Contribution</th>
                  <th className="p-4 text-right font-semibold">Net Savings Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-surface/10 text-on-surface">
                {[
                  { date: 'Today, 11:30 AM', status: 'Optimal Balanced', rate: '0.45 kWh', solar: '3.12 kWh', savings: '+$1.48' },
                  { date: 'Today, 08:15 AM', status: 'High Demand Trim', rate: '1.20 kWh', solar: '0.80 kWh', savings: '+$0.62' },
                  { date: 'Yesterday, 04:00 PM', status: 'Off-Peak Shift', rate: '0.30 kWh', solar: '2.55 kWh', savings: '+$2.11' },
                  { date: 'Yesterday, 01:20 PM', status: 'Surplus Export', rate: '0.00 kWh', solar: '4.90 kWh', savings: '+$3.40' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-on-surface/5 transition-colors font-serif font-light">
                    <td className="p-4 font-medium font-sans text-xs">{row.date}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold border border-on-surface/15 bg-on-surface/5 text-on-surface">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-on-surface-variant">{row.rate}</td>
                    <td className="p-4 font-mono text-xs text-on-surface">{row.solar}</td>
                    <td className="p-4 text-right font-bold text-on-surface font-mono">{row.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
