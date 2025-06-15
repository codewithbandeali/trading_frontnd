import React from 'react';
import { LayoutDashboard, LineChart, BookOpen, Bell, Settings, Search, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';

type Page = 'dashboard' | 'trading' | 'strategies' | 'alerts' | 'settings' | 'research' | 'ai-chat';

interface SidebarProps {
  onPageChange: (page: Page) => void;
  currentPage: Page;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' as const },
  { icon: LineChart, label: 'Trading', id: 'trading' as const },
  { icon: BookOpen, label: 'Strategies', id: 'strategies' as const },
  { icon: Search, label: 'Research', id: 'research' as const },
  { icon: MessageSquare, label: 'Talk with AI', id: 'ai-chat' as const },
  { icon: Bell, label: 'Alerts', id: 'alerts' as const },
  { icon: Settings, label: 'Settings', id: 'settings' as const },
];

export function Sidebar({ onPageChange, currentPage, isOpen, onClose }: SidebarProps) {
  const handlePageChange = (page: Page) => {
    onPageChange(page);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 mb-8">
          <div className="flex items-center gap-2">
            <LineChart className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">TradePro AI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => handlePageChange(id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm',
                currentPage === id
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}