// 
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Mail, Shield, Palette, Save, Check } from 'lucide-react';
import API from '../services/api';

interface NotificationPreferences {
  alerts: boolean;
  news: boolean;
  reports: boolean;
}

interface UserSettings {
  email: string;
  emailNotifications: NotificationPreferences;
  theme: string;
  twoFactorEnabled: boolean;
}

const themes = [
  { id: 'dark', name: 'Dark', colors: { primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#3b82f6' } },
  { id: 'midnight', name: 'Midnight Blue', colors: { primary: '#0f172a', secondary: '#1e293b', accent: '#60a5fa' } },
  { id: 'navy', name: 'Navy Blue', colors: { primary: '#0a192f', secondary: '#172a45', accent: '#64ffda' } },
  { id: 'ocean', name: 'Ocean Deep', colors: { primary: '#0d1117', secondary: '#161b22', accent: '#58a6ff' } },
  { id: 'purple', name: 'Purple Night', colors: { primary: '#0e0e23', secondary: '#1a1a3e', accent: '#9333ea' } },
  { id: 'forest', name: 'Forest Dark', colors: { primary: '#0f1419', secondary: '#1c2128', accent: '#10b981' } },
  { id: 'charcoal', name: 'Charcoal', colors: { primary: '#18181b', secondary: '#27272a', accent: '#f59e0b' } },
  { id: 'amoled', name: 'AMOLED Black', colors: { primary: '#000000', secondary: '#0a0a0a', accent: '#ef4444' } }
];

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    emailNotifications: {
      alerts: true,
      news: true,
      reports: true
    },
    theme: 'dark',
    twoFactorEnabled: false
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Apply theme to document
    const theme = themes.find(t => t.id === settings.theme);
    if (theme) {
      document.documentElement.style.setProperty('--primary-bg', theme.colors.primary);
      document.documentElement.style.setProperty('--secondary-bg', theme.colors.secondary);
      document.documentElement.style.setProperty('--accent-color', theme.colors.accent);
    }
  }, [settings.theme]);

  const fetchSettings = async () => {
    try {
      
      const { data } = await API.get<UserSettings>('settings/');
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { status } = await API.put("settings/", settings); // axios resp
     if (status >= 200 && status < 300) {
        setSaved(true);        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleNotificationToggle = (type: keyof NotificationPreferences) => {
    setSettings({
      ...settings,
      emailNotifications: {
        ...settings.emailNotifications,
        [type]: !settings.emailNotifications[type]
      }
    });
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'security' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'appearance' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            Appearance
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Email Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">Alerts</h3>
                    <p className="text-sm text-gray-400">Receive email notifications when your price alerts are triggered</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('alerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications.alerts ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications.alerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">News</h3>
                    <p className="text-sm text-gray-400">Get notified about important market news and updates</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('news')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications.news ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications.news ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">Reports</h3>
                    <p className="text-sm text-gray-400">Receive daily/weekly trading reports and analytics</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('reports')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications.reports ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications.reports ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-400 mt-2">All notifications will be sent to this email address</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Password</h3>
                <p className="text-sm text-gray-400 mb-4">Last changed 30 days ago</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
                  Change Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Theme Selection</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSettings({ ...settings, theme: theme.id })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === theme.id 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{theme.name}</span>
                      {settings.theme === theme.id && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
              saved 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;