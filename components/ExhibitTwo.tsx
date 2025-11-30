import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ZAxis, ReferenceArea } from 'recharts';
import { ROLLOUT_DATA } from '../constants';

const ExhibitTwo: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-2 mb-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          Exhibit 2: Market Entry Analysis
        </h3>
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">SOURCE: MARKET STUDY</span>
      </div>

      <div className="h-72 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="value" 
              name="Regulatory Speed" 
              domain={[0, 100]} 
              label={{ value: 'Regulatory Speed (Score 0-100)', position: 'bottom', offset: 0, fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="value2" 
              name="Demand" 
              domain={[0, 100]} 
              label={{ value: 'Hospital Demand Density', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            <ZAxis range={[300, 300]} /> 
            
            {/* Quadrant Backgrounds implicitly understood or we can use ReferenceArea */}
            <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="rgba(22, 163, 74, 0.05)" />
            
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ borderRadius: '8px' }}
            />
            <Scatter name="Markets" data={ROLLOUT_DATA} fill="#15803d">
               <LabelList dataKey="category" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        <div className="absolute top-2 right-2 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
          Target Zone
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 italic border-t pt-2">
        X-Axis: Higher score = Faster approvals. Y-Axis: Higher score = More delivery volume.
      </div>
    </div>
  );
};

export default ExhibitTwo;
