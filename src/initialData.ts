import { Automation, Appliance, EnergyStats, GridSettings } from './types';

export const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: 'peak-eco',
    name: 'Peak Hours Eco Mode',
    description: 'Automatically dims lights and adjusts HVAC when energy demand is highest.',
    category: 'energy',
    isActive: true,
    influenceCount: 12,
    impactValue: '-15% kWh',
    icon: 'Leaf',
    details: {
      targetDimming: 20, // percentage
      tempAdjustment: 1.5, // celsius adjustment during peak
      activeHours: '4 PM - 8 PM'
    }
  },
  {
    id: 'smart-sprinkler',
    name: 'Smart Sprinkler',
    description: 'Based on local rain forecast. Skips cycles when precipitation is predicted.',
    category: 'water',
    isActive: true,
    influenceCount: 3,
    impactValue: '-30% Water',
    icon: 'Droplet',
    details: {
      rainChanceThreshold: 50, // percent
      currentRainChance: 80,
      mode: 'Idle'
    }
  },
  {
    id: 'ev-charging',
    name: 'EV Scheduled Charging',
    description: 'Charges during lowest tariff rates between 12:00 AM and 5:00 AM.',
    category: 'ev',
    isActive: true,
    influenceCount: 1,
    impactValue: '-40% Cost',
    icon: 'Cpu',
    details: {
      startTime: '00:00',
      endTime: '05:00',
      chargingSpeed: 'Level 2 (7.2 kW)',
      nextCycleTime: 'Today, 11:45 PM'
    }
  },
  {
    id: 'solar-battery',
    name: 'Solar Excess Diversion',
    description: 'Directs excess solar generation into smart battery storage instead of grid feedback.',
    category: 'energy',
    isActive: false,
    influenceCount: 2,
    impactValue: '+8.2 kWh saved',
    icon: 'Sun',
    details: {
      batteryTargetSoc: 95, // battery state of charge target
      minimumGenerationThreshold: 2.5 // kW
    }
  },
  {
    id: 'heat-pump-opt',
    name: 'Smart Water Heat Pump',
    description: 'Pre-heats water using off-peak electricity before morning high-demand periods.',
    category: 'heating',
    isActive: true,
    influenceCount: 1,
    impactValue: '-12% Heating Cost',
    icon: 'ThermometerSun',
    details: {
      preheatTemp: 55, // degrees C
      scheduleTime: '02:00 AM - 04:30 AM'
    }
  }
];

export const INITIAL_APPLIANCES: Appliance[] = [
  {
    id: 'hvac',
    name: 'Central HVAC System',
    category: 'climate',
    powerUsage: 1450,
    isOptimized: true,
    isOn: true,
    dailyConsumptionKwh: 12.8
  },
  {
    id: 'kitchen-lights',
    name: 'Kitchen LED Canopy',
    category: 'lighting',
    powerUsage: 120,
    isOptimized: true,
    isOn: true,
    dailyConsumptionKwh: 0.8
  },
  {
    id: 'living-ac',
    name: 'Living Room Air Conditioner',
    category: 'climate',
    powerUsage: 850,
    isOptimized: false,
    isOn: false,
    dailyConsumptionKwh: 3.4
  },
  {
    id: 'sprinkler-pump',
    name: 'Garden Irrigation System',
    category: 'water',
    powerUsage: 450,
    isOptimized: true,
    isOn: false,
    dailyConsumptionKwh: 1.2
  },
  {
    id: 'ev-charger-unit',
    name: 'Tesla Wall Connector',
    category: 'charger',
    powerUsage: 7200,
    isOptimized: true,
    isOn: false,
    dailyConsumptionKwh: 24.5
  },
  {
    id: 'water-heater-pump',
    name: 'EcoSmart Hybrid Water Heater',
    category: 'climate',
    powerUsage: 1100,
    isOptimized: true,
    isOn: true,
    dailyConsumptionKwh: 6.2
  }
];

export const INITIAL_ENERGY_STATS: EnergyStats = {
  dailySavings: 4.20,
  carbonOffsetKg: 12.4,
  efficiencyScore: 94,
  gridHealth: 'Stable'
};

export const INITIAL_GRID_SETTINGS: GridSettings = {
  gridStandard: 'Northern European Grid Standards',
  peakTariffRate: 0.32,
  offPeakTariffRate: 0.14,
  homeSizeSqFt: 2200,
  solarCapacityKw: 4.5
};
