import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  HelpCircle, 
  Radio, 
  Flame, 
  Database, 
  Building, 
  Coins, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { GridSettings } from '../types';

interface SettingsViewProps {
  settings: GridSettings;
  onUpdateSettings: (newSettings: Partial<GridSettings>) => void;
}

export default function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const [successMsg, setSuccessMsg] = useState(false);
  const [optimizerStance, setOptimizerStance] = useState<'Standard' | 'Aggressive' | 'Maximum Savings'>('Standard');
  const [homeSquareFeet, setHomeSquareFeet] = useState(settings.homeSizeSqFt);
  const [solarCap, setSolarCap] = useState(settings.solarCapacityKw);
  const [selectedStandard, setSelectedStandard] = useState(settings.gridStandard);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      gridStandard: selectedStandard,
      homeSizeSqFt: homeSquareFeet,
      solarCapacityKw: solarCap
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div id="settings-view-container" className="space-y-10">
      
      {/* Editorial Title */}
      <section id="settings-header">
        <div className="max-w-xl mb-4 border-b border-on-surface pb-6">
          <span className="caps text-on-surface-variant font-semibold mb-3 block">
            CONFIGURATION
          </span>
          <h2 className="font-headline text-5xl font-light italic leading-none mb-4 text-on-surface">
            Settings Registry
          </h2>
          <p className="text-on-surface-variant text-base font-serif font-light leading-relaxed">
            Manage utility regions, calibrate baseline parameters, adjust home sq-footage profiles, and configure algorithmic aggression thresholds.
          </p>
        </div>
      </section>

      {/* Grid Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form panel */}
        <div className="lg:col-span-8 bg-surface border border-on-surface/15 p-6 rounded-none">
          <form id="settings-form" onSubmit={handleSave} className="space-y-6">
            
            <div className="border-b border-on-surface/10 pb-4 mb-4">
              <h3 className="font-headline text-2xl italic font-light text-on-surface">Smart Meter & Integration</h3>
              <p className="text-xs text-on-surface-variant font-serif italic mt-1">Calibrate smart endpoints matching physical region nodes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 flex items-center gap-1.5">
                  <Building size={12} /> Grid Region Standard
                </label>
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-2.5 border border-on-surface/15 focus:border-on-surface outline-none text-on-surface text-sm rounded-none"
                >
                  <option value="Northern European Grid Standards">Northern European Grid Standards</option>
                  <option value="US Eastern Interconnection">US Eastern Interconnection (PJM)</option>
                  <option value="UK National Electricity Grid">UK National Grid Co.</option>
                  <option value="Australian NEM Grid Standards">Australian NEM (East Coast)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 flex items-center gap-1.5">
                  <Coins size={12} /> Active Currency Standard
                </label>
                <select
                  defaultValue="USD"
                  className="w-full bg-surface-container-low px-4 py-2.5 border border-on-surface/15 focus:border-on-surface outline-none text-on-surface text-sm rounded-none"
                >
                  <option value="USD">USD ($ - Dollars)</option>
                  <option value="EUR">EUR (€ - Euros)</option>
                  <option value="GBP">GBP (£ - Pounds)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Home Square Footage (sq ft)
                </label>
                <input
                  type="number"
                  value={homeSquareFeet}
                  onChange={(e) => setHomeSquareFeet(parseInt(e.target.value) || 0)}
                  className="w-full bg-surface-container-low px-4 py-2.5 border border-on-surface/15 focus:border-on-surface outline-none text-on-surface text-sm font-mono rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Solar Panel Capacity (kWp)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={solarCap}
                  onChange={(e) => setSolarCap(parseFloat(e.target.value) || 0)}
                  className="w-full bg-surface-container-low px-4 py-2.5 border border-on-surface/15 focus:border-on-surface outline-none text-on-surface text-sm font-mono rounded-none"
                />
              </div>
            </div>

            <div className="border-t border-on-surface/10 pt-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-1.5">
                <Flame size={12} /> Luminous Engine Aggression Settings
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'Standard', desc: 'Saves energy smoothly without comfort compromise' },
                  { value: 'Aggressive', desc: 'Limits non-critical load draws dynamically' },
                  { value: 'Maximum Savings', desc: 'Maximum load shifting, prioritizes lowest cost margins' }
                ].map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setOptimizerStance(tier.value as any)}
                    className={`p-4 border text-left flex flex-col justify-between transition-all cursor-pointer rounded-none min-h-[110px] ${
                      optimizerStance === tier.value
                        ? 'bg-on-surface/5 border-on-surface text-on-surface'
                        : 'bg-surface-container-low border-on-surface/10 hover:border-on-surface/30 text-on-surface-variant'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase tracking-wider">{tier.value}</span>
                    <span className="text-[10px] mt-2 font-serif font-light text-on-surface-variant tracking-tight leading-snug">
                      {tier.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save trigger */}
            <div className="pt-6 border-t border-on-surface/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {successMsg ? (
                <span className="text-xs text-on-surface font-semibold flex items-center gap-1.5 animate-pulse font-serif italic">
                  <CheckCircle2 size={13} className="text-on-surface" /> Telemetry preferences saved. Nitro Hub updated successfully!
                </span>
              ) : (
                <span className="text-xs text-on-surface-variant/70 font-serif italic">
                  Changes will be written directly into the local storage controller.
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-on-surface text-background font-semibold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer shrink-0"
              >
                Apply Framework Changes
              </button>
            </div>

          </form>
        </div>

        {/* Informative Side bar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface text-on-surface p-6 border border-on-surface/15 rounded-none">
            <Shield className="text-on-surface-variant w-6 h-6 mb-4" />
            <h3 className="font-headline text-2xl font-light italic mb-2">Cryptographic Safeguard</h3>
            <p className="text-xs font-serif leading-relaxed font-light text-on-surface-variant">
              We care about your privacy. Nitro telemetry logs are processed completely locally in compliance with General Data Protection Regulation and Western European Power Grid Guidelines.
              Encryption uses robust locally validated keys, keeping metadata invisible to third parties.
            </p>
          </div>

          <div className="bg-surface-container-low p-6 border border-on-surface/10 rounded-none font-serif">
            <h4 className="font-headline text-lg font-light italic mb-3">Diagnostic Information</h4>
            <div className="space-y-2 text-xs font-mono text-on-surface-variant">
              <p className="flex justify-between">Firmware: <span className="font-bold text-on-surface">v3.9.44r</span></p>
              <p className="flex justify-between">Node Latency: <span className="font-bold text-on-surface">18ms</span></p>
              <p className="flex justify-between">API Standard: <span className="font-bold text-on-surface">W-API Gen2</span></p>
              <p className="flex justify-between">Sync State: <span className="font-bold text-on-surface">Connected</span></p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
