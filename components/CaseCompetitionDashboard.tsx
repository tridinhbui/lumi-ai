import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Bubble
} from 'recharts';
import { TrendingUp, MapPin, Users, DollarSign, Target, BarChart3 } from 'lucide-react';

export interface DashboardData {
  charts?: Array<{
    type: 'bar' | 'line' | 'pie' | 'scatter';
    title: string;
    data: any[];
  }>;
  mapData?: Array<{
    location: string;
    lat: number;
    lng: number;
    value: number;
    label: string;
  }>;
  tables?: Array<{
    title: string;
    headers: string[];
    rows: any[][];
  }>;
  insights?: string[];
  frameworks?: string[];
}

interface CaseCompetitionDashboardProps {
  data: DashboardData | null;
}

const CaseCompetitionDashboard: React.FC<CaseCompetitionDashboardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'charts' | 'map' | 'insights'>('charts');

  // Sample map data if no data provided
  const defaultMapData = [
    { location: 'North', lat: 40.7128, lng: -74.0060, value: 85, label: 'Market A' },
    { location: 'South', lat: 34.0522, lng: -118.2437, value: 72, label: 'Market B' },
    { location: 'East', lat: 39.9526, lng: -75.1652, value: 90, label: 'Market C' },
    { location: 'West', lat: 37.7749, lng: -122.4194, value: 68, label: 'Market D' },
  ];

  const mapData = data?.mapData || defaultMapData;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const renderChart = (chart: any, index: number) => {
    switch (chart.type) {
      case 'bar':
        return (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">{chart.title}</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">{chart.title}</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'pie':
        return (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">{chart.title}</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chart.data.map((entry: any, idx: number) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 lg:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <h2 className="text-base lg:text-lg font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-600" />
            <span className="hidden sm:inline">Case Analysis Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </h2>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 lg:space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'charts'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'map'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1" />
            Map
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'insights'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Insights
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4">
        {activeTab === 'charts' && (
          <div>
            {data?.charts && data.charts.length > 0 ? (
              data.charts.map((chart, index) => renderChart(chart, index))
            ) : (
              <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No charts available yet.</p>
                <p className="text-sm text-gray-400 mt-2">Upload case documents to generate visualizations.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Geographic Analysis</h4>
            <div className="space-y-3">
              {mapData.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{point.label}</p>
                      <p className="text-xs text-gray-500">{point.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{point.value}</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Interactive map visualization will be displayed here. 
                Click on markers to see detailed information.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {data?.insights && data.insights.length > 0 ? (
              data.insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No insights extracted yet.</p>
                <p className="text-sm text-gray-400 mt-2">Upload documents or ask questions to generate insights.</p>
              </div>
            )}

            {data?.frameworks && data.frameworks.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Suggested Frameworks</h4>
                <div className="space-y-2">
                  {data.frameworks.map((framework, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                      {framework}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseCompetitionDashboard;

