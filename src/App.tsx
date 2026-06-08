import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  BarChart3, 
  SlidersHorizontal, 
  Settings as SettingsIcon,
  Check,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

import Header from './components/Header';
import DashboardView from './components/DashboardView';
import UsageView from './components/UsageView';
import AutomationsView from './components/AutomationsView';
import SettingsView from './components/SettingsView';

import { 
  INITIAL_AUTOMATIONS, 
  INITIAL_APPLIANCES, 
  INITIAL_GRID_SETTINGS 
} from './initialData';
import { Automation, Appliance, EnergyStats, GridSettings } from './types';

export default function App() {
  // Start on 'automations' to immediately display the exact screen requested by the user!
  const [activeTab, setActiveTab] = useState<'dashboard' | 'usage' | 'automations' | 'settings'>('automations');
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);
  const [appliances, setAppliances] = useState<Appliance[]>(INITIAL_APPLIANCES);
  const [gridSettings, setGridSettings] = useState<GridSettings>(INITIAL_GRID_SETTINGS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeNotificationsCount, setActiveNotificationsCount] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);

  // Toggle absolute status of an automation flow
  const handleToggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
    
    // Trigger simple user notification of action
    setActiveNotificationsCount(prev => prev + 1);
  };

  // Add a newly customized automation flow
  const handleAddAutomation = (newAuto: Omit<Automation, 'id'>) => {
    const id = `custom-${Date.now()}`;
    const formatted: Automation = {
      ...newAuto,
      id
    };
    setAutomations(prev => [...prev, formatted]);
  };

  // Toggle power state of connected smart appliances
  const handleToggleAppliance = (id: string) => {
    setAppliances(prev => prev.map(a => 
      a.id === id ? { ...a, isOn: !a.isOn } : a
    ));
  };

  // Toggles the eco optimization draw reducer on an individual appliance
  const handleToggleOptimization = (id: string) => {
    setAppliances(prev => prev.map(a => 
      a.id === id ? { ...a, isOptimized: !a.isOptimized } : a
    ));
  };

  // Update dynamic grid preferences
  const handleUpdateSettings = (newSettings: Partial<GridSettings>) => {
    setGridSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Dynamically estimate and compute Energy Stats based on current automation and appliance weights
  const [derivedStats, setDerivedStats] = useState<EnergyStats>({
    dailySavings: 4.20,
    carbonOffsetKg: 12.4,
    efficiencyScore: 94,
    gridHealth: 'Stable'
  });

  useEffect(() => {
    // 1. Calculate savings
    let baseSavings = 0.50;
    // Add savings from active automations
    const ecoActive = automations.find(a => a.id === 'peak-eco')?.isActive;
    const sprinklerActive = automations.find(a => a.id === 'smart-sprinkler')?.isActive;
    const evActive = automations.find(a => a.id === 'ev-charging')?.isActive;
    const heatActive = automations.find(a => a.id === 'heat-pump-opt')?.isActive;

    if (ecoActive) baseSavings += 1.80;
    if (sprinklerActive) baseSavings += 0.80;
    if (evActive) baseSavings += 1.30;
    if (heatActive) baseSavings += 0.70;

    // Add penalty/gain from appliance configurations
    appliances.forEach(app => {
      if (app.isOn) {
        if (app.isOptimized) {
          baseSavings += 0.20; // saving premium
        } else {
          baseSavings -= 0.15; // penalty for unoptimized draw
        }
      } else {
        baseSavings += 0.10; // saved cost by shutting down appliances
      }
    });

    if (isSimulating) baseSavings += 1.40; // extra solar export savings

    // 2. Carbon Offset
    let baseCarbon = 4.2;
    if (ecoActive) baseCarbon += 4.2;
    if (sprinklerActive) baseCarbon += 0.6;
    if (evActive) baseCarbon += 3.4;
    if (heatActive) baseCarbon += 1.6;

    // Subtract factor from active high wattage drawing appliances
    const activeWattage = appliances
      .filter(a => a.isOn)
      .reduce((sum, current) => sum + (current.isOptimized ? current.powerUsage * 0.8 : current.powerUsage), 0);
    
    // High draw reduces short term offset, solar capacity improves it
    const loadReductionRatio = activeWattage / 20000;
    baseCarbon -= loadReductionRatio;
    baseCarbon += (gridSettings.solarCapacityKw * 0.4);

    // 3. Efficiency Score
    let baseScore = 65;
    const totalAutos = automations.length;
    const activeAutos = automations.filter(a => a.isActive).length;
    const autoRatio = totalAutos > 0 ? activeAutos / totalAutos : 0;
    baseScore += Math.round(autoRatio * 20);

    const activeApps = appliances.filter(a => a.isOn);
    if (activeApps.length > 0) {
      const optimizedApps = activeApps.filter(a => a.isOptimized);
      const optRatio = optimizedApps.length / activeApps.length;
      baseScore += Math.round(optRatio * 15);
    } else {
      baseScore += 1// Default buffer
    }

    if (isSimulating) baseScore += 4;
    const finalScore = Math.min(100, Math.max(10, baseScore));

    // 4. Grid Health assessment
    let finalGridHealth: 'Stable' | 'High Demand' | 'Critical' | 'Optimal' = 'Stable';
    if (activeWattage > 8000) {
      finalGridHealth = ecoActive ? 'Stable' : 'High Demand';
    } else if (isSimulating && activeWattage < 3000) {
      finalGridHealth = 'Optimal';
    }

    setDerivedStats({
      dailySavings: parseFloat(baseSavings.toFixed(2)),
      carbonOffsetKg: parseFloat(baseCarbon.toFixed(1)),
      efficiencyScore: finalScore,
      gridHealth: finalGridHealth
    });

  }, [automations, appliances, gridSettings, isSimulating]);

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen pb-28 relative">
      
      {/* Top Header Component */}
      <Header 
        onNotifyClick={() => setShowNotifications(!showNotifications)} 
        activeNotificationsCount={activeNotificationsCount}
      />

      {/* Notifications Drawer Widget */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-18 right-6 w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-xl z-50 p-4"
          >
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2 mb-3">
              <h5 className="font-headline font-bold text-sm">System Intercept Log</h5>
              <button 
                onClick={() => {
                  setActiveNotificationsCount(0);
                  setShowNotifications(false);
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Clear logs
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 hide-scrollbar">
              <div className="flex gap-2.5 text-xs">
                <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-on-surface">Luminous Engine active</p>
                  <p className="text-on-surface-variant text-[10px] font-mono">18m ago • Local Sync</p>
                </div>
              </div>
              <div className="flex gap-2.5 text-xs">
                <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-on-surface">Off-Peak EV charging scheduled</p>
                  <p className="text-on-surface-variant text-[10px] font-mono">1h ago • EV Connection</p>
                </div>
              </div>
              {activeNotificationsCount > 2 && (
                <div id="dynamic-notification-alert" className="flex gap-2.5 text-xs bg-primary/5 p-2 rounded-lg border border-primary/10">
                  <span className="text-primary font-mono font-bold text-[10px] uppercase">Telemetry</span>
                  <div>
                    <p className="font-bold text-primary">State Variable Recalculated</p>
                    <p className="text-on-surface-variant text-[10px]">Smart Appliance or Active Automation weights updated successfully.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Module Workspace */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            id="tab-view-root"
          >
            {activeTab === 'dashboard' && (
              <DashboardView 
                appliances={appliances} 
                onToggleAppliance={handleToggleAppliance}
                onToggleOptimization={handleToggleOptimization}
                stats={derivedStats}
                isSimulating={isSimulating}
                onToggleSimulation={() => setIsSimulating(!isSimulating)}
              />
            )}

            {activeTab === 'usage' && (
              <UsageView />
            )}

            {activeTab === 'automations' && (
              <AutomationsView 
                automations={automations} 
                onToggleAutomation={handleToggleAutomation}
                onAddAutomation={handleAddAutomation}
                stats={derivedStats}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                settings={gridSettings}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footnote Visual Section - strictly matching the screenshot details */}
        <section id="system-footnote" className="mt-20 flex flex-col items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-8"></div>
          <p className="font-label text-sm text-on-surface-variant flex items-center gap-2 select-none">
            <CheckCircle2 className="text-primary w-4.5 h-4.5 fill-primary/10" />
            <span>System algorithms are optimized for <strong className="font-bold">{gridSettings.gridStandard}</strong></span>
          </p>
        </section>
      </main>

      {/* Persistent Glass Navigation Bar */}
      <nav id="persistent-nav-bar" className="fixed bottom-0 left-0 right-0 glass-nav border-t border-outline-variant/10 px-8 py-3 flex justify-between items-center z-50">
        
        {/* Dashboard Tab */}
        <button
          id="btn-nav-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'dashboard' ? 'text-primary' : 'text-on-surface-variant opacity-60 hover:opacity-100'
          }`}
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="font-label text-[10px] font-medium uppercase tracking-wider">Dashboard</span>
          {activeTab === 'dashboard' && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />}
        </button>

        {/* Usage Tab */}
        <button
          id="btn-nav-usage"
          onClick={() => setActiveTab('usage')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'usage' ? 'text-primary' : 'text-on-surface-variant opacity-60 hover:opacity-100'
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="font-label text-[10px] font-medium uppercase tracking-wider">Usage</span>
          {activeTab === 'usage' && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />}
        </button>

        {/* Automations Tab */}
        <button
          id="btn-nav-automations"
          onClick={() => setActiveTab('automations')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'automations' ? 'text-primary' : 'text-on-surface-variant opacity-100'
          }`}
        >
          <SlidersHorizontal className="w-6 h-6" />
          <span className="font-label text-[10px] font-bold uppercase tracking-wider">Automations</span>
          {activeTab === 'automations' && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />}
        </button>

        {/* Settings Tab */}
        <button
          id="btn-nav-settings"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'settings' ? 'text-primary' : 'text-on-surface-variant opacity-60 hover:opacity-100'
          }`}
        >
          <SettingsIcon className="w-6 h-6" />
          <span className="font-label text-[10px] font-medium uppercase tracking-wider">Settings</span>
          {activeTab === 'settings' && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />}
        </button>

      </nav>

    </div>
  );
}
