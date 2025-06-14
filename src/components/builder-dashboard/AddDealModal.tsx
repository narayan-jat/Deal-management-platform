import { useState } from "react";

type AddDealModalProps = {
  columnKey: string;
  onClose: () => void;
  onAdd: (deal: {
    company: string;
    type: string;
    amount: string;
    contact: string;
    status: string;
  }) => void;
};

export default function AddDealModal({ columnKey, onClose, onAdd }: AddDealModalProps) {
  const [formData, setFormData] = useState({
    company: "",
    type: "",
    amount: "",
    contact: "",
    status: columnKey,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Add it here

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.amount || !formData.contact || !formData.type) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    onAdd({ ...formData, status: columnKey });
    setFormData({ company: "", type: "", amount: "", contact: "", status: columnKey });
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add New Deal to {columnKey}</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="company"
            placeholder="Company"
            className="w-full border px-3 py-2 rounded"
            value={formData.company}
            onChange={handleChange}
          />
          <input
            name="type"
            placeholder="Type"
            className="w-full border px-3 py-2 rounded"
            value={formData.type}
            onChange={handleChange}
          />
          <input
            name="amount"
            placeholder="Amount"
            className="w-full border px-3 py-2 rounded"
            value={formData.amount}
            onChange={handleChange}
          />
          <input
            name="contact"
            placeholder="Contact"
            className="w-full border px-3 py-2 rounded"
            value={formData.contact}
            onChange={handleChange}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700"
            >
              Add Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
