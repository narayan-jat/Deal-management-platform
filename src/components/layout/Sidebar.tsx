import React, { useState } from 'react';
import {  Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  BarChart3,
  Users,
  ChevronDown,
  ChevronRight,
  Bell,
  Settings,
  DollarSign,
  Mail,
  Phone,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Deals', href: '/deals', icon: <DollarSign className="h-4 w-4" /> },
  { label: 'Messages', href: '/messages', icon: <Mail className="h-4 w-4" /> },
  { label: 'Notifications', href: '/notifications', icon: <Bell className="h-4 w-4" /> },
  { 
    label: 'Settings', 
    href: '/settings', 
    icon: <Settings className="h-4 w-4" />,
    children: []
  }
];

export default function Sidebar({ isOpen, isCollapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['investors']);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isItemExpanded = (label: string) => expandedItems.includes(label);

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = isItemExpanded(item.label.toLowerCase());

    return (
      <div key={item.href}>
        <Link
          to={item.href}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            isActive
              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          } ${level > 0 ? 'ml-4' : ''} ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
        >
          {item.icon}
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleExpanded(item.label.toLowerCase());
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
            </>
          )}
        </Link>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsed ? 'w-20' : 'w-64'
        } flex flex-col h-full lg:h-full top-16 lg:top-0 left-0`}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Logo */}
            {!isCollapsed && (
              <div className="flex items-center gap-2 mb-6">
                <span className="font-semibold text-gray-900">Godex</span>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              {navigationItems.map(item => renderNavItem(item))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
} 