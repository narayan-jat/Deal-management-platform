import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
