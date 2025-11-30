import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Globe, Moon, Sun, Shield, FileText, HelpCircle, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import BizCaseLogo from './BizCaseLogo';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b-2 border-[#1e3a8a] shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1e3a8a]" />
              </button>
              <BizCaseLogo size="md" showText={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-8">Cài đặt</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#1e3a8a] rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Thông tin tài khoản</h2>
              <p className="text-sm text-gray-500">Quản lý thông tin cá nhân của bạn</p>
            </div>
          </div>
          
          {user && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full border-2 border-[#1e3a8a]" />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#1e3a8a] rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Ngôn ngữ</h2>
              <p className="text-sm text-gray-500">Chọn ngôn ngữ hiển thị</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setLanguage('vi')}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                language === 'vi'
                  ? 'border-[#1e3a8a] bg-blue-50'
                  : 'border-gray-200 hover:border-[#1e3a8a]/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🇻🇳</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Tiếng Việt</p>
                  <p className="text-sm text-gray-500">Vietnamese</p>
                </div>
              </div>
              {language === 'vi' && (
                <div className="w-5 h-5 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
            
            <button
              onClick={() => setLanguage('en')}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                language === 'en'
                  ? 'border-[#1e3a8a] bg-blue-50'
                  : 'border-gray-200 hover:border-[#1e3a8a]/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🇬🇧</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">English</p>
                  <p className="text-sm text-gray-500">Tiếng Anh</p>
                </div>
              </div>
              {language === 'en' && (
                <div className="w-5 h-5 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#1e3a8a] rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Thông báo</h2>
              <p className="text-sm text-gray-500">Quản lý thông báo và cập nhật</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Thông báo trong ứng dụng</p>
                <p className="text-sm text-gray-500">Nhận thông báo về hoạt động và cập nhật</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Cập nhật qua email</p>
                <p className="text-sm text-gray-500">Nhận báo cáo tiến độ hàng tuần</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  emailUpdates ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    emailUpdates ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#1e3a8a] rounded-xl">
              {darkMode ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Giao diện</h2>
              <p className="text-sm text-gray-500">Tùy chỉnh giao diện ứng dụng</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Chế độ tối</p>
              <p className="text-sm text-gray-500">Chuyển sang giao diện tối (sắp có)</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-[#1e3a8a]' : 'bg-gray-300'
              }`}
              disabled
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#1e3a8a] rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Bảo mật & Quyền riêng tư</h2>
              <p className="text-sm text-gray-500">Quản lý bảo mật tài khoản</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-[#1e3a8a] transition-colors">
              <p className="font-semibold text-gray-900">Đổi mật khẩu</p>
              <p className="text-sm text-gray-500">Cập nhật mật khẩu tài khoản của bạn</p>
            </button>
            <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-[#1e3a8a] transition-colors">
              <p className="font-semibold text-gray-900">Xóa dữ liệu</p>
              <p className="text-sm text-gray-500">Xóa tất cả dữ liệu và lịch sử chat</p>
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#1e3a8a] p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#1e3a8a] rounded-xl">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Trợ giúp & Hỗ trợ</h2>
              <p className="text-sm text-gray-500">Tài liệu và liên hệ hỗ trợ</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-[#1e3a8a] transition-colors flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Tài liệu hướng dẫn</p>
                <p className="text-sm text-gray-500">Xem hướng dẫn sử dụng BizCase Lab</p>
              </div>
              <FileText className="w-5 h-5 text-[#1e3a8a]" />
            </button>
            <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-[#1e3a8a] transition-colors flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Liên hệ hỗ trợ</p>
                <p className="text-sm text-gray-500">Gửi phản hồi hoặc báo lỗi</p>
              </div>
              <Mail className="w-5 h-5 text-[#1e3a8a]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

