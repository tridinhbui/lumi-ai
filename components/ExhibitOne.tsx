import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { UNIT_ECONOMICS_DATA } from '../constants';

const ExhibitOne: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-2 mb-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          Exhibit 1: Unit Cost per Delivery
        </h3>
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">DATA: INTERNAL OPS</span>
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={UNIT_ECONOMICS_DATA}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis type="category" dataKey="category" tick={{fontSize: 11}} />
            <YAxis type="number" tickFormatter={(val) => `$${val}`} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
            <Bar dataKey="value" name="Model A (Manual)" fill="#94a3b8" stackId="a" />
            <Bar dataKey="value2" name="Model X (Auto)" fill="#15803d" stackId="b" />
            
            <ReferenceLine y={0} stroke="#000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
        <span>*Revenue per delivery is fixed at $50.00</span>
        <span className="font-semibold text-red-500">Model A Margin: -$5.00</span>
      </div>
    </div>
  );
};

export default ExhibitOne;
