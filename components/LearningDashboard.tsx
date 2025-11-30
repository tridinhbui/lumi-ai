import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, BookOpen, CheckCircle2, 
  Clock, Award, BarChart3, Brain, Lightbulb, FileText
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const LearningDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'insights'>('overview');

  // Sample data - in production, this would come from API
  const learningProgress = [
    { week: 'Week 1', cases: 2, score: 75 },
    { week: 'Week 2', cases: 4, score: 82 },
    { week: 'Week 3', cases: 3, score: 88 },
    { week: 'Week 4', cases: 5, score: 85 },
    { week: 'Week 5', cases: 4, score: 92 },
  ];

  const caseTypes = [
    { name: 'Market Entry', completed: 8, total: 10, color: '#10b981' },
    { name: 'Pricing Strategy', completed: 6, total: 10, color: '#3b82f6' },
    { name: 'Growth Strategy', completed: 7, total: 10, color: '#f59e0b' },
    { name: 'Operations', completed: 5, total: 10, color: '#ef4444' },
    { name: 'M&A', completed: 4, total: 10, color: '#8b5cf6' },
  ];

  const skillBreakdown = [
    { skill: 'Structuring', score: 90 },
    { skill: 'Quantitative', score: 85 },
    { skill: 'Interpretation', score: 88 },
    { skill: 'Synthesis', score: 87 },
    { skill: 'Communication', score: 92 },
  ];

  const insights = [
    {
      type: 'strength',
      title: 'Strong in Market Entry Cases',
      description: 'You\'ve completed 8/10 market entry cases with an average score of 88%',
      icon: <Award className="w-5 h-5 text-green-600" />
    },
    {
      type: 'improvement',
      title: 'Focus on Operations Cases',
      description: 'Operations cases show lower completion rate. Consider practicing more.',
      icon: <Target className="w-5 h-5 text-orange-600" />
    },
    {
      type: 'trend',
      title: 'Improving Trend',
      description: 'Your average score has increased by 17% over the last 5 weeks',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />
    },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                <Brain className="w-6 h-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Lumi</h1>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Learning Dashboard</h2>
                <p className="text-sm text-gray-500">Theo dõi lộ trình học và tư duy giải case</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center space-x-3">
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                <span className="hidden md:block text-sm text-gray-700">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'progress'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'insights'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Insights
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Cases</p>
                    <p className="text-3xl font-bold text-gray-900">28</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">+5 this week</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-gray-900">86%</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">+12% improvement</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">30</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Out of 50 cases</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Study Hours</p>
                    <p className="text-3xl font-bold text-gray-900">42h</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Learning Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={learningProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="cases" stroke="#10b981" strokeWidth={2} name="Cases Completed" />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Average Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Case Types Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Case Types Progress
              </h3>
              <div className="space-y-4">
                {caseTypes.map((type, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{type.name}</span>
                      <span className="text-sm text-gray-500">{type.completed}/{type.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(type.completed / type.total) * 100}%`,
                          backgroundColor: type.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Skill Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-green-600" />
                Skill Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="skill" stroke="#6b7280" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
              <div className="space-y-4">
                {learningProgress.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{week.week}</p>
                      <p className="text-sm text-gray-500">{week.cases} cases completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{week.score}%</p>
                      <p className="text-xs text-gray-500">Average</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    {insight.icon}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Recommendations
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Practice Operations Cases</p>
                    <p className="text-sm text-gray-600">Focus on operations strategy cases to improve your weakest area</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <Target className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Maintain Your Strengths</p>
                    <p className="text-sm text-gray-600">Continue practicing market entry cases to maintain your high performance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Review Framework Applications</p>
                    <p className="text-sm text-gray-600">Spend time reviewing how different frameworks apply to various case types</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningDashboard;

