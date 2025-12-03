import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';
import { EducationLevel } from '../types';

interface Props {
    level: EducationLevel;
}

const PhysicsLab: React.FC<Props> = ({ level }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation State
  const [velocity, setVelocity] = useState(50); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [height, setHeight] = useState(0); // initial height meters
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [time, setTime] = useState(0);
  const [trajectory, setTrajectory] = useState<{x: number, y: number}[]>([]);
  
  const animationRef = useRef<number>(0);

  const isElementary = level === EducationLevel.ELEMENTARY;
  const isHighSchool = level === EducationLevel.HIGH;

  const SCALE = 4; // pixels per meter

  // Reset defaults when level changes
  useEffect(() => {
      reset();
      if (isElementary) {
          setVelocity(60);
          setGravity(9.8);
          setHeight(0);
      }
  }, [level]);

  const startSimulation = () => {
    setTrajectory([]);
    setTime(0);
    setIsSimulating(true);
  };

  const reset = () => {
    setIsSimulating(false);
    setTime(0);
    setTrajectory([]);
    if(animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Draw Function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    const parent = canvas.parentElement;
    if(parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
    }

    const draw = () => {
        // Clear background
        ctx.fillStyle = isElementary ? '#e0f2fe' : '#ffffff'; // Light blue sky for kids
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid (Hide for elementary)
        if (!isElementary) {
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            for(let x = 0; x < canvas.width; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for(let y = 0; y < canvas.height; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }
        } else {
             // Draw some clouds for Elementary
             ctx.fillStyle = '#fff';
             ctx.beginPath(); ctx.arc(100, 100, 30, 0, Math.PI*2); ctx.fill();
             ctx.beginPath(); ctx.arc(140, 90, 40, 0, Math.PI*2); ctx.fill();
             ctx.beginPath(); ctx.arc(180, 100, 30, 0, Math.PI*2); ctx.fill();
        }

        // Ground
        ctx.fillStyle = isElementary ? '#4ade80' : '#cbd5e1'; // Green grass for kids
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        // Origin (bottom-left offset)
        const originX = 50;
        const originY = canvas.height - 20;

        // Calculate current position
        const rad = angle * (Math.PI / 180);
        const vx = velocity * Math.cos(rad);
        const vy_initial = velocity * Math.sin(rad);
        
        // Physics Kinematics Equations
        const currentYMeters = height + (vy_initial * time) - (0.5 * gravity * time * time);
        
        const currentX = originX + (vx * time) * SCALE;
        const currentY = originY - (currentYMeters * SCALE);

        // Check ground collision
        if (currentYMeters < 0 && isSimulating) {
            setIsSimulating(false);
        }

        // Draw Trajectory
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6'; // lab-blue
        ctx.lineWidth = isElementary ? 5 : 3;
        ctx.setLineDash(isElementary ? [] : [5, 5]);
        if (trajectory.length > 0) {
            ctx.moveTo(trajectory[0].x, trajectory[0].y);
            trajectory.forEach(p => ctx.lineTo(p.x, p.y));
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Projectile
        ctx.beginPath();
        ctx.arc(currentX, currentY >= originY ? originY : currentY, isElementary ? 12 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isElementary ? '#f43f5e' : '#dc2626'; // Bigger brighter ball for kids
        ctx.fill();
        if(isElementary) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Velocity Vector (High School Only)
        if (isSimulating && isHighSchool) {
            const vy_current = vy_initial - (gravity * time);
            const vectorScale = 2; 
            
            ctx.beginPath();
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(currentX + vx * vectorScale, currentY - vy_current * vectorScale);
            ctx.strokeStyle = '#10b981'; // teal
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Cannon/Launcher Visualization
        const cannonLen = isElementary ? 40 : 30;
        ctx.save();
        ctx.translate(originX, originY - (height * SCALE));
        ctx.rotate(-rad);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, -5, cannonLen, 10);
        ctx.restore();
    };

    draw();

    if (isSimulating) {
        animationRef.current = requestAnimationFrame(() => {
            // simple time step
            setTime(prev => prev + 0.05);
            
            // Add point to trajectory
            const rad = angle * (Math.PI / 180);
            const vx = velocity * Math.cos(rad);
            const vy_initial = velocity * Math.sin(rad);
            const currX = 50 + (vx * time) * SCALE;
            const currY = (canvas.height - 20) - (height + (vy_initial * time) - (0.5 * gravity * time * time)) * SCALE;
            
            if (currY <= canvas.height - 20) {
                setTrajectory(prev => [...prev, {x: currX, y: currY}]);
            }
        });
    }

    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [angle, velocity, gravity, height, time, isSimulating, level]);

  // Derived Metrics
  const rad = angle * (Math.PI / 180);
  const vy_init = velocity * Math.sin(rad);
  const totalTime = (vy_init + Math.sqrt(vy_init*vy_init + 2*gravity*height)) / gravity;
  const maxH = height + (vy_init * vy_init) / (2 * gravity);
  const range = velocity * Math.cos(rad) * totalTime;

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 gap-4">
      {/* Controls */}
      <div className={`grid ${isElementary ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-5'} gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200`}>
         <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase">{isElementary ? 'Power' : 'Velocity (v₀)'}</label>
            {isElementary ? (
                <input type="range" min="30" max="100" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="accent-lab-blue h-6" />
            ) : (
                <>
                    <input type="number" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="border p-1 rounded font-mono text-sm" />
                    <span className="text-xs text-slate-400">m/s</span>
                </>
            )}
         </div>
         <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-500 uppercase">{isElementary ? 'Aim' : 'Angle (θ)'}</label>
             {isElementary ? (
                <input type="range" min="10" max="80" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="accent-lab-indigo h-6" />
            ) : (
                <>
                    <input type="number" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="border p-1 rounded font-mono text-sm" />
                    <span className="text-xs text-slate-400">degrees</span>
                </>
            )}
         </div>
         
         {!isElementary && (
             <>
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase">Gravity (g)</label>
                    <input type="number" value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="border p-1 rounded font-mono text-sm" />
                    <span className="text-xs text-slate-400">m/s²</span>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 uppercase">Height (h₀)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="border p-1 rounded font-mono text-sm" />
                    <span className="text-xs text-slate-400">meters</span>
                </div>
             </>
         )}

         <div className="flex items-center gap-2 justify-end">
            <button onClick={reset} className="p-2 text-slate-500 hover:bg-slate-100 rounded">
                <RotateCcw size={20} />
            </button>
            <button onClick={startSimulation} disabled={isSimulating} className="flex items-center gap-2 bg-lab-blue text-white px-4 py-2 rounded shadow hover:bg-blue-600 disabled:opacity-50">
                <Play size={16} /> {isElementary ? 'LAUNCH!' : 'Run'}
            </button>
         </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-grow flex gap-4 overflow-hidden">
         <div className="flex-grow relative bg-white rounded-lg border border-slate-200 overflow-hidden shadow-inner">
             <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full block ${!isElementary && 'bg-grid'}`} />
         </div>
         
         {/* Data Panel - Hidden for Elementary */}
         {!isElementary && (
            <div className="w-48 bg-slate-800 text-white p-4 rounded-lg shadow-lg font-mono text-sm flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2 text-lab-teal mb-2 border-b border-slate-600 pb-2">
                    <Activity size={16} />
                    <span className="font-bold">DATA LOG</span>
                </div>
                <div>
                    <span className="block text-slate-400 text-xs">{isHighSchool ? 'Total Time' : 'Time'}</span>
                    <span className="text-xl">{totalTime.toFixed(2)}s</span>
                </div>
                <div>
                    <span className="block text-slate-400 text-xs">Max Height</span>
                    <span className="text-xl">{maxH.toFixed(2)}m</span>
                </div>
                <div>
                    <span className="block text-slate-400 text-xs">{isHighSchool ? 'Range' : 'Distance'}</span>
                    <span className="text-xl">{range.toFixed(2)}m</span>
                </div>
                {isHighSchool && (
                    <div className="pt-4 border-t border-slate-600">
                        <span className="block text-slate-400 text-xs">Current T</span>
                        <span className="text-lg text-yellow-400">{time.toFixed(2)}s</span>
                    </div>
                )}
            </div>
         )}
      </div>
    </div>
  );
};

export default PhysicsLab;