import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, BarChart3, BookOpen, 
  ArrowRight, Sparkles, Zap, Award, Clock, TrendingUp, Target,
  Globe, ChevronDown
} from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import FloatingChat from './FloatingChat';
import CaseLibrary from './CaseLibrary';
import HomePageThreads from './HomePageThreads';
import BizCaseLogo from './BizCaseLogo';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [showAbout, setShowAbout] = React.useState(false);

  const quickStats = [
    { label: t('active_threads'), value: '5', icon: MessageSquare, change: '+2' },
    { label: t('cases_solved'), value: '28', icon: Target, change: '+5' },
    { label: t('avg_score'), value: '86%', icon: TrendingUp, change: '+12%' },
    { label: t('study_hours'), value: '42h', icon: Clock, change: '+8h' },
  ];

  const quickActions = [
    {
      title: t('start_new_chat'),
      description: t('start_new_chat_desc'),
      icon: MessageSquare,
      action: () => navigate('/lumi'),
    },
    {
      title: t('learning_dashboard'),
      description: t('learning_dashboard_desc'),
      icon: BarChart3,
      action: () => navigate('/dashboard'),
    },
    {
      title: t('case_library'),
      description: t('case_library_desc'),
      icon: BookOpen,
      action: () => navigate('/lumi'),
    },
  ];

  const achievements = [
    { title: 'Case Master', description: 'Giải được 25+ cases', progress: 28, target: 25 },
    { title: 'Quick Learner', description: '10+ giờ tuần này', progress: 12, target: 10 },
    { title: 'Consistency King', description: 'Chuỗi 7 ngày', progress: 7, target: 7 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Minimal Header */}
      <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <BizCaseLogo size="md" showText={true} />
            </div>
            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center space-x-2 px-3 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
              </button>
              {user && <SettingsMenu user={user} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-900 rounded-2xl mb-6 shadow-sm">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-semibold text-neutral-900 mb-4 tracking-tight">
            {t('welcome_back')}, <span className="text-neutral-600">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t('strategic_ai')} - Lumi, part of BizCase Lab
          </p>
        </div>

        {/* About Section */}
        <div className="mb-12 bg-white border border-neutral-200 rounded-2xl shadow-sm p-8">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">{t('about_title')}</h2>
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-5 h-5 text-neutral-600 transition-transform ${showAbout ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showAbout && (
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>{t('about_p1')}</p>
              <p>{t('about_p2')}</p>
              <p>{t('about_p3')}</p>
              <p>{t('about_p4')}</p>
              <p className="font-semibold text-neutral-900">{t('about_p5')}</p>
              <p>{t('about_p6')}</p>
              <p className="text-lg font-semibold text-neutral-900 mt-4">{t('about_p7')}</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-neutral-100 rounded-xl">
                  <stat.icon className="w-5 h-5 text-neutral-700" />
                </div>
                <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-neutral-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Threads */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Chat với Lumi
          </h3>
          <HomePageThreads />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-neutral-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-neutral-100 rounded-xl group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <action.icon className="w-5 h-5 text-neutral-700 group-hover:text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{action.title}</h3>
                <p className="text-sm text-neutral-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2" />
            {t('achievements')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const progress = Math.min(100, (achievement.progress / achievement.target) * 100);
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-[#1e3a8a] rounded-xl">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1e3a8a]">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-semibold text-[#1e3a8a]">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] h-2 rounded-full transition-all duration-500"
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
        <div className="mt-8 bg-white rounded-2xl shadow-lg border-2 border-[#1e3a8a] p-6">
          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2" />
            {t('recent_activity')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-[#1e3a8a]/10 rounded-xl border border-[#1e3a8a]/20">
              <div className="p-2 bg-[#1e3a8a] rounded-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#1e3a8a]">{t('case_competition_thread')}</p>
                <p className="text-sm text-gray-600">{t('last_active')} 2 {t('hours_ago')}</p>
              </div>
              <span className="text-xs font-medium text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-full border border-[#1e3a8a]">Active</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="p-2 bg-[#1e3a8a] rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#1e3a8a]">Market Entry Case</p>
                <p className="text-sm text-gray-600">{t('completed')} {t('yesterday')}</p>
              </div>
              <span className="text-xs font-medium text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-full border border-[#1e3a8a]">{t('completed')}</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="p-2 bg-[#1e3a8a] rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#1e3a8a]">{t('score_improved')} 12%</p>
                <p className="text-sm text-gray-600">{t('this_week')}</p>
              </div>
              <span className="text-xs font-medium text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-full border border-[#1e3a8a]">+12%</span>
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
