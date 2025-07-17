import React from "react";
import StatCard from "@/components/builder-dashboard/stat-card";
import Sidebar from "@/components/builder-dashboard/shad-sidebar";
import Header from "@/components/builder-dashboard/header";
import Layout from "@/components/builder-dashboard/layout";

const Dashboard = () => {
  return (
    <Layout>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to the GoDex Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Deals Closed" value={14} subtitle="This quarter" />
            <StatCard title="Pending Approvals" value={5} subtitle="As of today" />
            <StatCard title="Total Volume" value="$8.2M" subtitle="YTD" />
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
