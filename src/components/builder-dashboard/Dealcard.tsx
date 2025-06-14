type DealCardProps = {
  id: string;
  company: string;
  type: string;
  amount: string;
  status: string;
  contact: string;
};

export default function DealCard({
  company,
  type,
  amount,
  status,
  contact,
}: DealCardProps) {
  return (
    <div className="block bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition p-4 space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-gray-900">{company}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          {status}
        </span>
      </div>
      <div className="text-sm bg-gray-100 inline-block px-2 py-1 rounded text-gray-600">
        {type}
      </div>
      <div className="text-lg font-bold text-gray-900">{amount}</div>
      <div className="text-xs text-gray-500">Next meeting —</div>
      <div className="text-sm text-gray-700">👤 {contact}</div>
    </div>
  );
}
