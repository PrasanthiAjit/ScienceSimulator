import React, { useState } from 'react';
import { evolveOrganism } from '../services/geminiService';
import { Globe, Thermometer, Droplets, Skull, Fingerprint } from 'lucide-react';

const LifeScienceLab: React.FC = () => {
  const [temperature, setTemperature] = useState(50); // 0 = freezing, 100 = boiling
  const [water, setWater] = useState(50); // 0 = arid, 100 = aquatic
  const [radiation, setRadiation] = useState(10); // 0 = low, 100 = high
  
  const [organism, setOrganism] = useState<{scientificName: string, traits: string[], adaptationAnalysis: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEvolve = async () => {
    setLoading(true);
    const envDesc = `Temperature: ${temperature} (High/Low), Water Availability: ${water} (Arid/Aquatic), Radiation Level: ${radiation}.`;
    const result = await evolveOrganism(envDesc);
    setOrganism(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full p-4">
       {/* Environment Controls */}
       <div className="md:col-span-1 bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
           <div>
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-lab-teal">
                   <Globe /> Environmental Parameters
               </h3>
               
               <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="flex items-center justify-between text-sm font-medium text-slate-300">
                           <span className="flex items-center gap-2"><Thermometer size={16} /> Mean Temp</span>
                           <span>{temperature}°C</span>
                       </label>
                       <input 
                        type="range" min="-50" max="100" value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))}
                        className="w-full accent-lab-rose h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                       />
                       <div className="flex justify-between text-xs text-slate-500">
                           <span>Frozen</span>
                           <span>Scorching</span>
                       </div>
                   </div>

                   <div className="space-y-2">
                       <label className="flex items-center justify-between text-sm font-medium text-slate-300">
                           <span className="flex items-center gap-2"><Droplets size={16} /> H₂O Saturation</span>
                           <span>{water}%</span>
                       </label>
                       <input 
                        type="range" min="0" max="100" value={water} onChange={(e) => setWater(parseInt(e.target.value))}
                        className="w-full accent-lab-blue h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                       />
                       <div className="flex justify-between text-xs text-slate-500">
                           <span>Desert</span>
                           <span>Oceanic</span>
                       </div>
                   </div>

                   <div className="space-y-2">
                       <label className="flex items-center justify-between text-sm font-medium text-slate-300">
                           <span className="flex items-center gap-2"><Skull size={16} /> Radiation/Toxicity</span>
                           <span>{radiation} Rads</span>
                       </label>
                       <input 
                        type="range" min="0" max="100" value={radiation} onChange={(e) => setRadiation(parseInt(e.target.value))}
                        className="w-full accent-lab-amber h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                       />
                       <div className="flex justify-between text-xs text-slate-500">
                           <span>Safe</span>
                           <span>Lethal</span>
                       </div>
                   </div>
               </div>
           </div>

           <button 
             onClick={handleEvolve}
             disabled={loading}
             className="w-full mt-8 bg-lab-teal text-slate-900 py-3 rounded-lg font-bold hover:bg-teal-400 transition-colors shadow-lg disabled:opacity-50"
           >
             {loading ? 'Simulating Evolution...' : 'Run Evolutionary Model'}
           </button>
       </div>

       {/* Results Panel */}
       <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-y-auto">
           {organism ? (
               <div className="animate-fade-in space-y-6">
                   <div className="border-b border-slate-100 pb-4">
                       <h2 className="text-3xl font-serif font-bold text-slate-800 italic">{organism.scientificName}</h2>
                       <span className="text-sm text-slate-500 uppercase tracking-widest font-bold">Specimen Analysis</span>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                           <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                               <Fingerprint size={18} /> Physiological Traits
                           </h4>
                           <ul className="space-y-2">
                               {organism.traits.map((trait, i) => (
                                   <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                                       <span className="mt-1.5 w-1.5 h-1.5 bg-lab-blue rounded-full flex-shrink-0"></span>
                                       {trait}
                                   </li>
                               ))}
                           </ul>
                       </div>

                       <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                           <h4 className="font-bold text-amber-800 mb-3">Natural Selection Notes</h4>
                           <p className="text-sm text-amber-900 leading-relaxed">
                               {organism.adaptationAnalysis}
                           </p>
                       </div>
                   </div>
               </div>
           ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <Globe size={64} className="mb-4 opacity-20" />
                   <p className="text-lg font-medium">Configure environment parameters to begin evolution simulation.</p>
               </div>
           )}
       </div>
    </div>
  );
};

export default LifeScienceLab;