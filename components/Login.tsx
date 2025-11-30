import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, BarChart3 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>('/case-interview');

  // Auto redirect after a short delay (bypass login)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(selectedRoute);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedRoute, navigate]);

  const handleRouteSelect = (route: string) => {
    setSelectedRoute(route);
    navigate(route);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 shadow-xl">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-green-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MediDrone Strategy</h1>
            <p className="text-gray-500 text-sm">Case Interview Platform</p>
          </div>

          {/* Info Message */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              Đăng nhập đã được bỏ qua. Chọn trang bạn muốn truy cập:
            </p>
          </div>

          {/* Route Options */}
          <div className="space-y-3">
            <p className="text-xs text-gray-500 text-center mb-4">
              Chọn trang bạn muốn truy cập sau khi đăng nhập:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleRouteSelect('/case-interview')}
                className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedRoute === '/case-interview'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                }`}
              >
                <Briefcase className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Case Interview</span>
                <span className="text-xs text-gray-500 mt-1">Phỏng vấn</span>
              </button>
              <button
                onClick={() => handleRouteSelect('/analytics')}
                className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedRoute === '/analytics'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Lumi</span>
                <span className="text-xs text-gray-500 mt-1">AI Assistant</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

