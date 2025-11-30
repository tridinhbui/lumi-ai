import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, MessageSquare, BarChart3, Target, TrendingUp, 
  BookOpen, ArrowRight, Sparkles, Zap, Award, Clock, Users
} from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import FloatingChat from './FloatingChat';
import CaseLibrary from './CaseLibrary';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickStats = [
    { label: 'Active Threads', value: '5', icon: MessageSquare, color: 'green', change: '+2' },
    { label: 'Cases Solved', value: '28', icon: Target, color: 'blue', change: '+5' },
    { label: 'Avg Score', value: '86%', icon: TrendingUp, color: 'purple', change: '+12%' },
    { label: 'Study Hours', value: '42h', icon: Clock, color: 'orange', change: '+8h' },
  ];

  const quickActions = [
    {
      title: 'Start New Chat',
      description: 'Begin a conversation with Lumi',
      icon: MessageSquare,
      gradient: 'from-green-500 to-emerald-600',
      action: () => navigate('/lumi'),
    },
    {
      title: 'Learning Dashboard',
      description: 'Track your progress and insights',
      icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-600',
      action: () => navigate('/dashboard'),
    },
    {
      title: 'Case Library',
      description: 'Explore practice cases',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-600',
      action: () => navigate('/lumi'),
    },
  ];

  const achievements = [
    { title: 'Case Master', description: 'Solved 25+ cases', icon: Award, progress: 28, target: 25, color: 'green' },
    { title: 'Quick Learner', description: '10+ hours this week', icon: Zap, progress: 12, target: 10, color: 'blue' },
    { title: 'Consistency King', description: '7 day streak', icon: TrendingUp, progress: 7, target: 7, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <Brain className="w-8 h-8 text-green-600 relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Lumi
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Strategic AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && <SettingsMenu user={user} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome back, <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'User'}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your strategic AI assistant for mastering case competitions and business analysis
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-green-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-gradient-to-br ${action.gradient} rounded-2xl shadow-lg p-6 text-left text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{action.title}</h4>
                <p className="text-sm text-white/90">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const progress = Math.min(100, (achievement.progress / achievement.target) * 100);
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 bg-${achievement.color}-100 rounded-xl`}>
                      <achievement.icon className={`w-6 h-6 text-${achievement.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r from-${achievement.color}-500 to-${achievement.color}-600 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Case Library */}
        <CaseLibrary />

        {/* Recent Activity */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-green-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Case Competition Thread</p>
                <p className="text-sm text-gray-500">Last active 2 hours ago</p>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Market Entry Case</p>
                <p className="text-sm text-gray-500">Completed yesterday</p>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Completed</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Score improved by 12%</p>
                <p className="text-sm text-gray-500">This week</p>
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">+12%</span>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};

export default HomePage;
