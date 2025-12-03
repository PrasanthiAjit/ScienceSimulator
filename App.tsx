import React, { useState } from 'react';
import { Subject } from './types';
import { Atom, Zap, Dna, Activity, Microscope } from 'lucide-react';
import PhysicsLab from './components/PhysicsLab';
import ChemistryLab from './components/ChemistryLab';
import BiologyLab from './components/BiologyLab';
import LifeScienceLab from './components/LifeScienceLab';
import TutorChat from './components/TutorChat';

const App: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<Subject>(Subject.PHYSICS);

  const renderActiveLab = () => {
    switch (activeSubject) {
      case Subject.PHYSICS: return <PhysicsLab />;
      case Subject.CHEMISTRY: return <ChemistryLab />;
      case Subject.BIOLOGY: return <BiologyLab />;
      case Subject.LIFESCIENCE: return <LifeScienceLab />;
      default: return <PhysicsLab />;
    }
  };

  const navItems = [
    { id: Subject.PHYSICS, icon: <Activity size={18} />, color: 'border-lab-blue' },
    { id: Subject.CHEMISTRY, icon: <Atom size={18} />, color: 'border-lab-indigo' },
    { id: Subject.BIOLOGY, icon: <Dna size={18} />, color: 'border-lab-teal' },
    { id: Subject.LIFESCIENCE, icon: <Microscope size={18} />, color: 'border-lab-amber' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-100">
      
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-lab-blue to-lab-indigo p-2 rounded">
                <Atom size={20} className="text-white" />
            </div>
            <div>
                <h1 className="text-lg font-bold tracking-tight">STEM<span className="font-light text-slate-400">Labs</span></h1>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block -mt-1">High School Edition</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-1 bg-slate-800 p-1 rounded-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSubject(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSubject === item.id 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.icon}
                {item.id}
              </button>
            ))}
          </nav>

          <div className="hidden md:block text-xs text-slate-500 font-mono">
             v2.0.1-EDU
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 z-40 flex justify-around p-2 pb-safe">
          {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSubject(item.id)}
                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${activeSubject === item.id ? 'text-white bg-slate-800' : 'text-slate-500'}`}
              >
                  {item.icon}
                  <span className="text-[10px] font-medium tracking-wide">
                      {item.id === Subject.LIFESCIENCE ? 'BIO-II' : item.id.substring(0,4)}
                  </span>
              </button>
          ))}
      </div>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 max-w-screen-2xl mx-auto w-full pb-24 md:pb-6">
        <div className="bg-white rounded-lg shadow-xl h-[85vh] overflow-hidden flex flex-col border border-slate-200">
             {/* Lab Context Header */}
             <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {activeSubject}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Interactive Simulation Environment</p>
                 </div>
                 <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                 </div>
             </div>
             
             {/* Lab Content */}
             <div className="flex-grow overflow-hidden relative">
                 {renderActiveLab()}
             </div>
        </div>
      </main>

      <TutorChat subject={activeSubject} />
    </div>
  );
};

export default App;