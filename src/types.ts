export interface Automation {
  id: string;
  name: string;
  description: string;
  category: 'energy' | 'water' | 'ev' | 'heating';
  isActive: boolean;
  influenceCount: number;
  impactValue: string; // e.g. "-15% kWh", "Skips cycle"
  icon: string; // lucide icon identifier
  details?: {
    [key: string]: any;
  };
}

export interface Appliance {
  id: string;
  name: string;
  category: 'climate' | 'lighting' | 'water' | 'charger' | 'appliance';
  powerUsage: number; // in Watts
  isOptimized: boolean;
  isOn: boolean;
  dailyConsumptionKwh: number;
}

export interface EnergyStats {
  dailySavings: number;
  carbonOffsetKg: number;
  efficiencyScore: number;
  gridHealth: 'Stable' | 'High Demand' | 'Critical' | 'Optimal';
}

export interface GridSettings {
  gridStandard: string;
  peakTariffRate: number; // $/kWh
  offPeakTariffRate: number; // $/kWh
  homeSizeSqFt: number;
  solarCapacityKw: number;
}
