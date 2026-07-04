import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo_sabir.png"; 
import avatar from "../../../assets/images/avatar.png";
import logoutIcon from "../../../assets/icons/btn_logout.png"; 

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleChangePassword = () => {
    console.log("Change password clicked");
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    console.log("User logged out");
    setIsDropdownOpen(false);
    // Add your logout logic here
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isDashboard = location.pathname === "/";

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-primary border-b border-grayColorOne">
      
      {/* Left - Logo and Company Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img 
          src={logo} 
          alt="Sabirs Logo" 
          className="w-14 h-14 object-contain rounded-md flex-shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-base font-semibold font-sans text-secondary truncate">
            Sabir's Poultry (Pvt.) Ltd.
          </h1>
          <p className="text-sm font-semibold font-inter text-blueColor">
            Meta ERP
          </p>
        </div>
      </div>

      {/* Center - Welcome Text (only on dashboard) */}
      {isDashboard && (
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <h2 className="text-xl font-bold font-poppins bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent whitespace-nowrap">
            Welcome Back!
          </h2>
        </div>
      )}

      {/* Right - User Info and Logout */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* User Avatar and Name */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-3 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img 
              src={avatar} 
              alt="Profile Avatar" 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-blue-400 transition-colors"
            />
            <span className="text-sm font-semibold font-sans text-secondary hidden sm:inline-block">
              Admin
            </span>
            {/* Dropdown arrow icon */}
            <svg 
              className={`w-4 h-4 text-secondary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-primary rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in-up">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold font-sans text-secondary break-words">
                    Admin
                  </p>
                  <p className="text-redColor font-[500] text-sm mt-1">
                    Currently Login
                  </p>
                </div>
              </div>
              
              {/* Menu Items */}
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2 text-left text-sm text-secondary font-poppins font-[500] hover:bg-gray-50 transition-colors font-inter flex items-center gap-2"
              >
                {/* Key Icon */}
                <svg 
                  className="w-5 h-5 text-yellow-500 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="flex-1 text-left">Change Password</span>
              </button>

              {/* Logout Button inside Dropdown */}
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 text-left text-sm text-secondary font-poppins font-[500] hover:bg-gray-50 transition-colors font-inter flex items-center gap-2 border-t border-gray-100 mt-1"
              >
                <img 
                  src={logoutIcon} 
                  alt="Logout" 
                  className="w-5 h-5 object-contain"
                />
                <span className="flex-1 text-left">Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Header;