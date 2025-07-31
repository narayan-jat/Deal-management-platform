import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

type AccountType = "lender" | "borrower" | "broker" | "other";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  accountType: AccountType;
  message: string;
}

interface RequestAccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  updateFormField: (field: string, value: string) => void;
  submitForm: () => void;
}

export default function RequestAccessPopup({
  isOpen,
  onClose,
  formData,
  updateFormField,
  submitForm,
}: RequestAccessPopupProps) {
  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-inter font-semibold text-black">
            Request Early Access
          </h2>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close popup"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email and Company */}
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2 sm:col-start-1">
                <Label
                  htmlFor="popup-email-input"
                  className="mb-2 block text-sm font-inter font-medium text-black"
                >
                  Email *
                </Label>
                <Input
                  id="popup-email-input"
                  type="email"
                  className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    updateFormField("email", event.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <Label
                  htmlFor="popup-company-input"
                  className="mb-2 block text-sm font-inter font-medium text-black"
                >
                  Company *
                </Label>
                <Input
                  id="popup-company-input"
                  type="text"
                  className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
                  required
                  value={formData.company}
                  onChange={(event) =>
                    updateFormField("company", event.target.value)
                  }
                />
              </div>
            </div>

            {/* First Name and Last Name */}
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="popup-firstName-input"
                  className="mb-2 block text-sm font-inter font-medium text-black"
                >
                  First Name *
                </Label>
                <Input
                  id="popup-firstName-input"
                  type="text"
                  className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
                  required
                  value={formData.firstName}
                  onChange={(event) =>
                    updateFormField("firstName", event.target.value)
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="popup-lastName-input"
                  className="mb-2 block text-sm font-inter font-medium text-black"
                >
                  Last Name *
                </Label>
                <Input
                  id="popup-lastName-input"
                  type="text"
                  className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
                  required
                  value={formData.lastName}
                  onChange={(event) =>
                    updateFormField("lastName", event.target.value)
                  }
                />
              </div>
            </div>

            {/* Phone and Account Type */}
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="popup-phone-input"
                  className="mb-2 block text-sm font-inter font-medium text-black"
                >
                  Phone
                </Label>
                <Input
                  id="popup-phone-input"
                  type="tel"
                  className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
                  value={formData.phone}
                  onChange={(event) =>
                    updateFormField("phone", event.target.value)
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="popup-accountType-select"
                  className="mb-2 block text-sm font-inter font-medium text-black"
                >
                  Account Type
                </Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => updateFormField("accountType", value)}
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lender">Lender</SelectItem>
                    <SelectItem value="borrower">Borrower</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 font-inter order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-godex-secondary text-black hover:bg-godex-secondary/90 font-inter order-1 sm:order-2"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 