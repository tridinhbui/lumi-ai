import React, { useState, useEffect } from 'react';
import { DashboardProps } from '../types';
import { Target, TrendingUp, BarChart3, PieChart, CheckCircle2, BrainCircuit, Activity, Lock, Zap, MessageSquareQuote, Radio } from 'lucide-react';
import { 
  ResponsiveContainer, Treemap, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, Cell
} from 'recharts';
import { STRUCTURE_TREE_DATA, REGION_RADAR_DATA, MARGIN_BRIDGE_DATA } from '../constants';

const Dashboard: React.FC<DashboardProps> = ({ currentStage, currentFeedback, feedbackStatus }) => {
  
  // --- Real-time Data Simulation State ---
  const [treeData, setTreeData] = useState(STRUCTURE_TREE_DATA);
  const [radarData, setRadarData] = useState(REGION_RADAR_DATA);
  
  // Effect to simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Perturb Tree Data (Much subtler fluctuation)
      setTreeData(prev => prev.map(item => ({
        ...item,
        size: Math.max(10, item.size + (Math.random() * 4 - 2)) // Reduced variance to +/- 2
      })));

      // Perturb Radar Data (Subtle)
      setRadarData(prev => prev.map(item => ({
        ...item,
        A: Math.min(100, Math.max(0, item.A + (Math.random() * 4 - 2))), 
        B: Math.min(100, Math.max(0, item.B + (Math.random() * 2 - 1))),
      })));
    }, 4500); // Slowed down to 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  const stages = ['intro', 'structure', 'quant', 'interpretation', 'synthesis'];
  const currentIndex = stages.indexOf(currentStage);
  const progress = Math.min(100, Math.round(((currentIndex) / (stages.length - 1)) * 100));

  const getStepStatus = (stepStage: string) => {
    const stepIndex = stages.indexOf(stepStage);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const renderStep = (stageId: string, label: string, icon: React.ReactNode, index: number) => {
    const status = getStepStatus(stageId);
    const isLast = index === stages.length - 1;

    let containerClass = "relative flex items-center p-3 rounded-xl border transition-all duration-500 ease-out ";
    let iconClass = "mr-3 z-10 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ";
    let textClass = "flex-1 transition-colors duration-300 ";
    
    if (status === 'active') {
      containerClass += "bg-green-50 border-green-200 shadow-sm scale-[1.02] ";
      iconClass += "bg-green-600 text-white border-green-500 shadow-md scale-110 ";
      textClass += "text-green-900 font-bold";
    } else if (status === 'completed') {
      containerClass += "bg-white border-green-100 opacity-90 ";
      iconClass += "bg-green-100 text-green-600 border-green-200 ";
      textClass += "text-green-800 font-medium";
    } else {
      containerClass += "bg-gray-50 border-transparent opacity-60 grayscale ";
      iconClass += "bg-gray-200 text-gray-400 border-gray-300 ";
      textClass += "text-gray-400";
    }

    return (
      <div key={stageId} className="relative">
        <div className={containerClass}>
          <div className={iconClass}>
            {status === 'completed' ? <CheckCircle2 size={16} /> : 
             status === 'pending' ? <Lock size={14} /> : icon}
          </div>
          
          <div className={textClass}>
            <div className="flex justify-between items-center">
               <p className="text-sm">{label}</p>
               {status === 'active' && <Activity size={12} className="text-green-500 animate-pulse" />}
            </div>
            {status === 'active' && (
               <div className="flex items-center space-x-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] text-green-600 font-mono uppercase tracking-widest">
                    In Progress
                  </span>
               </div>
            )}
          </div>
        </div>
        
        {/* Connector Line Segment */}
        {!isLast && (
           <div className={`absolute left-[1.65rem] top-12 h-6 w-0.5 -z-0 transition-colors duration-700 ${
              status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
           }`}></div>
        )}
      </div>
    );
  };

  // --- Dynamic Chart Rendering Logic ---

  const renderStructureChart = () => (
    <div className="h-full w-full animate-in zoom-in duration-500 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center">
          <PieChart size={12} className="mr-1.5 text-green-600"/> Live Profit Drivers
        </h4>
        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-mono flex items-center">
           <Zap size={8} className="mr-1 fill-current" /> STREAMING
        </span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <Treemap
          data={treeData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff" 
          isAnimationActive={true}
          animationDuration={1500} 
        >
           <Tooltip 
             contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
             itemStyle={{ color: '#0f172a' }}
           />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );

  const renderQuantChart = () => (
    <div className="h-full w-full animate-in slide-in-from-bottom duration-500 flex flex-col">
       <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center">
          <BarChart3 size={12} className="mr-1.5 text-green-600"/> Margin Bridge
        </h4>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">SNAPSHOT</span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={MARGIN_BRIDGE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{fontSize: 9, fill: '#64748b'}} interval={0} />
          <YAxis tick={{fontSize: 10, fill: '#64748b'}} />
          <Tooltip 
            cursor={{fill: 'rgba(0,0,0,0.03)'}}
            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <ReferenceLine y={0} stroke="#94a3b8" />
          <Bar dataKey="value" animationDuration={1500} radius={[2, 2, 0, 0]}>
            {MARGIN_BRIDGE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderInterpretationChart = () => (
    <div className="h-full w-full animate-in fade-in duration-700 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center">
          <TrendingUp size={12} className="mr-1.5 text-green-600"/> Regional Scoring
        </h4>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Sunbelt" dataKey="B" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.3} isAnimationActive={false} />
          <Radar name="Metro" dataKey="A" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.1} isAnimationActive={false} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex justify-center space-x-4 text-[10px] text-slate-500 mt-1">
        <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div> Sunbelt</span>
        <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div> Metro</span>
      </div>
    </div>
  );

  const renderSynthesisChart = () => (
    <div className="h-full w-full flex flex-col items-center justify-center animate-in zoom-in duration-700">
       <div className="relative w-32 h-32 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="#e2e8f0" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r="60" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset="0" className="animate-[dash_1.5s_ease-out]" />
          </svg>
          <CheckCircle2 size={48} className="text-green-600 absolute animate-bounce" />
       </div>
       <h3 className="text-lg font-bold text-slate-800 mb-1">Analysis Complete</h3>
       <p className="text-xs text-slate-500 text-center px-6">Case Solved • Recommendation Ready</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 text-slate-800 font-sans shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.05)]">
      
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
           <h2 className="text-[10px] font-bold text-green-700 uppercase tracking-[0.2em] flex items-center">
             <BrainCircuit size={12} className="mr-1.5"/> Live Session
           </h2>
           <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white border border-red-100 shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-red-500">REC</span>
           </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-slate-800 tracking-tight">MediDrone Analyst Hub</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        
        {/* Real-time Feedback Section */}
        <div className="p-5 pb-2 border-b border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className={`p-4 rounded-lg border-l-4 shadow-sm transition-all duration-500 ${
            feedbackStatus === 'positive' ? 'bg-green-50/80 border-green-500' :
            feedbackStatus === 'attention' ? 'bg-amber-50/80 border-amber-400' :
            'bg-slate-50/80 border-slate-300'
          }`}>
             <div className="flex justify-between items-start mb-2">
                <h4 className={`text-xs font-bold uppercase flex items-center ${
                  feedbackStatus === 'positive' ? 'text-green-800' : 
                  feedbackStatus === 'attention' ? 'text-amber-700' : 
                  'text-slate-500'
                }`}>
                  <MessageSquareQuote size={12} className="mr-1.5" /> 
                  Live Interviewer Assessment
                </h4>
                <div className={`flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    feedbackStatus === 'positive' ? 'bg-green-100 text-green-700' :
                    feedbackStatus === 'attention' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-200 text-slate-600'
                }`}>
                   <Radio size={8} className="mr-1 animate-pulse" /> Live Analysis
                </div>
             </div>
             
             <p className={`text-sm leading-relaxed font-medium ${
               feedbackStatus === 'positive' ? 'text-green-900' : 
               feedbackStatus === 'attention' ? 'text-amber-900' : 
               'text-slate-700'
             }`}>
               "{currentFeedback}"
             </p>
          </div>
        </div>

        {/* Logic Tree / Timeline */}
        <div className="p-5 space-y-6">
          {/* Progress Bar */}
          <div>
             <div className="flex justify-between items-end mb-2">
                <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Case Progress</h3>
                <span className="text-xs font-mono text-green-600 font-bold">{progress}%</span>
             </div>
             <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-1000 ease-in-out relative"
                  style={{ width: `${progress}%` }}
                >
                   <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-[1px]"></div>
                </div>
             </div>
          </div>

          {/* Steps List */}
          <div className="space-y-2">
             {renderStep('intro', 'Context', <Target size={16} />, 0)}
             {renderStep('structure', 'Structure', <PieChart size={16} />, 1)}
             {renderStep('quant', 'Economics', <BarChart3 size={16} />, 2)}
             {renderStep('interpretation', 'Strategy', <TrendingUp size={16} />, 3)}
             {renderStep('synthesis', 'Close', <CheckCircle2 size={16} />, 4)}
          </div>
        </div>
      </div>

      {/* Dynamic Visualization Panel */}
      <div className="h-[35%] min-h-[250px] bg-slate-50 border-t border-gray-200 p-5 relative overflow-hidden flex flex-col">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-green-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex-1 flex flex-col z-10">
           {currentStage === 'intro' && (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-green-200 rounded-full blur-xl animate-pulse opacity-50"></div>
                  <Activity size={40} className="text-green-600 relative z-10" />
                </div>
                <h4 className="text-sm font-bold text-slate-700 mb-1">Awaiting Input Stream</h4>
                <p className="text-xs text-slate-400 font-mono">System Ready • Initializing Case...</p>
              </div>
           )}
           {currentStage === 'structure' && renderStructureChart()}
           {currentStage === 'quant' && renderQuantChart()}
           {currentStage === 'interpretation' && renderInterpretationChart()}
           {currentStage === 'synthesis' && renderSynthesisChart()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;