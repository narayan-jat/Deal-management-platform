import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-100 border-r p-4">
      <nav>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm text-gray-700 hover:underline">Dashboard</a></li>
          <li><a href="#" className="text-sm text-gray-700 hover:underline">Deals</a></li>
          <li><a href="#" className="text-sm text-gray-700 hover:underline">Documents</a></li>
        </ul>
      </nav>
    </aside>
  );
}
