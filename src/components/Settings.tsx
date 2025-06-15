import React, { useState } from 'react';
import { Shield, Bell, Palette, Wallet, ChevronRight, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../context/ThemeContext';
interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface ThemeOption {
  name: string;
  value: string;
  primary: string;
  secondary: string;
  background: string;
}

const themes: ThemeOption[] = [
  { 
    name: 'Light',
    value: 'light',
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    background: 'bg-gray-100'
  },
  { 
    name: 'Dark',
    value: 'dark',
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    background: 'bg-gray-950'
  },
  { 
    name: 'Blue',
    value: 'blue',
    primary: 'bg-blue-600',
    secondary: 'bg-blue-500',
    background: 'bg-blue-50'
  },
  { 
    name: 'Neon',
    value: 'neon',
    primary: 'bg-purple-600',
    secondary: 'bg-pink-500',
    background: 'bg-black'
  },
  { 
    name: 'Professional',
    value: 'professional',
    primary: 'bg-slate-800',
    secondary: 'bg-slate-700',
    background: 'bg-slate-100'
  }
];

const SettingsSection = ({ title, icon, children }: SettingsSectionProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState({
    trades: true,
    alerts: true,
    news: false,
    reports: true
  });
  const [smsNotifications, setSmsNotifications] = useState({
    trades: false,
    alerts: true,
    news: false,
    reports: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationDelay, setNotificationDelay] = useState('instant');

  const handleEmailToggle = (type: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSMSToggle = (type: keyof typeof smsNotifications) => {
    setSmsNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <SettingsSection title="Security" icon={<Shield className="w-5 h-5 text-blue-500" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            Change Password <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications" icon={<Bell className="w-5 h-5 text-blue-500" />}>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Delivery Speed</h3>
            <div className="flex gap-3">
              {['instant', '5min', '15min', '30min', '1hour'].map((delay) => (
                <button
                  key={delay}
                  onClick={() => setNotificationDelay(delay)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    notificationDelay === delay
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {delay === 'instant' ? 'Instant' : delay}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Email Notifications</h3>
            <div className="space-y-3">
              {Object.entries(emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{key}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={() => handleEmailToggle(key as keyof typeof emailNotifications)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">SMS Notifications</h3>
            <div className="space-y-3">
              {Object.entries(smsNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{key}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={() => handleSMSToggle(key as keyof typeof smsNotifications)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Theme" icon={<Palette className="w-5 h-5 text-blue-500" />}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => handleThemeChange(themeOption.value)}
              className={clsx(
                'relative p-4 rounded-lg border-2 transition-all bg-theme-primary',
                theme === themeOption.value
                  ? 'border-accent-theme'
                  : 'border-transparent hover:border-theme'
              )}
            >
              <div className="space-y-2 mb-2">
                <div className={clsx('h-3 rounded', themeOption.primary)} />
                <div className={clsx('h-3 rounded', themeOption.secondary)} />
                <div className={clsx('h-3 rounded', themeOption.background)} />
              </div>
              <span className="text-sm font-medium text-theme-primary">{themeOption.name}</span>
              {theme === themeOption.value && (
                <div className="absolute top-2 right-2 accent-theme">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="API Integration" icon={<Wallet className="w-5 h-5 text-blue-500" />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value="••••••••••••••••"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">API Secret</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value="••••••••••••••••"
              readOnly
            />
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            Update API Keys <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}