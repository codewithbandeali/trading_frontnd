import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { PerformanceCard } from './components/PerformanceCard';
import { Chart } from './components/Chart';
import { ActiveStrategies } from './components/ActiveStrategies';
import { Settings } from './components/Settings';
import { Alerts } from './components/Alerts';
import { Research } from './components/Research';
import { AIChat } from './components/AIChat';
import { TradingPanel } from './components/TradingPanel';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { useAuth } from './context/AuthContext';

type Page = 'dashboard' | 'trading' | 'strategies' | 'alerts' | 'settings' | 'research' | 'ai-chat';

function LandingPage() {
  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1920")',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
      />

      <div className="fixed top-0 right-0 p-4 z-50 flex items-center gap-2">
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200 transition-colors"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign up for free
        </Link>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen text-white px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            TradePro AI
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8">
            Advanced algorithmic trading platform powered by artificial intelligence
          </p>
          <div className="space-y-4">
            <p className="text-base sm:text-lg text-gray-400">
              ✓ Real-time market analysis
            </p>
            <p className="text-base sm:text-lg text-gray-400">
              ✓ AI-powered trading signals
            </p>
            <p className="text-base sm:text-lg text-gray-400">
              ✓ Advanced portfolio management
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-block mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Trading Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [currentPage, setCurrentPage] = React.useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-6">Dashboard</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <PerformanceCard
                  title="Total Portfolio Value"
                  value="$124,532.89"
                  change={2.3}
                  trend="up"
                />
                <PerformanceCard
                  title="24h Profit/Loss"
                  value="$1,234.56"
                  change={1.2}
                  trend="up"
                />
                <PerformanceCard
                  title="Active Positions"
                  value="8"
                  change={-1}
                  trend="down"
                />
                <PerformanceCard
                  title="Win Rate"
                  value="67.5%"
                  change={0.5}
                  trend="up"
                />
              </div>
            </div>
            <div className="mb-8">
              <Chart />
            </div>
            <div className="mb-8">
              <ActiveStrategies />
            </div>
          </>
        );
      case 'trading':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Chart />
            </div>
            <div>
              <TradingPanel />
            </div>
          </div>
        );
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      case 'research':
        return <Research />;
      case 'ai-chat':
        return <AIChat />;
      default:
        return <div className="p-6">Coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 right-0 p-4 z-40">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <Sidebar 
        onPageChange={setCurrentPage} 
        currentPage={currentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated 
            ? <Navigate to="/dashboard" replace /> 
            : <LandingPage />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated 
            ? <Navigate to="/dashboard" replace /> 
            : <Login />
        }
      />
      <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />
        } />
        <Route path="/forgot-password" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />
        } />
        <Route path="/reset-password" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPassword />
        } />
      
      <Route
        path="/dashboard"
        element={
          isAuthenticated 
            ? <Dashboard /> 
            : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;