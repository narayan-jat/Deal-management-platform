import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from './AppBar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop: close mobile sidebar, handle collapsed state
        setIsSidebarOpen(false);
      } else {
        // Mobile: ensure sidebar is closed by default
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: toggle collapsed state
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      // Mobile: toggle sidebar visibility
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* AppBar - Full width, always on top */}
      <AppBar 
        onMenuClick={handleMenuClick}
        isSidebarOpen={isSidebarOpen}
      />
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarOpen(false)}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 