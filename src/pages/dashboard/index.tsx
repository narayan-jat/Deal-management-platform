import KanbanBoard from "@/components/builder-dashboard/kanbanBoard";

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">GoDex Deal Pipeline</h1>
      <KanbanBoard />
    </div>
  );
}

