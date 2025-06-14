import {
  Home,
  BarChart,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Analytics", href: "/analytics", icon: <BarChart className="h-4 w-4" /> },
  { label: "Contact", href: "/contact", icon: <Mail className="h-4 w-4" /> },
  { label: "Messages", href: "/messages", icon: <MessageSquare className="h-4 w-4" /> },
  { label: "Notifications", href: "/notifications", icon: <Bell className="h-4 w-4" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`border-r bg-white h-screen transition-all duration-300 flex flex-col ${
        collapsed ? "w-16 items-center" : "w-64"
      } px-3 py-4`}
    >
      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-gray-500 hover:text-gray-800 mb-4 self-start"
        title="Toggle Sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Static Logo */}
      {!collapsed && (
        <div className="text-lg font-bold text-gray-900 px-1 mb-4 select-none">
          GODEX
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
