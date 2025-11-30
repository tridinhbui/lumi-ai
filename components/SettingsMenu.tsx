import React, { useState, useRef, useEffect } from 'react';
import { Settings, User, LogOut, Moon, Sun, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsMenuProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50 animate-fade-in">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-neutral-200">
            <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
            <p className="text-xs text-neutral-600 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/dashboard');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{t('dashboard')}</span>
            </button>
            <button
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>{t('settings')}</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-neutral-200 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;

