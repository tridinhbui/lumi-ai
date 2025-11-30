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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b-2 border-[#1e3a8a] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <BizCaseLogo size="md" showText={true} />
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="relative">
                <button
                  onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                  className="flex items-center space-x-2 px-3 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                </button>
              </div>
              {user && <SettingsMenu user={user} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#1e3a8a] rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-[#1e3a8a] mb-4">
            {t('welcome_back')}, <span className="text-[#1e40af]">{user?.name?.split(' ')[0] || 'User'}</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('strategic_ai')} - Lumi, một phần của BizCase Lab
          </p>
        </div>

        {/* About Section */}
        <div className="mb-12 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold mb-2">{t('about_title')}</h3>
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${showAbout ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {showAbout && (
            <div className="space-y-4 text-white/95 leading-relaxed">
              <p>{t('about_p1')}</p>
              <p>{t('about_p2')}</p>
              <p>{t('about_p3')}</p>
              <p>{t('about_p4')}</p>
              <p className="font-semibold">{t('about_p5')}</p>
              <p>{t('about_p6')}</p>
              <p className="text-lg font-semibold mt-4">{t('about_p7')}</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#1e3a8a] rounded-xl">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-[#1e3a8a] bg-blue-50 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#1e3a8a]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-lg p-6 text-left text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
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
