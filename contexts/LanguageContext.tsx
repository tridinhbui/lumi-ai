import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Common
    'welcome': 'Chào mừng trở lại',
    'home': 'Trang chủ',
    'dashboard': 'Bảng điều khiển',
    'chat': 'Trò chuyện',
    'cases': 'Case Library',
    'settings': 'Cài đặt',
    'logout': 'Đăng xuất',
    
    // Homepage
    'welcome_back': 'Chào mừng trở lại',
    'strategic_ai': 'Trợ lý AI chiến lược của bạn',
    'active_threads': 'Thread đang hoạt động',
    'cases_solved': 'Case đã giải',
    'avg_score': 'Điểm trung bình',
    'study_hours': 'Giờ học',
    'start_new_chat': 'Bắt đầu chat mới',
    'start_new_chat_desc': 'Bắt đầu cuộc trò chuyện với Lumi',
    'learning_dashboard': 'Bảng điều khiển học tập',
    'learning_dashboard_desc': 'Theo dõi tiến độ và insights',
    'case_library': 'Thư viện Case',
    'case_library_desc': 'Khám phá các case thực hành',
    'achievements': 'Thành tựu',
    'recent_activity': 'Hoạt động gần đây',
    'case_competition_thread': 'Thread Case Competition',
    'last_active': 'Hoạt động lần cuối',
    'hours_ago': 'giờ trước',
    'completed': 'Đã hoàn thành',
    'yesterday': 'Hôm qua',
    'score_improved': 'Điểm số tăng',
    'this_week': 'Tuần này',
    
    // About
    'about_title': 'Giới thiệu BizCase Lab – From Cases to Career Growth',
    'about_p1': 'BizCase Lab được tạo ra dành cho những bạn trẻ muốn rèn luyện tư duy kinh doanh, nâng cao khả năng giải case và xây dựng lợi thế cạnh tranh trong các lĩnh vực như consulting, finance, business analysis và corporate strategy.',
    'about_p2': 'Đây là cộng đồng chia sẻ kiến thức thực chiến từ các Case Competitions quốc tế cùng những tư duy chiến lược có thể áp dụng ngay vào học tập và công việc.',
    'about_p3': 'Chúng tôi tập trung vào việc hệ thống hóa cách phân tích thị trường, tư duy chiến lược, problem solving, financial modeling và cách các đội thi mạnh giải các bài toán kinh doanh phức tạp.',
    'about_p4': 'Tất cả nội dung được trình bày rõ ràng, dễ hiểu và phù hợp cho cả người mới bắt đầu lẫn những bạn đã có nền tảng.',
    'about_p5': 'BizCase Lab tin rằng giải case không chỉ là kỹ năng phục vụ cuộc thi, mà còn là nền tảng để rèn luyện khả năng suy nghĩ sâu, phân tích sắc và ra quyết định chính xác.',
    'about_p6': 'Đây là những năng lực mà các nhà tuyển dụng hàng đầu trong consulting, investment banking, private equity hay corporate strategy luôn tìm kiếm.',
    'about_p7': 'Nếu bạn muốn nâng cấp tư duy, phát triển năng lực phân tích và chuẩn bị cho một con đường sự nghiệp chuyên nghiệp hơn, BizCase Lab là điểm khởi đầu phù hợp dành cho bạn.',
  },
  en: {
    // Common
    'welcome': 'Welcome back',
    'home': 'Home',
    'dashboard': 'Dashboard',
    'chat': 'Chat',
    'cases': 'Case Library',
    'settings': 'Settings',
    'logout': 'Logout',
    
    // Homepage
    'welcome_back': 'Welcome back',
    'strategic_ai': 'Your strategic AI assistant',
    'active_threads': 'Active Threads',
    'cases_solved': 'Cases Solved',
    'avg_score': 'Avg Score',
    'study_hours': 'Study Hours',
    'start_new_chat': 'Start New Chat',
    'start_new_chat_desc': 'Begin a conversation with Lumi',
    'learning_dashboard': 'Learning Dashboard',
    'learning_dashboard_desc': 'Track your progress and insights',
    'case_library': 'Case Library',
    'case_library_desc': 'Explore practice cases',
    'achievements': 'Achievements',
    'recent_activity': 'Recent Activity',
    'case_competition_thread': 'Case Competition Thread',
    'last_active': 'Last active',
    'hours_ago': 'hours ago',
    'completed': 'Completed',
    'yesterday': 'Yesterday',
    'score_improved': 'Score improved by',
    'this_week': 'This week',
    
    // About
    'about_title': 'Introducing BizCase Lab – From Cases to Career Growth',
    'about_p1': 'BizCase Lab is designed for students and young professionals who want to strengthen their business thinking, sharpen their case solving abilities and build a competitive edge in consulting, finance, business analysis and corporate strategy.',
    'about_p2': 'This community shares practical insights from global Case Competitions along with strategic mindsets that can be applied directly to academic and professional settings.',
    'about_p3': 'We focus on structured approaches to market analysis, strategic thinking, problem solving, financial modeling and how top-performing teams tackle complex business cases.',
    'about_p4': 'All content is crafted to be clear, accessible and valuable for both beginners and experienced learners.',
    'about_p5': 'At BizCase Lab, we believe case solving is more than a competition skill. It is a foundation that helps you think deeper, analyze better and make smarter decisions.',
    'about_p6': 'These are the core capabilities that top employers in consulting, investment banking, private equity and corporate strategy consistently look for.',
    'about_p7': 'If you want to elevate your strategic mindset, strengthen your analytical skills and prepare for a more professional career journey, BizCase Lab is the right place to begin.',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

