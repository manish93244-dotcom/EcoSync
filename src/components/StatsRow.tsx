import { motion } from 'motion/react';
import { EnergyStats } from '../types';

interface StatsRowProps {
  stats: EnergyStats;
  className?: string;
}

export default function StatsRow({ stats, className = '' }: StatsRowProps) {
  const items = [
    {
      id: 'stat-savings',
      label: 'Daily Savings',
      value: `$${stats.dailySavings.toFixed(2)}`,
      sub: 'vs standard tariff',
      accentClass: 'text-on-surface'
    },
    {
      id: 'stat-carbon',
      label: 'Carbon Offset',
      value: `${stats.carbonOffsetKg.toFixed(1)}kg`,
      sub: 'CO₂ equivalent',
      accentClass: 'text-on-surface'
    },
    {
      id: 'stat-efficiency',
      label: 'Efficiency Score',
      value: `${stats.efficiencyScore}/100`,
      sub: 'Peak optimized',
      accentClass: 'text-primary'
    },
    {
      id: 'stat-grid',
      label: 'Grid Health',
      value: stats.gridHealth,
      sub: '50Hz Sync',
      accentClass: stats.gridHealth === 'Critical' ? 'text-red-600' : 'text-on-surface'
    }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          id={item.id}
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className="p-6 bg-surface border border-on-surface/15 flex flex-col justify-between"
        >
          <div>
            <p className="caps text-[10px] text-on-surface-variant font-semibold mb-2">
              {item.label}
            </p>
            <p className={`font-headline text-3xl italic font-light tracking-tight ${item.accentClass}`}>
              {item.value}
            </p>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 font-mono uppercase tracking-wider mt-2">{item.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
