import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter as FilterIcon, 
  Plus, 
  Sparkles, 
  Lightbulb, 
  Thermometer, 
  Cloud,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Automation, EnergyStats } from '../types';
import IconResolver from './IconResolver';
import StatsRow from './StatsRow';

interface AutomationsViewProps {
  automations: Automation[];
  onToggleAutomation: (id: string) => void;
  onAddAutomation: (newAutomation: Omit<Automation, 'id'>) => void;
  stats: EnergyStats;
}

export default function AutomationsView({ 
  automations, 
  onToggleAutomation, 
  onAddAutomation,
  stats
}: AutomationsViewProps) {
  const [showNewFlowModal, setShowNewFlowModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for new automation flow
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowDescription, setNewFlowDescription] = useState('');
  const [newFlowCategory, setNewFlowCategory] = useState<'energy' | 'water' | 'ev' | 'heating'>('energy');
  const [newFlowImpact, setNewFlowImpact] = useState('-10% kWh');
  const [newFlowInfluences, setNewFlowInfluences] = useState(4);
  const [newFlowIcon, setNewFlowIcon] = useState('Leaf');

  const activeFlowsCount = automations.filter(a => a.isActive).length;

  const handleCreateFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowName.trim() || !newFlowDescription.trim()) return;

    onAddAutomation({
      name: newFlowName,
      description: newFlowDescription,
      category: newFlowCategory,
      isActive: true, // auto active
      influenceCount: newFlowInfluences,
      impactValue: newFlowImpact,
      icon: newFlowIcon,
      details: {
        createdDate: new Date().toLocaleDateString()
      }
    });

    // Reset Form
    setNewFlowName('');
    setNewFlowDescription('');
    setNewFlowCategory('energy');
    setNewFlowImpact('-10% kWh');
    setNewFlowInfluences(4);
    setNewFlowIcon('Leaf');
    setShowNewFlowModal(false);
  };

  // Filter automations list based on search and category
  const filteredAutomations = automations.filter(auto => {
    const matchesCategory = selectedCategory === 'all' || auto.category === selectedCategory;
    const matchesSearch = auto.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          auto.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Extract specifically requested core/featured automations for high-fidelity presentation
  const peakEcoFlow = automations.find(a => a.id === 'peak-eco');
  const sprinklerFlow = automations.find(a => a.id === 'smart-sprinkler');
  const evFlow = automations.find(a => a.id === 'ev-charging');

  // Any custom automations or others
  const secondaryFlows = filteredAutomations.filter(
    a => a.id !== 'peak-eco' && a.id !== 'smart-sprinkler' && a.id !== 'ev-charging'
  );

  return (
    <div id="automations-view-container" className="space-y-12">
      {/* Editorial Header Section */}
      <section id="automations-header-section" className="mb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b border-outline-variant pb-8">
          <div className="max-w-xl">
            <span className="caps text-on-surface-variant mb-3 block">
              Issue No. 04 &mdash; Autumn 2024 / Telemetry Core
            </span>
            <h2 className="font-headline text-5xl md:text-7xl italic font-light tracking-tight leading-none mb-6">
              The Silent<br />Power Web
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 mt-6 items-start">
              <div className="accent-circle font-serif text-xs hidden sm:flex shrink-0">
                Curated Selection
              </div>
              <p className="text-on-surface-variant text-base leading-relaxed font-serif font-light opacity-90">
                Exploring the intersection of architectural automation and ambient energy efficiency. The Luminous Engine is currently managing <span className="font-bold underline italic text-on-surface">{activeFlowsCount} active flows</span> to reduce standard grid reliance with absolute grace.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 relative mt-4 md:mt-0">
            <button 
              id="filter-dropdown-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`px-4 py-2 border text-xs uppercase tracking-widest font-semibold transition-all ${
                selectedCategory !== 'all' 
                  ? 'bg-on-surface text-background border-on-surface' 
                  : 'bg-transparent border-on-surface/30 text-on-surface hover:border-text'
              }`}
            >
              <span className="flex items-center gap-2">
                <FilterIcon className="w-3.5 h-3.5" />
                <span>Filter{selectedCategory !== 'all' ? `: ${selectedCategory}` : ''}</span>
              </span>
            </button>

            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-12 w-56 bg-surface border border-on-surface/20 shadow-xl z-30 p-2"
                >
                  <div className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant px-3 py-2 border-b border-on-surface/5">
                    Category Filter
                  </div>
                  {['all', 'energy', 'water', 'ev', 'heating'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider transition-colors flex items-center justify-between ${
                        selectedCategory === cat 
                          ? 'bg-on-surface/5 text-on-surface font-semibold' 
                          : 'hover:bg-on-surface/5 text-on-surface-variant'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <span className="w-1 h-1 rounded-full bg-on-surface" />}
                    </button>
                  ))}
                  <div className="border-t border-on-surface/10 my-2 pt-2">
                    <input 
                      type="text" 
                      placeholder="Search telemetry..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-surface border border-on-surface/10 outline-none focus:border-on-surface"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              id="new-flow-btn"
              onClick={() => setShowNewFlowModal(true)}
              className="px-5 py-2 bg-on-surface text-background text-xs uppercase tracking-widest font-semibold transition-all hover:bg-on-surface/90 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Flow</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid for Automations */}
      <div id="automations-bento-grid" className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Featured Card 1: Peak Hours Eco Mode */}
        {peakEcoFlow && (selectedCategory === 'all' || selectedCategory === 'energy') && (
          <div className="md:col-span-8 bg-surface border border-on-surface/20 p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div id="peak-eco-icon-container" className="w-10 h-10 border border-on-surface/20 flex items-center justify-center mb-6">
                  <IconResolver name={peakEcoFlow.icon} className="text-on-surface" size={18} />
                </div>
                <h3 className="font-headline text-3xl italic font-light text-on-surface mb-2">
                  {peakEcoFlow.name}
                </h3>
                <p className="text-on-surface-variant font-serif text-base font-light leading-relaxed max-w-md">
                  {peakEcoFlow.description}
                </p>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={peakEcoFlow.isActive} 
                  onChange={() => onToggleAutomation(peakEcoFlow.id)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-surface border border-on-surface/30 peer-focus:outline-none peer peer-checked:after:translate-x-6 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-on-surface after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-on-surface after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-on-surface/10"></div>
              </label>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-on-surface/10 flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-widest">
                Influences {peakEcoFlow.influenceCount} smart devices
              </span>
              
              <div className="flex items-center gap-2 text-on-surface font-serif text-2xl italic">
                <span>{peakEcoFlow.impactValue}</span>
              </div>
            </div>
          </div>
        )}

        {/* Featured Card 2: Smart Sprinkler */}
        {sprinklerFlow && (selectedCategory === 'all' || selectedCategory === 'water') && (
          <div className="md:col-span-4 bg-surface-container-low border border-on-surface/10 p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div id="sprinkler-icon-container" className="w-10 h-10 border border-on-surface/10 flex items-center justify-center">
                <IconResolver name={sprinklerFlow.icon} className="text-on-surface" size={18} />
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={sprinklerFlow.isActive} 
                  onChange={() => onToggleAutomation(sprinklerFlow.id)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-surface border border-on-surface/30 peer-focus:outline-none peer peer-checked:after:translate-x-6 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-on-surface after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-on-surface after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-on-surface/10"></div>
              </label>
            </div>

            <div>
              <h3 className="font-headline text-2xl italic font-light text-on-surface mb-2">
                {sprinklerFlow.name}
              </h3>
              <p className="text-on-surface-variant font-serif text-sm leading-relaxed font-light">
                {sprinklerFlow.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-on-surface/10 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                {sprinklerFlow.details?.currentRainChance ?? 80}% Prec. Forecast
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface">
                {sprinklerFlow.isActive ? 'Active Shift' : 'Deactivated'}
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Static Inline Stats Card Row */}
        <div className="md:col-span-12 py-2">
          <StatsRow stats={stats} />
        </div>

        {/* Featured Card 3: EV Scheduled Charging */}
        {evFlow && (selectedCategory === 'all' || selectedCategory === 'ev') && (
          <div className="md:col-span-12 bg-on-surface border border-on-surface p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/5 z-0"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex items-center gap-6">
                <div id="ev-charging-icon-container" className="w-14 h-14 border border-background/20 flex items-center justify-center shrink-0">
                  <IconResolver name={evFlow.icon} className="text-background" size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-background/60 uppercase tracking-widest font-semibold block mb-1">
                    Off-Peak Ledger Mode
                  </span>
                  <h3 className="font-headline text-3xl italic font-light text-background tracking-tight">
                    {evFlow.name}
                  </h3>
                  <p className="text-background/80 font-serif text-base max-w-md mt-2 font-light leading-snug">
                    {evFlow.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="hidden lg:block text-right">
                  <p className="text-background/50 text-[10px] uppercase tracking-widest mb-1">Grid Target</p>
                  <p className="text-background font-serif text-lg italic">
                    {evFlow.isActive ? (evFlow.details?.nextCycleTime ?? 'Today, 11:45 PM') : 'Inactive'}
                  </p>
                </div>

                <div className="flex-grow md:flex-grow-0 flex justify-end">
                  <label className="relative inline-flex items-center cursor-pointer scale-110 select-none">
                    <input 
                      type="checkbox" 
                      checked={evFlow.isActive} 
                      onChange={() => onToggleAutomation(evFlow.id)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-background/10 border border-background/30 peer-focus:outline-none peer peer-checked:after:translate-x-6 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-background after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-background/20"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Automations (filtered & searched) */}
        {secondaryFlows.map((flow) => (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={flow.id}
            className="md:col-span-6 bg-surface border border-on-surface/15 p-6 flex flex-col justify-between min-h-[200px] relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border border-on-surface/10 flex items-center justify-center">
                  <IconResolver name={flow.icon} className="text-on-surface" size={16} />
                </div>
                <div>
                  <h4 className="font-headline text-lg italic font-light text-on-surface">{flow.name}</h4>
                  <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-on-surface/5 text-on-surface">
                    {flow.category}
                  </span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={flow.isActive} 
                  onChange={() => onToggleAutomation(flow.id)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-surface border border-on-surface/20 peer-focus:outline-none peer peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-full peer-checked:after:border-on-surface after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-on-surface after:rounded-none after:h-3 after:w-3 after:transition-all peer-checked:bg-on-surface/10"></div>
              </label>
            </div>

            <p className="text-on-surface-variant font-serif text-sm mt-4 font-light">
              {flow.description}
            </p>

            <div className="mt-4 pt-4 border-t border-on-surface/10 flex justify-between items-center text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider">
              <span>{flow.influenceCount} linked node(s)</span>
              <span className="font-bold font-serif text-xs text-on-surface">{flow.impactValue}</span>
            </div>
          </motion.div>
        ))}

        {/* Empty state if nothing matches category filter */}
        {filteredAutomations.length === 0 && (
          <div className="col-span-12 py-16 text-center bg-surface border border-on-surface/10 p-8">
            <HelpCircle className="mx-auto w-10 h-10 text-on-surface/40 mb-3" />
            <h4 className="font-headline text-xl italic font-light">End of Stream</h4>
            <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest">
              Adjust telemetry search parameters to display optimization workflows.
            </p>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showNewFlowModal && (
          <div className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 1, scale: 0.98 }}
              className="bg-surface border border-on-surface/20 w-full max-w-lg shadow-2xl p-6 relative overflow-hidden"
            >
              <button 
                id="close-modal-btn"
                onClick={() => setShowNewFlowModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 hover:bg-on-surface/5"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-6 border-b border-on-surface/10 pb-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                  Workflow Deployment Engine
                </span>
              </div>

              <form onSubmit={handleCreateFlow} id="new-flow-form" className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Flow Name
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Living Room Pre-cooling" 
                    value={newFlowName}
                    onChange={(e) => setNewFlowName(e.target.value)}
                    className="w-full rounded-none bg-surface-container-low px-4 py-2 border border-on-surface/10 focus:border-on-surface outline-none text-on-surface text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    Description
                  </label>
                  <textarea 
                    required 
                    placeholder="What triggers this optimization and what action does it take?" 
                    value={newFlowDescription}
                    onChange={(e) => setNewFlowDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-none bg-surface-container-low px-4 py-2 border border-on-surface/10 focus:border-on-surface outline-none text-on-surface text-sm resize-none font-serif"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      Category
                    </label>
                    <select
                      value={newFlowCategory}
                      onChange={(e: any) => {
                        setNewFlowCategory(e.target.value);
                        if (e.target.value === 'water') setNewFlowIcon('Droplet');
                        else if (e.target.value === 'ev') setNewFlowIcon('Cpu');
                        else if (e.target.value === 'heating') setNewFlowIcon('ThermometerSun');
                        else setNewFlowIcon('Leaf');
                      }}
                      className="w-full rounded-none bg-surface-container-low px-4 py-2 border border-on-surface/10 font-serif outline-none text-on-surface text-sm capitalize"
                    >
                      <option value="energy">Energy</option>
                      <option value="water">Water</option>
                      <option value="ev">EV Connector</option>
                      <option value="heating">Heating</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      Assigned Icon
                    </label>
                    <select
                      value={newFlowIcon}
                      onChange={(e) => setNewFlowIcon(e.target.value)}
                      className="w-full rounded-none bg-surface-container-low px-4 py-2 border border-on-surface/10 outline-none text-on-surface text-sm"
                    >
                      <option value="Leaf">Leaf (Eco)</option>
                      <option value="Droplet">Droplet (Water)</option>
                      <option value="Cpu">CPU (EV / Smart)</option>
                      <option value="Sun">Sun (Solar)</option>
                      <option value="ThermometerSun">Thermometer (HVAC)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      Impact Metric
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. -12% Watts" 
                      value={newFlowImpact}
                      onChange={(e) => setNewFlowImpact(e.target.value)}
                      className="w-full rounded-none bg-surface-container-low px-4 py-2 border border-on-surface/10 focus:border-on-surface outline-none text-on-surface text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      <span>Linked Devices</span>
                      <span>({newFlowInfluences})</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={newFlowInfluences}
                      onChange={(e) => setNewFlowInfluences(parseInt(e.target.value))}
                      className="w-full mt-2 accent-on-surface"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-on-surface/10 flex justify-end gap-3 text-xs uppercase tracking-widest font-semibold">
                  <button
                    type="button"
                    onClick={() => setShowNewFlowModal(false)}
                    className="px-4 py-2 hover:bg-on-surface/5 transition-colors text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-on-surface text-background hover:opacity-90 transition-all font-bold"
                  >
                    Deploy Flow
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
