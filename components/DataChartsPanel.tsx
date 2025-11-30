import React, { useState } from 'react';
import { BarChart3, Table, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface DataChartsPanelProps {
  data?: any[];
  chartType?: 'bar' | 'line' | 'pie' | 'table';
  title?: string;
}

const DataChartsPanel: React.FC<DataChartsPanelProps> = ({ 
  data = [], 
  chartType = 'bar',
  title = 'Data & Charts'
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [currentChartType, setCurrentChartType] = useState<'bar' | 'line' | 'pie'>(chartType as 'bar' | 'line' | 'pie');

  // Sample data if none provided
  const sampleData = data.length > 0 ? data : [
    { name: 'Segment A', value: 400, revenue: 1200 },
    { name: 'Segment B', value: 300, revenue: 800 },
    { name: 'Segment C', value: 200, revenue: 600 },
    { name: 'Segment D', value: 278, revenue: 500 },
  ];

  const COLORS = ['#1F4AA8', '#4C86FF', '#0057E7', '#153A73', '#A7F3D0'];

  const renderChart = () => {
    if (currentChartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EF" />
            <XAxis dataKey="name" stroke="#737373" />
            <YAxis stroke="#737373" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderColor: '#E6E9EF', 
                borderRadius: '8px' 
              }}
            />
            <Bar dataKey="value" fill="#1F4AA8" radius={[8, 8, 0, 0]} />
            <Bar dataKey="revenue" fill="#4C86FF" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (currentChartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E9EF" />
            <XAxis dataKey="name" stroke="#737373" />
            <YAxis stroke="#737373" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderColor: '#E6E9EF', 
                borderRadius: '8px' 
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#1F4AA8" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="#4C86FF" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (currentChartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sampleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sampleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 lg:mb-4 gap-2">
        <h3 className="text-sm lg:text-base font-semibold text-[#1F4AA8] flex items-center">
          <div className="w-2 h-2 bg-[#153A73] rounded-full mr-2" />
          {title}
        </h3>
        <div className="flex items-center space-x-2 flex-wrap">
          {viewMode === 'chart' && (
            <div className="flex items-center space-x-1 bg-[#F8F9FB] rounded-lg p-1">
              <button
                onClick={() => setCurrentChartType('bar')}
                className={`p-1.5 rounded transition-all ${
                  currentChartType === 'bar' 
                    ? 'bg-[#1F4AA8] text-white' 
                    : 'text-[#737373] hover:bg-[#E6E9EF]'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentChartType('line')}
                className={`p-1.5 rounded transition-all ${
                  currentChartType === 'line' 
                    ? 'bg-[#1F4AA8] text-white' 
                    : 'text-[#737373] hover:bg-[#E6E9EF]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentChartType('pie')}
                className={`p-1.5 rounded transition-all ${
                  currentChartType === 'pie' 
                    ? 'bg-[#1F4AA8] text-white' 
                    : 'text-[#737373] hover:bg-[#E6E9EF]'
                }`}
              >
                <div className="w-4 h-4 rounded-full border-2 border-current" />
              </button>
            </div>
          )}
          <button
            onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'table' 
                ? 'bg-[#1F4AA8] text-white' 
                : 'bg-[#F8F9FB] text-[#737373] hover:bg-[#E6E9EF]'
            }`}
          >
            {viewMode === 'chart' ? <Table className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="mt-4">
          {renderChart()}
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E6E9EF]">
                <th className="text-left py-3 px-4 font-semibold text-[#1F4AA8]">Name</th>
                <th className="text-right py-3 px-4 font-semibold text-[#1F4AA8]">Value</th>
                <th className="text-right py-3 px-4 font-semibold text-[#1F4AA8]">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr key={index} className="border-b border-[#E6E9EF] hover:bg-[#F8F9FB]">
                  <td className="py-3 px-4 text-[#2E2E2E]">{row.name}</td>
                  <td className="py-3 px-4 text-right text-[#2E2E2E]">{row.value}</td>
                  <td className="py-3 px-4 text-right text-[#1F4AA8] font-medium">{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataChartsPanel;

