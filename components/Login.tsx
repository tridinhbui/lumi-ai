import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import BizCaseLogo from './BizCaseLogo';
import { useLanguage } from '../contexts/LanguageContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );
        const userData = await userInfoResponse.json();
        
        login({
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        });

        // Navigate to home
        navigate('/home');
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    },
    onError: () => {
      console.error('Login failed');
      alert('Đăng nhập thất bại. Vui lòng thử lại.');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-10">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <BizCaseLogo size="lg" showText={true} />
            </div>
            <p className="text-neutral-600 text-sm mb-6">Lumi - AI Assistant of BizCase Lab</p>
            
            {/* Language Toggle */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                {language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-medium py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.99 7.68 1.84 8.32 1.84 9s.15 1.32.34 1.93l2.5-1.93 1.16-.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Đăng nhập với Google</span>
          </button>

          {/* Features */}
          <div className="space-y-3 mt-8 pt-6 border-t border-neutral-200">
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <Sparkles className="w-4 h-4 text-neutral-700" />
              <span>Case Competition Analysis</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <Sparkles className="w-4 h-4 text-neutral-700" />
              <span>PDF & Document Processing</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <Sparkles className="w-4 h-4 text-neutral-700" />
              <span>Multi-thread Chat Interface</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
