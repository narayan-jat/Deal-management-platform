import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  User,
  Lock,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { useSearch } from '@/context/SearchProvider';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { BrandWordmark } from '@/components/brand/BrandWordmark';
import { useNotifications } from '@/hooks/useNotifications';

interface AppBarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function AppBar({ onMenuClick, isSidebarOpen }: AppBarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchActive, 
    setIsSearchActive 
  } = useSearch();
  const { unreadCount } = useNotifications();
  
  // Profile dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by the context
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProfileClick = () => {
    setIsSearchActive(false);
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileNavigation = () => {
    setIsProfileDropdownOpen(false);
    navigate(ROUTES.PROFILE);
  };

  const handlePasswordReset = () => {
    setIsProfileDropdownOpen(false);
    navigate(ROUTES.ACCOUNT_CHANGE_PASSWORD);
  };

  const handleCreateDeal = () => {
    setIsSearchActive(false);
    setIsProfileDropdownOpen(false);
    navigate(ROUTES.CREATE_DEAL);
  };

  const handleNotifications = () => {
    setIsProfileDropdownOpen(false);
    navigate(ROUTES.NOTIFICATIONS);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    signOut();
  };

  // Mobile search view
  if (isSearchActive) {
    return (
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:hidden">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for deals"
            className="flex-1 border-none outline-none text-gray-900"
            autoFocus
          />
          <button
            type="button"
            onClick={handleSearchToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </form>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 z-40">
      {/* Left side - Hamburger menu and company logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <BrandWordmark className="!text-base sm:!text-lg" />
        </div>
      </div>

      {/* Center - Search bar (desktop only) */}
      <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for deals"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side - Action icons */}
      <div className="flex items-center gap-2">
        {/* Desktop icons */}
        <div className="hidden lg:flex items-center gap-2">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={handleCreateDeal}
            title="Create new deal"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>

          <button 
            className="p-2 rounded-md hover:bg-gray-100 transition-colors relative" 
            onClick={handleNotifications}
            title="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{unreadCount}</span>
            </div>}
          </button>

          <button 
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile search icon */}
        <button
          onClick={handleSearchToggle}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <User className="h-5 w-5 text-gray-600" />
            <ChevronDown className="h-3 w-3 text-gray-600" />
          </button>

          {/* Dropdown menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                {/* Desktop only items - Profile and Password Reset */}
                <div className="hidden lg:block">
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    onClick={handleProfileNavigation}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    onClick={handlePasswordReset}
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                </div>

                {/* Mobile items - All actions */}
                <div className="lg:hidden">
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    onClick={handleCreateDeal}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Deal</span>
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 relative" 
                    onClick={handleNotifications}
                  >
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                    {unreadCount > 0 && <div className="ml-auto w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{unreadCount}</span>
                    </div>}
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    onClick={handleProfileNavigation}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    onClick={handlePasswordReset}
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
} 