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
    <div className="min-h-screen bg-neutral-50">
      {/* Minimal Header */}
      <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <BizCaseLogo size="md" showText={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-12 tracking-tight">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-neutral-100 rounded-xl">
              <User className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Account Information</h2>
              <p className="text-sm text-neutral-600">Manage your personal information</p>
            </div>
          </div>
          
          {user && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full border-2 border-neutral-200" />
                <div>
                  <p className="font-semibold text-neutral-900">{user.name}</p>
                  <p className="text-sm text-neutral-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Settings */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-neutral-100 rounded-xl">
              <Globe className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Language</h2>
              <p className="text-sm text-neutral-600">Choose display language</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setLanguage('vi')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                language === 'vi'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🇻🇳</span>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">Tiếng Việt</p>
                  <p className="text-sm text-neutral-600">Vietnamese</p>
                </div>
              </div>
              {language === 'vi' && (
                <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
            
            <button
              onClick={() => setLanguage('en')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                language === 'en'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🇬🇧</span>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">English</p>
                  <p className="text-sm text-neutral-600">Tiếng Anh</p>
                </div>
              </div>
              {language === 'en' && (
                <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-neutral-100 rounded-xl">
              <Bell className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Notifications</h2>
              <p className="text-sm text-neutral-600">Manage notifications and updates</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-neutral-900">In-app notifications</p>
                <p className="text-sm text-neutral-600">Receive activity and update notifications</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? 'bg-neutral-900' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-neutral-900">Email updates</p>
                <p className="text-sm text-neutral-600">Receive weekly progress reports</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  emailUpdates ? 'bg-neutral-900' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                    emailUpdates ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-neutral-100 rounded-xl">
              {darkMode ? <Moon className="w-5 h-5 text-neutral-700" /> : <Sun className="w-5 h-5 text-neutral-700" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Appearance</h2>
              <p className="text-sm text-neutral-600">Customize app interface</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-neutral-900">Dark mode</p>
              <p className="text-sm text-neutral-600">Switch to dark interface (coming soon)</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-neutral-900' : 'bg-neutral-300'
              }`}
              disabled
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-neutral-100 rounded-xl">
              <Shield className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Privacy & Security</h2>
              <p className="text-sm text-neutral-600">Manage account security</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all">
              <p className="font-semibold text-neutral-900">Change password</p>
              <p className="text-sm text-neutral-600">Update your account password</p>
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all">
              <p className="font-semibold text-neutral-900">Delete data</p>
              <p className="text-sm text-neutral-600">Delete all data and chat history</p>
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-neutral-100 rounded-xl">
              <HelpCircle className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Help & Support</h2>
              <p className="text-sm text-neutral-600">Documentation and support contact</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all flex items-center justify-between">
              <div>
                <p className="font-semibold text-neutral-900">Documentation</p>
                <p className="text-sm text-neutral-600">View BizCase Lab usage guide</p>
              </div>
              <FileText className="w-5 h-5 text-neutral-600" />
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all flex items-center justify-between">
              <div>
                <p className="font-semibold text-neutral-900">Contact support</p>
                <p className="text-sm text-neutral-600">Send feedback or report issues</p>
              </div>
              <Mail className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

