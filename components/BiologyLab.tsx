import React, { useState } from 'react';
import { Dna, GitMerge, Info } from 'lucide-react';
import { analyzeGenetics } from '../services/geminiService';

const traits = [
    { id: 'eye_color', name: 'Eye Color (Simple)', alleles: ['B (Brown)', 'b (Blue)'] },
    { id: 'flower_color', name: 'Flower Color (Incomplete Dominance)', alleles: ['R (Red)', 'r (White)'] },
    { id: 'pea_shape', name: 'Pea Shape (Mendelian)', alleles: ['R (Round)', 'r (Wrinkled)'] }
];

const BiologyLab: React.FC = () => {
  const [selectedTrait, setSelectedTrait] = useState(traits[0]);
  const [parent1, setParent1] = useState('Bb');
  const [parent2, setParent2] = useState('Bb');
  const [analysis, setAnalysis] = useState<{explanation: string, ratios: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper to generate Punnett Grid
  const p1Alleles = parent1.split('');
  const p2Alleles = parent2.split('');
  
  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeGenetics(selectedTrait.name, parent1, parent2);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full p-4 gap-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Dna className="text-lab-teal" /> Genetic Cross Analyzer
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Controls */}
               <div className="space-y-4">
                   <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Trait</label>
                       <select 
                        className="w-full p-2 border rounded-lg bg-slate-50"
                        onChange={(e) => {
                            const t = traits.find(tr => tr.id === e.target.value);
                            if(t) setSelectedTrait(t);
                        }}
                       >
                           {traits.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                       </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="block text-xs font-bold text-lab-blue uppercase mb-1">Parent 1 Genotype</label>
                           <input 
                            type="text" 
                            maxLength={2} 
                            value={parent1} 
                            onChange={(e) => setParent1(e.target.value)} 
                            className="w-full p-2 border-2 border-lab-blue rounded-lg font-mono text-center uppercase"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-lab-rose uppercase mb-1">Parent 2 Genotype</label>
                           <input 
                            type="text" 
                            maxLength={2} 
                            value={parent2} 
                            onChange={(e) => setParent2(e.target.value)} 
                            className="w-full p-2 border-2 border-lab-rose rounded-lg font-mono text-center uppercase"
                           />
                       </div>
                   </div>
                   <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition-colors flex justify-center items-center gap-2"
                   >
                       {loading ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" /> : <GitMerge size={18} />}
                       Analyze Inheritance
                   </button>
               </div>

               {/* Punnett Square Visual */}
               <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                   <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-lg">
                       <div className="opacity-0"></div>
                       <div className="text-lab-rose">{p2Alleles[0]}</div>
                       <div className="text-lab-rose">{p2Alleles[1]}</div>
                       
                       <div className="text-lab-blue flex items-center justify-center">{p1Alleles[0]}</div>
                       <div className="bg-white border-2 border-slate-200 p-4 rounded flex items-center justify-center shadow-sm">
                           {p1Alleles[0]}{p2Alleles[0]}
                       </div>
                       <div className="bg-white border-2 border-slate-200 p-4 rounded flex items-center justify-center shadow-sm">
                           {p1Alleles[0]}{p2Alleles[1]}
                       </div>

                       <div className="text-lab-blue flex items-center justify-center">{p1Alleles[1]}</div>
                       <div className="bg-white border-2 border-slate-200 p-4 rounded flex items-center justify-center shadow-sm">
                           {p1Alleles[1]}{p2Alleles[0]}
                       </div>
                       <div className="bg-white border-2 border-slate-200 p-4 rounded flex items-center justify-center shadow-sm">
                           {p1Alleles[1]}{p2Alleles[1]}
                       </div>
                   </div>
               </div>

               {/* AI Analysis */}
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                       <Info size={16} /> Probability Report
                   </h4>
                   {analysis ? (
                       <div className="space-y-3 text-sm">
                           <p className="text-slate-600">{analysis.explanation}</p>
                           <div className="bg-white p-2 rounded border border-slate-200">
                               <span className="block text-xs font-bold text-slate-400">PREDICTED RATIOS</span>
                               <span className="font-mono text-lab-teal font-bold">{analysis.ratios}</span>
                           </div>
                       </div>
                   ) : (
                       <p className="text-slate-400 italic text-sm">Run analysis to generate probability data.</p>
                   )}
               </div>
           </div>
       </div>
    </div>
  );
};

export default BiologyLab;