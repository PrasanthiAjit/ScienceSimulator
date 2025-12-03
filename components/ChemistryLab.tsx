import React, { useState, useEffect } from 'react';
import { Chemical, SimulationResult, EducationLevel } from '../types';
import { FlaskConical, Atom, RefreshCw, Beaker } from 'lucide-react';
import { simulateChemicalReaction } from '../services/geminiService';

interface Props {
    level: EducationLevel;
}

// Chemical Inventories
const chemicalsHigh: Chemical[] = [
  { formula: 'HCl', name: 'Hydrochloric Acid', state: 'aq', type: 'acid', color: '#f1f5f9' },
  { formula: 'H2SO4', name: 'Sulfuric Acid', state: 'aq', type: 'acid', color: '#f1f5f9' },
  { formula: 'NaOH', name: 'Sodium Hydroxide', state: 'aq', type: 'base', color: '#f1f5f9' },
  { formula: 'CuSO4', name: 'Copper(II) Sulfate', state: 'aq', type: 'salt', color: '#3b82f6' },
  { formula: 'Zn', name: 'Zinc', state: 's', type: 'metal', color: '#94a3b8' },
  { formula: 'Mg', name: 'Magnesium', state: 's', type: 'metal', color: '#cbd5e1' },
];

const chemicalsMiddle: Chemical[] = [
    { formula: 'CH3COOH', name: 'Vinegar', state: 'l', type: 'acid', color: '#fef3c7' },
    { formula: 'NaHCO3', name: 'Baking Soda', state: 's', type: 'base', color: '#ffffff' },
    { formula: 'C20H14O4', name: 'Phenolphthalein', state: 'l', type: 'household', color: '#fce7f3' },
    { formula: 'NH3', name: 'Ammonia', state: 'aq', type: 'base', color: '#f1f5f9' },
    { formula: 'Fe', name: 'Iron Filings', state: 's', type: 'metal', color: '#475569' },
    { formula: 'O2', name: 'Oxygen', state: 'g', type: 'oxide', color: '#e2e8f0' }
];

const chemicalsElem: Chemical[] = [
    { formula: 'Vinegar', name: 'Stinky Vinegar', state: 'l', type: 'household', color: '#fef3c7' },
    { formula: 'Baking Soda', name: 'White Powder', state: 's', type: 'household', color: '#ffffff' },
    { formula: 'Water', name: 'Water', state: 'l', type: 'household', color: '#bfdbfe' },
    { formula: 'Food Color', name: 'Red Dye', state: 'l', type: 'household', color: '#ef4444' },
    { formula: 'Oil', name: 'Cooking Oil', state: 'l', type: 'household', color: '#fcd34d' },
    { formula: 'Soap', name: 'Dish Soap', state: 'l', type: 'household', color: '#86efac' }
];

const ChemistryLab: React.FC<Props> = ({ level }) => {
  const [reactantA, setReactantA] = useState<Chemical | null>(null);
  const [reactantB, setReactantB] = useState<Chemical | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<Chemical[]>(chemicalsHigh);

  useEffect(() => {
      setReactantA(null);
      setReactantB(null);
      setResult(null);
      if (level === EducationLevel.ELEMENTARY) setInventory(chemicalsElem);
      else if (level === EducationLevel.MIDDLE) setInventory(chemicalsMiddle);
      else setInventory(chemicalsHigh);
  }, [level]);

  const handleMix = async () => {
    if (!reactantA || !reactantB) return;
    setLoading(true);
    const data = await simulateChemicalReaction(reactantA.name, reactantB.name, level);
    setResult(data);
    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setReactantA(null);
    setReactantB(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full p-4">
      {/* Reactant Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 overflow-y-auto">
        <h3 className="font-sans font-bold text-lg mb-4 flex items-center gap-2 text-slate-700">
            <Atom size={20} /> {level === EducationLevel.ELEMENTARY ? 'My Ingredients' : 'Chemical Inventory'}
        </h3>
        <div className="space-y-2">
            {inventory.map((chem) => (
                <div key={chem.formula} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                         <div className="w-4 h-4 rounded-full border border-slate-300" style={{backgroundColor: chem.color}}></div>
                         <div>
                            <span className="font-mono font-bold text-slate-800 block text-sm">{chem.formula}</span>
                            <span className="text-xs text-slate-500">{chem.name}</span>
                         </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setReactantA(chem)}
                            className={`px-3 py-1 text-xs font-bold rounded ${reactantA?.name === chem.name ? 'bg-lab-blue text-white' : 'bg-slate-200 text-slate-600'}`}
                        >
                            1
                        </button>
                        <button 
                            onClick={() => setReactantB(chem)}
                            className={`px-3 py-1 text-xs font-bold rounded ${reactantB?.name === chem.name ? 'bg-lab-indigo text-white' : 'bg-slate-200 text-slate-600'}`}
                        >
                            2
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Reaction Workbench */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Visualizer */}
        <div className="flex-grow bg-slate-900 rounded-xl shadow-inner p-8 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10"></div>
            
            {/* Reactant A Flask */}
            <div className="flex flex-col items-center gap-4 transition-all duration-500 transform translate-y-0 z-10">
                <div className={`w-32 h-40 border-4 border-slate-600 rounded-b-3xl relative overflow-hidden backdrop-blur-sm bg-white/5 ${loading ? 'animate-pulse' : ''}`}>
                    <div 
                        className="absolute bottom-0 w-full transition-all duration-1000"
                        style={{ 
                            height: result ? '100%' : '40%', 
                            backgroundColor: result ? '#10b981' : (reactantA?.color || 'transparent'),
                            opacity: 0.6
                        }}
                    ></div>
                    {/* Bubbles if gas */}
                    {result && result.observation.toLowerCase().includes('gas') && (
                        <div className="absolute inset-0 flex justify-center items-end">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75 mb-10"></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150 mb-6 mx-2"></div>
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <span className="block font-mono text-white text-lg">
                        {reactantA?.name || '?'} + {reactantB?.name || '?'}
                    </span>
                    <span className="text-slate-400 text-sm">{level === EducationLevel.ELEMENTARY ? 'Mixing Bowl' : 'Reaction Chamber'}</span>
                </div>
            </div>
            
            {/* Reaction Details Overlay */}
            {result && !loading && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg p-4 shadow-xl border-l-4 border-lab-teal animate-fade-in">
                    <h4 className="font-bold text-lab-teal mb-1">{level === EducationLevel.ELEMENTARY ? 'What Happened?' : 'Reaction Analysis'}</h4>
                    <p className={`font-mono ${level === EducationLevel.ELEMENTARY ? 'text-sm' : 'text-lg'} text-slate-800 mb-2`}>{result.balancedEquation}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2 md:col-span-1">
                            <span className="block text-xs font-bold text-slate-500 uppercase">Observation</span>
                            <span className="text-slate-700">{result.observation}</span>
                        </div>
                        {level !== EducationLevel.ELEMENTARY && (
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">Thermodynamics</span>
                                <span className={`${result.enthalpy === 'Exothermic' ? 'text-lab-rose' : 'text-lab-blue'} font-bold`}>
                                    {result.enthalpy}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Action Panel */}
        <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <span className="block text-xs text-slate-500">{level === EducationLevel.ELEMENTARY ? 'Item 1' : 'Reactant A'}</span>
                    <span className="font-bold text-lab-blue">{reactantA?.name || 'Select'}</span>
                </div>
                <div className="text-xl text-slate-300">+</div>
                <div>
                    <span className="block text-xs text-slate-500">{level === EducationLevel.ELEMENTARY ? 'Item 2' : 'Reactant B'}</span>
                    <span className="font-bold text-lab-indigo">{reactantB?.name || 'Select'}</span>
                </div>
            </div>
            
            <div className="flex gap-3">
                 <button onClick={reset} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                     <RefreshCw />
                 </button>
                 <button 
                    onClick={handleMix}
                    disabled={!reactantA || !reactantB || loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-lab-blue to-lab-indigo text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {loading ? <RefreshCw className="animate-spin" /> : <FlaskConical />} 
                    {level === EducationLevel.ELEMENTARY ? 'MIX IT!' : 'Initiate Reaction'}
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryLab;