import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, BookOpen, CheckCircle2, 
  Clock, Award, BarChart3, Lightbulb, FileText
} from 'lucide-react';
import BizCaseLogo from './BizCaseLogo';
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
    { name: 'Market Entry', completed: 8, total: 10, color: '#1F4AA8' },
    { name: 'Pricing Strategy', completed: 6, total: 10, color: '#4C86FF' },
    { name: 'Growth Strategy', completed: 7, total: 10, color: '#0057E7' },
    { name: 'Operations', completed: 5, total: 10, color: '#153A73' },
    { name: 'M&A', completed: 4, total: 10, color: '#1F4AA8' },
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
      icon: <Award className="w-5 h-5 text-[#153A73] icon-line-art" />
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
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Minimal Header */}
      <header className="w-full bg-white border-b border-[#E6E9EF]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                <BizCaseLogo size="md" showText={false} />
              </div>
              <div className="h-6 w-px bg-[#E6E9EF]"></div>
              <div>
                <h2 className="text-xl font-semibold text-[#1F4AA8]">Learning Dashboard</h2>
                <p className="text-sm text-[#737373]">Track learning progress and case-solving mindset</p>
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
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'progress'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'insights'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
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
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E6E9EF] minimal-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#737373] mb-1">Total Cases</p>
                    <p className="text-3xl font-bold text-[#1F4AA8]">28</p>
                  </div>
                  <div className="p-3 bg-[#E6F0FF] rounded-lg">
                    <FileText className="w-6 h-6 text-[#1F4AA8]" />
                  </div>
                </div>
                <p className="text-xs text-[#1F4AA8] mt-2">+5 this week</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E6E9EF] minimal-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#737373] mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-[#1F4AA8]">86%</p>
                  </div>
                  <div className="p-3 bg-[#E6F0FF] rounded-lg">
                    <TrendingUp className="w-6 h-6 text-[#1F4AA8]" />
                  </div>
                </div>
                <p className="text-xs text-[#1F4AA8] mt-2">+12% improvement</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E6E9EF] minimal-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#737373] mb-1">Completed</p>
                    <p className="text-3xl font-bold text-[#1F4AA8]">30</p>
                  </div>
                  <div className="p-3 bg-[#E6F0FF] rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-[#1F4AA8]" />
                  </div>
                </div>
                <p className="text-xs text-[#737373] mt-2">Out of 50 cases</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E6E9EF] minimal-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#737373] mb-1">Study Hours</p>
                    <p className="text-3xl font-bold text-[#1F4AA8]">42h</p>
                  </div>
                  <div className="p-3 bg-[#E6F0FF] rounded-lg">
                    <Clock className="w-6 h-6 text-[#1F4AA8]" />
                  </div>
                </div>
                <p className="text-xs text-[#737373] mt-2">This month</p>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#1F4AA8] mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[#153A73] icon-line-art" />
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
                  <Line type="monotone" dataKey="cases" stroke="#1F4AA8" strokeWidth={2} name="Cases Completed" />
                  <Line type="monotone" dataKey="score" stroke="#4C86FF" strokeWidth={2} name="Average Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Case Types Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#1F4AA8] mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-[#153A73] icon-line-art" />
                Case Type Progress
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
              <h3 className="text-lg font-semibold text-[#1F4AA8] mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-[#153A73] icon-line-art" />
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
                  <Bar dataKey="score" fill="#1F4AA8" radius={[8, 8, 0, 0]} />
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
                      <p className="font-semibold text-neutral-900">{week.score}%</p>
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
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-[#E6E9EF]">
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
                <div className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <Target className="w-5 h-5 text-neutral-600 mt-0.5" />
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

