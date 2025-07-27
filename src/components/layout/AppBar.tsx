import React from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Heart,
  User,
  Lock,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { useSearch } from '@/context/SearchProvider';

interface AppBarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function AppBar({ onMenuClick, isSidebarOpen }: AppBarProps) {
  const { user, signOut } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchActive, 
    setIsSearchActive 
  } = useSearch();

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
          <span className="font-semibold text-gray-900 hidden sm:block">Godex</span>
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
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Plus className="h-5 w-5 text-gray-600" />
          </button>

          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <Lock className="h-3 w-3 text-gray-400 absolute -top-1 -right-1" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">1</span>
            </div>
          </button>

          {/* Logout button */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <button onClick={signOut} className="text-red-500 text-sm font-medium">
                    <LogOut className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile search icon */}
        <button
          onClick={handleSearchToggle}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSearchActive(false)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <User className="h-5 w-5 text-gray-600" />
            <ChevronDown className="h-3 w-3 text-gray-600 lg:hidden" />
          </button>

          {/* Mobile dropdown menu */}
          {false && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 lg:hidden">
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <Plus className="h-4 w-4" />
                  <span>Add New</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 relative">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                  <div className="ml-auto w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                {/* Logout button */}
                {user && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <button onClick={signOut} className="text-red-500 text-sm font-medium">
                          <LogOut className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <button onClick={signOut} className="text-sm font-medium text-red-600 truncate">
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for mobile dropdown */}
      {false && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsSearchActive(false)}
        />
      )}
    </header>
  );
} 