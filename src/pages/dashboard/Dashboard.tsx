import KanbanBoard from "@/components/builder-dashboard/KanbanBoard";

export default function Dashboard() {
  return (
    <div className="lg:p-6">
      <h1 className="text-2xl font-bold mb-4">GoDex Deal Pipeline</h1>
      <KanbanBoard />
    </div>
  );
}