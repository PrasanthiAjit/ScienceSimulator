import React, { useState } from 'react';
import { Dna, GitMerge, Info, Sun, CloudRain, Flower } from 'lucide-react';
import { analyzeGenetics } from '../services/geminiService';
import { EducationLevel } from '../types';

interface Props {
    level: EducationLevel;
}

const traits = [
    { id: 'eye_color', name: 'Eye Color', alleles: ['B (Brown)', 'b (Blue)'] },
    { id: 'flower_color', name: 'Flower Color', alleles: ['R (Red)', 'r (White)'] },
    { id: 'pea_shape', name: 'Pea Shape', alleles: ['R (Round)', 'r (Wrinkled)'] }
];

const BiologyLab: React.FC<Props> = ({ level }) => {
  // Common State
  const [loading, setLoading] = useState(false);

  // Elementary "Plant Grower" State
  const [plantStage, setPlantStage] = useState(0); // 0 = Seed, 1 = Sprout, 2 = Flower
  const [hasWater, setHasWater] = useState(false);
  const [hasSun, setHasSun] = useState(false);

  // Genetics State
  const [selectedTrait, setSelectedTrait] = useState(traits[0]);
  const [parent1, setParent1] = useState('Bb');
  const [parent2, setParent2] = useState('Bb');
  const [analysis, setAnalysis] = useState<{explanation: string, ratios: string} | null>(null);

  // --- Elementary Logic ---
  const growPlant = () => {
      if(hasWater && hasSun) {
          setPlantStage(prev => Math.min(prev + 1, 2));
          setHasWater(false);
          setHasSun(false);
      }
  }

  // --- Genetics Logic ---
  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeGenetics(selectedTrait.name, parent1, parent2, level);
    setAnalysis(result);
    setLoading(false);
  };

  const p1Alleles = parent1.split('');
  const p2Alleles = parent2.split('');

  // RENDER ELEMENTARY
  if (level === EducationLevel.ELEMENTARY) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-100 to-green-100">
             <h2 className="text-3xl font-bold text-green-700 mb-8 flex items-center gap-3">
                 <Flower size={32} /> The Garden Lab
             </h2>
             
             <div className="flex gap-8 mb-12">
                 <button 
                    onClick={() => setHasSun(!hasSun)}
                    className={`p-6 rounded-2xl shadow-lg border-4 transition-all ${hasSun ? 'bg-yellow-100 border-yellow-400 scale-110' : 'bg-white border-slate-200 grayscale'}`}
                 >
                     <Sun size={48} className="text-yellow-500" />
                     <span className="block text-center font-bold text-slate-600 mt-2">Sun</span>
                 </button>
                 <button 
                    onClick={() => setHasWater(!hasWater)}
                    className={`p-6 rounded-2xl shadow-lg border-4 transition-all ${hasWater ? 'bg-blue-100 border-blue-400 scale-110' : 'bg-white border-slate-200 grayscale'}`}
                 >
                     <CloudRain size={48} className="text-blue-500" />
                     <span className="block text-center font-bold text-slate-600 mt-2">Water</span>
                 </button>
             </div>

             <div className="relative w-64 h-64 flex items-end justify-center bg-amber-900/10 rounded-full border-b-4 border-amber-800/20">
                 {plantStage === 0 && <div className="w-4 h-4 bg-amber-800 rounded-full mb-2"></div>}
                 {plantStage === 1 && <div className="w-2 h-24 bg-green-500 rounded-full mb-2 relative"><div className="absolute top-4 left-0 w-8 h-4 bg-green-500 rounded-full -rotate-45"></div></div>}
                 {plantStage === 2 && (
                     <div className="w-2 h-32 bg-green-600 rounded-full mb-2 relative flex justify-center">
                         <div className="absolute top-10 left-0 w-8 h-4 bg-green-500 rounded-full -rotate-45"></div>
                         <div className="absolute top-16 right-0 w-8 h-4 bg-green-500 rounded-full rotate-45"></div>
                         <div className="absolute -top-10 animate-bounce">
                             <Flower size={64} className="text-pink-500 fill-pink-300" />
                         </div>
                     </div>
                 )}
             </div>

             <div className="mt-8 text-center">
                 <p className="text-lg text-slate-600 mb-4 font-medium">
                     {plantStage === 0 && "The seed needs Sun AND Water to sprout!"}
                     {plantStage === 1 && "It's growing! Keep going!"}
                     {plantStage === 2 && "You grew a beautiful flower! Great job!"}
                 </p>
                 <button 
                    onClick={growPlant}
                    disabled={!hasSun || !hasWater || plantStage === 2}
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors text-xl"
                 >
                     {plantStage === 2 ? 'Finished!' : 'GROW!'}
                 </button>
                 {plantStage === 2 && (
                     <button onClick={() => setPlantStage(0)} className="block mx-auto mt-4 text-slate-500 hover:text-green-600 font-bold">
                         Plant Another Seed?
                     </button>
                 )}
             </div>
          </div>
      );
  }

  // RENDER MIDDLE / HIGH SCHOOL
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
                           <label className="block text-xs font-bold text-lab-blue uppercase mb-1">Parent 1</label>
                           {level === EducationLevel.MIDDLE ? (
                               <select className="w-full p-2 border rounded" value={parent1} onChange={(e) => setParent1(e.target.value)}>
                                   <option value="BB">Homozygous Dominant (BB)</option>
                                   <option value="Bb">Heterozygous (Bb)</option>
                                   <option value="bb">Homozygous Recessive (bb)</option>
                               </select>
                           ) : (
                               <input 
                                type="text" 
                                maxLength={2} 
                                value={parent1} 
                                onChange={(e) => setParent1(e.target.value)} 
                                className="w-full p-2 border-2 border-lab-blue rounded-lg font-mono text-center uppercase"
                               />
                           )}
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-lab-rose uppercase mb-1">Parent 2</label>
                           {level === EducationLevel.MIDDLE ? (
                               <select className="w-full p-2 border rounded" value={parent2} onChange={(e) => setParent2(e.target.value)}>
                                   <option value="BB">Homozygous Dominant (BB)</option>
                                   <option value="Bb">Heterozygous (Bb)</option>
                                   <option value="bb">Homozygous Recessive (bb)</option>
                               </select>
                           ) : (
                               <input 
                                type="text" 
                                maxLength={2} 
                                value={parent2} 
                                onChange={(e) => setParent2(e.target.value)} 
                                className="w-full p-2 border-2 border-lab-rose rounded-lg font-mono text-center uppercase"
                               />
                           )}
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
                       <div className="text-lab-rose">{p2Alleles[0] || '?'}</div>
                       <div className="text-lab-rose">{p2Alleles[1] || '?'}</div>
                       
                       <div className="text-lab-blue flex items-center justify-center">{p1Alleles[0] || '?'}</div>
                       <div className="bg-white border-2 border-slate-200 p-4 rounded flex items-center justify-center shadow-sm">
                           {p1Alleles[0]}{p2Alleles[0]}
                       </div>
                       <div className="bg-white border-2 border-slate-200 p-4 rounded flex items-center justify-center shadow-sm">
                           {p1Alleles[0]}{p2Alleles[1]}
                       </div>

                       <div className="text-lab-blue flex items-center justify-center">{p1Alleles[1] || '?'}</div>
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