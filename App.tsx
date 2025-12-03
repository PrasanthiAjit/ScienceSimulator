import React, { useState } from 'react';
import { Subject, EducationLevel } from './types';
import { Atom, Zap, Dna, Activity, Microscope, GraduationCap } from 'lucide-react';
import PhysicsLab from './components/PhysicsLab';
import ChemistryLab from './components/ChemistryLab';
import BiologyLab from './components/BiologyLab';
import LifeScienceLab from './components/LifeScienceLab';
import TutorChat from './components/TutorChat';

const App: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<Subject>(Subject.PHYSICS);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(EducationLevel.HIGH);

  const renderActiveLab = () => {
    switch (activeSubject) {
      case Subject.PHYSICS: return <PhysicsLab level={educationLevel} />;
      case Subject.CHEMISTRY: return <ChemistryLab level={educationLevel} />;
      case Subject.BIOLOGY: return <BiologyLab level={educationLevel} />;
      case Subject.LIFESCIENCE: return <LifeScienceLab level={educationLevel} />;
      default: return <PhysicsLab level={educationLevel} />;
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
            <div className={`p-2 rounded transition-colors ${
                educationLevel === EducationLevel.ELEMENTARY ? 'bg-orange-500' : 
                educationLevel === EducationLevel.MIDDLE ? 'bg-teal-500' : 'bg-gradient-to-br from-lab-blue to-lab-indigo'
            }`}>
                <Atom size={20} className="text-white" />
            </div>
            <div>
                <h1 className="text-lg font-bold tracking-tight">STEM<span className="font-light text-slate-400">Labs</span></h1>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block -mt-1">{educationLevel} Edition</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
              {/* Level Selector */}
              <div className="hidden md:flex bg-slate-800 rounded p-1">
                  {[EducationLevel.ELEMENTARY, EducationLevel.MIDDLE, EducationLevel.HIGH].map((level) => (
                      <button
                        key={level}
                        onClick={() => setEducationLevel(level)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                            educationLevel === level 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                          {level === EducationLevel.ELEMENTARY ? 'Elementary' : level === EducationLevel.MIDDLE ? 'Middle' : 'High School'}
                      </button>
                  ))}
              </div>

              <nav className="hidden md:flex gap-1 bg-slate-800 p-1 rounded-lg ml-4">
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
          </div>

          <div className="md:hidden flex items-center">
             <button className="p-2 text-slate-300">
                <GraduationCap />
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Level Selector (Only visible on small screens) */}
      <div className="md:hidden bg-slate-800 p-2 flex justify-center gap-2 border-b border-slate-700">
         {[EducationLevel.ELEMENTARY, EducationLevel.MIDDLE, EducationLevel.HIGH].map((level) => (
              <button
                key={level}
                onClick={() => setEducationLevel(level)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    educationLevel === level 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400'
                }`}
              >
                  {level === EducationLevel.ELEMENTARY ? 'Elem' : level === EducationLevel.MIDDLE ? 'Mid' : 'High'}
              </button>
          ))}
      </div>

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
        <div className={`bg-white rounded-lg shadow-xl h-[85vh] overflow-hidden flex flex-col border border-slate-200 transition-all ${
            educationLevel === EducationLevel.ELEMENTARY ? 'border-4 border-orange-200 rounded-3xl' : ''
        }`}>
             {/* Lab Context Header */}
             <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {activeSubject}
                        {educationLevel === EducationLevel.ELEMENTARY && <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Kids Mode</span>}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {educationLevel === EducationLevel.ELEMENTARY ? 'Fun Science Zone!' : 'Interactive Simulation Environment'}
                    </p>
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

      <TutorChat subject={activeSubject} level={educationLevel} />
    </div>
  );
};

export default App;