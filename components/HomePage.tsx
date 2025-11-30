import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, MessageSquare, BarChart3, Target, TrendingUp, 
  BookOpen, ArrowRight, Sparkles
} from 'lucide-react';
import SettingsMenu from './SettingsMenu';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickStats = [
    { label: 'Active Threads', value: '5', icon: MessageSquare, color: 'green' },
    { label: 'Cases Solved', value: '28', icon: Target, color: 'blue' },
    { label: 'Avg Score', value: '86%', icon: TrendingUp, color: 'purple' },
    { label: 'Study Hours', value: '42h', icon: BookOpen, color: 'orange' },
  ];

  const quickActions = [
    {
      title: 'Start New Chat',
      description: 'Begin a new conversation with Lumi',
      icon: MessageSquare,
      color: 'green',
      action: () => navigate('/lumi'),
    },
    {
      title: 'View Dashboard',
      description: 'Track your learning progress',
      icon: BarChart3,
      color: 'blue',
      action: () => navigate('/dashboard'),
    },
    {
      title: 'Case Competition',
      description: 'Practice case solving',
      icon: Target,
      color: 'purple',
      action: () => navigate('/lumi'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                <Brain className="w-8 h-8 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Lumi</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && <SettingsMenu user={user} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h2>
          <p className="text-xl text-gray-600">
            Your strategic AI assistant for case competition analysis
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-green-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-${action.color}-500 transition-all text-left group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-${action.color}-100 rounded-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 text-gray-400 group-hover:text-${action.color}-600 transition-colors`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Case Competition Thread</p>
                <p className="text-sm text-gray-500">Last active 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Market Entry Case</p>
                <p className="text-sm text-gray-500">Completed yesterday</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Score improved by 12%</p>
                <p className="text-sm text-gray-500">This week</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

