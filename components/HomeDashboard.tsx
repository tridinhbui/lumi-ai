import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, BookOpen, ArrowRight, Target, TrendingUp,
  BarChart3, CheckCircle2, Play, Clock, Award, Zap,
  Sparkles, Globe, FileText, BrainCircuit, Lightbulb
} from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import BizCaseLogo from './BizCaseLogo';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const HomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Learning progress data
  const learningProgress = {
    casesCompleted: 12,
    casesTotal: 20,
    sessionsCompleted: 28,
    masteryLevel: 72, // percentage
  };

  // Skills data for radar chart
  const skillsData = [
    { skill: language === 'vi' ? 'Tư Duy Cấu Trúc' : 'Structured Thinking', level: 85 },
    { skill: language === 'vi' ? 'Phân Tích Số Liệu' : 'Quant Analysis', level: 70 },
    { skill: language === 'vi' ? 'Framework Thị Trường' : 'Market Framework', level: 78 },
    { skill: language === 'vi' ? 'Tổng Hợp' : 'Synthesis', level: 65 },
  ];

  const radarData = skillsData.map(skill => ({
    subject: skill.skill,
    A: skill.level,
    fullMark: 100,
  }));

  // Recommended modules
  const recommendedModules = [
    {
      id: 1,
      title: language === 'vi' ? 'Market Sizing Basics' : 'Market Sizing Basics',
      description: language === 'vi' 
        ? 'Học cách ước tính quy mô thị trường với các phương pháp top-down và bottom-up'
        : 'Learn to estimate market size using top-down and bottom-up approaches',
      icon: Target,
      progress: 0,
    },
    {
      id: 2,
      title: language === 'vi' ? 'Profitability Deep Dive' : 'Profitability Deep Dive',
      description: language === 'vi'
        ? 'Phân tích sâu về cấu trúc chi phí, margin và các yếu tố ảnh hưởng đến lợi nhuận'
        : 'Deep dive into cost structure, margins and factors affecting profitability',
      icon: TrendingUp,
      progress: 0,
    },
    {
      id: 3,
      title: language === 'vi' ? 'Business Understanding' : 'Business Understanding',
      description: language === 'vi'
        ? 'Nắm vững cách phân tích business model, value chain và competitive landscape'
        : 'Master analyzing business models, value chains and competitive landscapes',
      icon: BrainCircuit,
      progress: 0,
    },
    {
      id: 4,
      title: language === 'vi' ? 'Synthesis Mastery' : 'Synthesis Mastery',
      description: language === 'vi'
        ? 'Rèn luyện kỹ năng tổng hợp thông tin và đưa ra recommendations có cấu trúc'
        : 'Practice synthesizing information and delivering structured recommendations',
      icon: Lightbulb,
      progress: 0,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      revealRefs.current.forEach((el) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight - 100;
          if (isVisible) {
            el.classList.add('revealed');
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <header className={`w-full bg-white border-b border-[#E6E9EF] sticky top-0 z-40 transition-all duration-200 ${isScrolled ? 'bg-[#F8F9FB]/90 backdrop-blur-md shadow-sm py-3' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <BizCaseLogo size="md" showText={true} />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center space-x-2 px-3 py-2 bg-[#1F4AA8] text-white rounded-xl hover:bg-[#153A73] transition-all text-sm font-medium shadow-sm hover:shadow-md"
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
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1F4AA8] to-[#153A73] rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-semibold text-[#1F4AA8] mb-4 tracking-tight">
            {language === 'vi' ? 'Chào mừng trở lại' : 'Welcome back'}, <span className="text-[#2E2E2E]">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-2xl mx-auto">
            {language === 'vi'
              ? 'Rèn luyện kỹ năng giải case với hướng dẫn có cấu trúc và coaching thông minh'
              : 'Sharpen your case skills with guided maps and smart coaching'}
          </p>
        </section>

        {/* Two Primary Learning Paths */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Path 1: Case Interview Chatbot */}
            <div
              onClick={() => navigate('/case-competition')}
              className="group relative bg-[#1F4AA8] text-white rounded-2xl p-8 cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mb-6">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-semibold mb-4">
                  {language === 'vi' ? 'Case Interview Chatbot' : 'Case Interview Chatbot'}
                </h2>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  {language === 'vi'
                    ? 'Luyện case từng bước với chatbot thông minh và hướng dẫn theo cấu trúc'
                    : 'Practice cases step-by-step with intelligent chatbot and structured guidance'}
                </p>
                <div className="flex items-center space-x-2 text-white/80 group-hover:text-white transition-colors">
                  <span className="font-medium">{language === 'vi' ? 'Bắt đầu' : 'Start'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Path 2: Case Tutor Guidance Chatbot */}
            <div
              onClick={() => navigate('/general-assistant')}
              className="group relative bg-[#153A73] text-white rounded-2xl p-8 cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-semibold mb-4">
                  {language === 'vi' ? 'Case Tutor Guidance' : 'Case Tutor Guidance'}
                </h2>
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  {language === 'vi'
                    ? 'Học nền tảng case, frameworks và watch-through guided practice'
                    : 'Learn case fundamentals, frameworks and watch-through guided practice'}
                </p>
                <div className="flex items-center space-x-2 text-white/80 group-hover:text-white transition-colors">
                  <span className="font-medium">{language === 'vi' ? 'Bắt đầu' : 'Start'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Progress Panel */}
        <section 
          ref={(el) => { revealRefs.current[0] = el; }}
          className="mb-16 bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-8 reveal-on-scroll"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#1F4AA8] flex items-center">
              <Target className="w-6 h-6 mr-2 text-[#153A73]" />
              {language === 'vi' ? 'Tiến Độ Học Tập' : 'Learning Progress'}
            </h2>
            <div className="text-sm text-[#737373]">
              {language === 'vi' ? 'Tổng quan' : 'Overview'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Stats */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#737373]">{language === 'vi' ? 'Cases đã hoàn thành' : 'Cases Completed'}</span>
                  <span className="text-sm font-semibold text-[#1F4AA8]">
                    {learningProgress.casesCompleted}/{learningProgress.casesTotal}
                  </span>
                </div>
                <div className="w-full bg-[#E6E9EF] rounded-full h-3">
                  <div 
                    className="bg-[#1F4AA8] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(learningProgress.casesCompleted / learningProgress.casesTotal) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#737373]">{language === 'vi' ? 'Sessions đã hoàn thành' : 'Sessions Completed'}</span>
                  <span className="text-sm font-semibold text-[#1F4AA8]">{learningProgress.sessionsCompleted}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#737373]">{language === 'vi' ? 'Mức độ thành thạo' : 'Mastery Level'}</span>
                  <span className="text-sm font-semibold text-[#1F4AA8]">{learningProgress.masteryLevel}%</span>
                </div>
                <div className="w-full bg-[#E6E9EF] rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#1F4AA8] to-[#4C86FF] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${learningProgress.masteryLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Skills Radar Chart */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-[#1F4AA8] mb-4">
                {language === 'vi' ? 'Kỹ Năng Của Bạn' : 'Your Skills'}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E6E9EF" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#2E2E2E', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ fill: '#737373', fontSize: 10 }}
                  />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#1F4AA8"
                    fill="#1F4AA8"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderColor: '#E6E9EF', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Recommended Modules */}
        <section 
          ref={(el) => { revealRefs.current[1] = el; }}
          className="mb-12 reveal-on-scroll"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#1F4AA8] flex items-center">
              <Zap className="w-6 h-6 mr-2 text-[#153A73]" />
              {language === 'vi' ? 'Modules Đề Xuất' : 'Recommended Modules'}
            </h2>
            <button
              onClick={() => navigate('/case-competition')}
              className="text-sm text-[#1F4AA8] hover:text-[#153A73] font-medium flex items-center space-x-1"
            >
              <span>{language === 'vi' ? 'Xem tất cả' : 'View all'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedModules.map((module) => (
              <div
                key={module.id}
                className="bg-white border border-[#E6E9EF] rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate('/case-competition')}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#E6F0FF] rounded-xl mb-4 group-hover:bg-[#1F4AA8] transition-colors">
                  <module.icon className="w-6 h-6 text-[#1F4AA8] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-[#1F4AA8] mb-2">{module.title}</h3>
                <p className="text-sm text-[#737373] mb-4 line-clamp-2">{module.description}</p>
                <button className="w-full px-4 py-2 bg-[#1F4AA8] text-white rounded-xl hover:bg-[#153A73] transition-all text-sm font-medium flex items-center justify-center space-x-2">
                  <span>{language === 'vi' ? 'Bắt đầu' : 'Start'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#1F4AA8] mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-[#153A73]" />
            {language === 'vi' ? 'Hành Động Nhanh' : 'Quick Actions'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/case-competition')}
              className="flex items-center space-x-3 p-4 bg-[#F8F9FB] border border-[#E6E9EF] rounded-xl hover:bg-[#E6F0FF] hover:border-[#1F4AA8] transition-all group"
            >
              <div className="p-2 bg-[#1F4AA8] rounded-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#1F4AA8] text-sm">
                  {language === 'vi' ? 'Tiếp tục session' : 'Continue last session'}
                </div>
                <div className="text-xs text-[#737373]">
                  {language === 'vi' ? 'Quay lại nơi bạn đã dừng' : 'Return to where you left off'}
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/case-competition')}
              className="flex items-center space-x-3 p-4 bg-[#F8F9FB] border border-[#E6E9EF] rounded-xl hover:bg-[#E6F0FF] hover:border-[#1F4AA8] transition-all group"
            >
              <div className="p-2 bg-[#1F4AA8] rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#1F4AA8] text-sm">
                  {language === 'vi' ? 'Duyệt thư viện case' : 'Browse case library'}
                </div>
                <div className="text-xs text-[#737373">
                  {language === 'vi' ? 'Khám phá các case studies' : 'Explore case studies'}
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/case-competition')}
              className="flex items-center space-x-3 p-4 bg-[#F8F9FB] border border-[#E6E9EF] rounded-xl hover:bg-[#E6F0FF] hover:border-[#1F4AA8] transition-all group"
            >
              <div className="p-2 bg-[#1F4AA8] rounded-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-[#1F4AA8] text-sm">
                  {language === 'vi' ? 'Đánh giá chẩn đoán' : 'Start diagnostic assessment'}
                </div>
                <div className="text-xs text-[#737373]">
                  {language === 'vi' ? 'Kiểm tra trình độ hiện tại' : 'Check your current level'}
                </div>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeDashboard;

