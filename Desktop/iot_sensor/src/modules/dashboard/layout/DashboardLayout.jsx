import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';  
import { getMenuItems } from '../../../config/routes';
import bgImage from '../../../assets/png/bg_image_one.png';
import logo from '../../../assets/png/logo_1.png';
import dashboardIcon from '../../../assets/png/dashboard.png';
import liveReportIcon from '../../../assets/png/live_report.png';
import historyIcon from '../../../assets/png/history.png';
import deviceManagementIcon from '../../../assets/png/device_management.png';
import userManagementIcon from '../../../assets/png/user_management.png';
import logoutIcon from '../../../assets/png/logout.png';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Get menu items based on user role
  const userRole = user?.role_name || 'VIEW_ONLY';
  const menuItems = getMenuItems(userRole);

  // Check if current path is active
  const isRouteActive = (path) => {
    if (path === '/device-management') {
      return location.pathname.startsWith('/device-management');
    }
    if (path === '/user-management') {
      return location.pathname.startsWith('/user-management');
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handlePopState = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // ✅ FIXED: Proper logout using navigate
  const handleLogout = () => {
    logout(); // This clears auth state and localStorage
    navigate('/login'); // Navigate to login page
  };

  // Get icon for menu item
  const getIcon = (id) => {
    const icons = {
      'dashboard': dashboardIcon,
      'live-report': liveReportIcon,
      'historical': historyIcon,
      'device-management': deviceManagementIcon,
      'user-management': userManagementIcon
    };
    return icons[id] || dashboardIcon;
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Sidebar with Gradient Background */}
      <aside className={`
        lg:relative lg:flex lg:flex-col lg:shrink-0
        fixed inset-y-0 left-0 z-40
        w-48 sm:w-52 md:w-56 lg:w-52 xl:w-56
        bg-gradient-to-b from-[#0b1a30] to-[#1a3a6b]
        text-white
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="border-b border-white/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <img 
                src={logo} 
                alt="Temperature Monitoring Dashboard" 
                className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Navigation with Role-based Menu - Only Main Pages */}
        <nav className="flex-1 overflow-y-auto py-2 sm:py-3">
          <ul className="space-y-0.5">
            {menuItems.map((item) => (
              <li 
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer text-[10px] sm:text-xs transition-colors mx-1 sm:mx-2 ${
                  isRouteActive(item.path)
                    ? 'bg-white/20 text-white' 
                    : 'text-white hover:bg-white/10 hover:text-white'
                }`}
              >
                <img 
                  src={getIcon(item.id)} 
                  alt={item.label} 
                  className="h-3 w-3 sm:h-4 sm:w-4 object-contain"
                />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out Button */}
        <div className="p-3 sm:p-4 border-t border-white/30 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 sm:gap-3 w-full text-left text-white hover:text-white text-[10px] sm:text-xs py-1.5 transition-colors hover:bg-white/10 px-2 sm:px-3"
          >
            <img 
              src={logoutIcon} 
              alt="Sign Out" 
              className="h-3 w-3 sm:h-4 sm:w-4 object-contain"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content with Background Image */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm flex items-center justify-center flex-shrink-0 border-b border-gray-200/50 relative">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-lg sm:text-xl hover:bg-gray-100 p-1 rounded transition-colors absolute left-2 sm:left-4"
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <h1 className="text-xs sm:text-sm md:text-lg font-semibold text-black text-center px-8 sm:px-0" style={{ fontFamily: 'Jura, sans-serif' }}>
            Temperature Monitoring Dashboard
          </h1>
        </header>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;