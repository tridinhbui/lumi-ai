import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, BarChart3, BookOpen, 
  ArrowRight, Sparkles, Zap, Award, Clock, TrendingUp, Target,
  Globe, ChevronDown, Users, GraduationCap, Briefcase, Lightbulb,
  CheckCircle2, Star, Calendar, User, ExternalLink, Play, Quote
} from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import FloatingChat from './FloatingChat';
import BizCaseLogo from './BizCaseLogo';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: language === 'vi' 
        ? '5 Framework Phân Tích Case Competition Hiệu Quả Nhất 2024'
        : 'Top 5 Case Competition Analysis Frameworks for 2024',
      excerpt: language === 'vi'
        ? 'Khám phá các framework được sử dụng bởi các đội thi hàng đầu trong các cuộc thi case quốc tế...'
        : 'Discover the frameworks used by top teams in international case competitions...',
      author: 'BizCase Lab Team',
      date: '2024-01-15',
      readTime: '5 min',
      category: language === 'vi' ? 'Phân Tích' : 'Analysis',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    },
    {
      id: 2,
      title: language === 'vi'
        ? 'Cách Xây Dựng Tư Duy Chiến Lược Từ Case Solving'
        : 'How to Build Strategic Thinking Through Case Solving',
      excerpt: language === 'vi'
        ? 'Case solving không chỉ là kỹ năng thi cử, mà còn là nền tảng cho tư duy chiến lược trong công việc...'
        : 'Case solving is not just a competition skill, but a foundation for strategic thinking at work...',
      author: 'BizCase Lab Team',
      date: '2024-01-10',
      readTime: '7 min',
      category: language === 'vi' ? 'Tư Duy' : 'Thinking',
      thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop',
    },
    {
      id: 3,
      title: language === 'vi'
        ? 'Market Entry Strategy: Case Study Thực Tế Từ McKinsey'
        : 'Market Entry Strategy: Real Case Study from McKinsey',
      excerpt: language === 'vi'
        ? 'Phân tích chi tiết một case study thực tế về market entry strategy từ các dự án consulting...'
        : 'Detailed analysis of a real market entry strategy case study from consulting projects...',
      author: 'BizCase Lab Team',
      date: '2024-01-05',
      readTime: '10 min',
      category: language === 'vi' ? 'Case Study' : 'Case Study',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    },
  ];

  // Features data
  const features = [
    {
      icon: MessageSquare,
      title: language === 'vi' ? 'Lumi AI Assistant' : 'Lumi AI Assistant',
      description: language === 'vi'
        ? 'Chatbot thông minh hỗ trợ giải case với tư duy CEO và consulting, phân tích structured solution'
        : 'Intelligent chatbot supporting case solving with CEO and consulting mindset, structured solution analysis',
    },
    {
      icon: BarChart3,
      title: language === 'vi' ? 'Analysis Dashboard' : 'Analysis Dashboard',
      description: language === 'vi'
        ? 'Theo dõi tiến độ giải case, visualize data, track insights và recommendations theo thời gian thực'
        : 'Track case-solving progress, visualize data, track insights and recommendations in real-time',
    },
    {
      icon: BookOpen,
      title: language === 'vi' ? 'Case Library' : 'Case Library',
      description: language === 'vi'
        ? 'Thư viện case studies phong phú từ các cuộc thi quốc tế, có framework và solution mẫu'
        : 'Rich library of case studies from international competitions with frameworks and sample solutions',
    },
    {
      icon: GraduationCap,
      title: language === 'vi' ? 'Learning Path' : 'Learning Path',
      description: language === 'vi'
        ? 'Lộ trình học tập có cấu trúc từ cơ bản đến nâng cao, phù hợp với mọi trình độ'
        : 'Structured learning path from basic to advanced, suitable for all levels',
    },
  ];

  // Services data
  const services = [
    {
      icon: Target,
      title: language === 'vi' ? 'Case Competition Training' : 'Case Competition Training',
      description: language === 'vi'
        ? 'Luyện tập giải case với format chuẩn competition, nhận feedback chi tiết và cải thiện điểm số'
        : 'Practice solving cases with standard competition format, receive detailed feedback and improve scores',
    },
    {
      icon: Briefcase,
      title: language === 'vi' ? 'Career Preparation' : 'Career Preparation',
      description: language === 'vi'
        ? 'Chuẩn bị cho các vị trí consulting, finance, strategy với tư duy và kỹ năng từ case solving'
        : 'Prepare for consulting, finance, strategy positions with mindset and skills from case solving',
    },
    {
      icon: Lightbulb,
      title: language === 'vi' ? 'Strategic Thinking' : 'Strategic Thinking',
      description: language === 'vi'
        ? 'Phát triển tư duy chiến lược, problem-solving skills và analytical mindset cho công việc'
        : 'Develop strategic thinking, problem-solving skills and analytical mindset for work',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Nguyễn Văn A',
      role: language === 'vi' ? 'Sinh viên, Đại học Kinh tế' : 'Student, Economics University',
      content: language === 'vi'
        ? 'BizCase Lab giúp tôi cải thiện đáng kể khả năng giải case. Lumi rất thông minh và hỗ trợ rất nhiều trong việc phân tích structured solution.'
        : 'BizCase Lab significantly improved my case-solving ability. Lumi is very intelligent and provides great support in analyzing structured solutions.',
      rating: 5,
    },
    {
      name: 'Trần Thị B',
      role: language === 'vi' ? 'Young Professional, Consulting' : 'Young Professional, Consulting',
      content: language === 'vi'
        ? 'Dashboard analysis rất hữu ích để track progress. Tôi đã áp dụng nhiều framework từ Case Library vào công việc thực tế.'
        : 'The analysis dashboard is very useful for tracking progress. I\'ve applied many frameworks from the Case Library to real work.',
      rating: 5,
    },
    {
      name: 'Lê Văn C',
      role: language === 'vi' ? 'Case Competition Winner' : 'Case Competition Winner',
      content: language === 'vi'
        ? 'Nhờ BizCase Lab mà tôi đã đạt giải nhất cuộc thi case quốc tế. Learning path rất rõ ràng và dễ follow.'
        : 'Thanks to BizCase Lab, I won first place in an international case competition. The learning path is very clear and easy to follow.',
      rating: 5,
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
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#about" className="text-[#2E2E2E] hover:text-[#1F4AA8] transition-colors font-medium">
                {language === 'vi' ? 'Giới Thiệu' : 'About'}
              </a>
              <a href="#features" className="text-[#2E2E2E] hover:text-[#1F4AA8] transition-colors font-medium">
                {language === 'vi' ? 'Tính Năng' : 'Features'}
              </a>
              <a href="#services" className="text-[#2E2E2E] hover:text-[#1F4AA8] transition-colors font-medium">
                {language === 'vi' ? 'Dịch Vụ' : 'Services'}
              </a>
              <a href="#blog" className="text-[#2E2E2E] hover:text-[#1F4AA8] transition-colors font-medium">
                {language === 'vi' ? 'Blog' : 'Blog'}
              </a>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-[#1F4AA8] text-white rounded-xl hover:bg-[#153A73] transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                {language === 'vi' ? 'Bắt Đầu' : 'Get Started'}
              </button>
            </nav>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1F4AA8] via-[#153A73] to-[#1F4AA8] text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#4C86FF] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0057E7] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'vi' ? 'From Cases to Career Growth' : 'From Cases to Career Growth'}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {language === 'vi' 
                  ? 'BizCase Lab - Nền Tảng Giải Case Hàng Đầu'
                  : 'BizCase Lab - Leading Case Solving Platform'}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                {language === 'vi'
                  ? 'Rèn luyện tư duy kinh doanh, nâng cao khả năng giải case và xây dựng lợi thế cạnh tranh trong consulting, finance và corporate strategy.'
                  : 'Strengthen business thinking, sharpen case-solving abilities and build competitive edge in consulting, finance and corporate strategy.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white text-[#1F4AA8] rounded-xl font-semibold hover:bg-[#F8F9FB] transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>{language === 'vi' ? 'Bắt Đầu Ngay' : 'Get Started'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{language === 'vi' ? 'Xem Demo' : 'Watch Demo'}</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F4AA8] mb-4">
              {language === 'vi' ? 'Về BizCase Lab' : 'About BizCase Lab'}
            </h2>
            <p className="text-lg text-[#737373] max-w-3xl mx-auto">
              {language === 'vi'
                ? 'BizCase Lab được tạo ra dành cho những bạn trẻ muốn rèn luyện tư duy kinh doanh, nâng cao khả năng giải case và xây dựng lợi thế cạnh tranh.'
                : 'BizCase Lab is designed for students and young professionals who want to strengthen business thinking and sharpen case-solving abilities.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '10K+', label: language === 'vi' ? 'Người Dùng' : 'Users' },
              { icon: BookOpen, value: '500+', label: language === 'vi' ? 'Case Studies' : 'Case Studies' },
              { icon: Award, value: '95%', label: language === 'vi' ? 'Tỷ Lệ Thành Công' : 'Success Rate' },
              { icon: TrendingUp, value: '4.9/5', label: language === 'vi' ? 'Đánh Giá' : 'Rating' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-[#F8F9FB] rounded-2xl border border-[#E6E9EF]">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E6F0FF] rounded-xl mb-4">
                  <stat.icon className="w-8 h-8 text-[#1F4AA8]" />
                </div>
                <div className="text-3xl font-bold text-[#1F4AA8] mb-2">{stat.value}</div>
                <div className="text-sm text-[#737373]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F4AA8] mb-4">
              {language === 'vi' ? 'Tính Năng Nổi Bật' : 'Key Features'}
            </h2>
            <p className="text-lg text-[#737373] max-w-3xl mx-auto">
              {language === 'vi'
                ? 'Công cụ và tính năng mạnh mẽ để hỗ trợ bạn giải case hiệu quả'
                : 'Powerful tools and features to help you solve cases effectively'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-[#E6E9EF] rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => {
                  if (feature.title.includes('Lumi')) navigate('/case-competition');
                  else if (feature.title.includes('Dashboard')) navigate('/dashboard');
                  else if (feature.title.includes('Library')) navigate('/case-competition');
                }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#E6F0FF] rounded-xl mb-4 group-hover:bg-[#1F4AA8] transition-colors">
                  <feature.icon className="w-7 h-7 text-[#1F4AA8] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F4AA8] mb-3">{feature.title}</h3>
                <p className="text-[#737373] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F4AA8] mb-4">
              {language === 'vi' ? 'Dịch Vụ Của Chúng Tôi' : 'Our Services'}
            </h2>
            <p className="text-lg text-[#737373] max-w-3xl mx-auto">
              {language === 'vi'
                ? 'Hỗ trợ toàn diện cho hành trình phát triển tư duy kinh doanh của bạn'
                : 'Comprehensive support for your business thinking development journey'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-[#F8F9FB] border border-[#E6E9EF] rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1F4AA8] rounded-xl mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1F4AA8] mb-4">{service.title}</h3>
                <p className="text-[#737373] leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-[#1F4AA8] mb-4">
                {language === 'vi' ? 'Blog & Insights' : 'Blog & Insights'}
              </h2>
              <p className="text-lg text-[#737373]">
                {language === 'vi'
                  ? 'Kiến thức và insights mới nhất về case solving và tư duy chiến lược'
                  : 'Latest knowledge and insights on case solving and strategic thinking'}
              </p>
            </div>
            <button
              onClick={() => navigate('/case-competition')}
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-[#1F4AA8] text-white rounded-xl hover:bg-[#153A73] transition-all font-medium"
            >
              <span>{language === 'vi' ? 'Xem Tất Cả' : 'View All'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-[#E6E9EF] rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#1F4AA8] to-[#153A73] overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-[#1F4AA8] px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs text-[#737373] mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1F4AA8] mb-3 group-hover:text-[#153A73] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#737373] mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-[#737373]" />
                      <span className="text-sm text-[#737373]">{post.author}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#1F4AA8] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F4AA8] mb-4">
              {language === 'vi' ? 'Người Dùng Nói Gì' : 'What Users Say'}
            </h2>
            <p className="text-lg text-[#737373] max-w-3xl mx-auto">
              {language === 'vi'
                ? 'Phản hồi từ cộng đồng BizCase Lab'
                : 'Feedback from the BizCase Lab community'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#F8F9FB] border border-[#E6E9EF] rounded-2xl p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#1F4AA8] text-[#1F4AA8]" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-[#1F4AA8] mb-4 opacity-50" />
                <p className="text-[#2E2E2E] mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-[#1F4AA8]">{testimonial.name}</div>
                  <div className="text-sm text-[#737373]">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1F4AA8] to-[#153A73] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {language === 'vi'
              ? 'Sẵn Sàng Bắt Đầu Hành Trình Của Bạn?'
              : 'Ready to Start Your Journey?'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === 'vi'
              ? 'Tham gia cộng đồng BizCase Lab ngay hôm nay và nâng cao tư duy kinh doanh của bạn'
              : 'Join the BizCase Lab community today and elevate your business thinking'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-[#1F4AA8] rounded-xl font-semibold hover:bg-[#F8F9FB] transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>{language === 'vi' ? 'Bắt Đầu Miễn Phí' : 'Start Free'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              {language === 'vi' ? 'Xem Demo' : 'View Demo'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#153A73] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <BizCaseLogo size="md" showText={true} />
              <p className="text-white/70 mt-4 text-sm">
                {language === 'vi'
                  ? 'Nền tảng giải case hàng đầu cho sinh viên và young professionals'
                  : 'Leading case-solving platform for students and young professionals'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{language === 'vi' ? 'Sản Phẩm' : 'Product'}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#features" className="hover:text-white transition-colors">{language === 'vi' ? 'Tính Năng' : 'Features'}</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">{language === 'vi' ? 'Dịch Vụ' : 'Services'}</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">{language === 'vi' ? 'Blog' : 'Blog'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{language === 'vi' ? 'Công Ty' : 'Company'}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#about" className="hover:text-white transition-colors">{language === 'vi' ? 'Về Chúng Tôi' : 'About Us'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{language === 'vi' ? 'Liên Hệ' : 'Contact'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{language === 'vi' ? 'Chính Sách' : 'Privacy'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{language === 'vi' ? 'Kết Nối' : 'Connect'}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2024 BizCase Lab. {language === 'vi' ? 'Tất cả quyền được bảo lưu.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};

export default HomePage;
