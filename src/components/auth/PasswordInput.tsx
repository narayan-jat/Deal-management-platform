import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";


const PasswordInput = ({
  value,
  onChange,
  placeholder = "Enter password",
  label = "Password",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label className="block text-sm font-medium text-black mb-2">
        {label} {label === "Password" ? <span className="text-red-500">*</span> : ""}
      </Label>
      <div className="relative flex items-center">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pr-10 border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-primary"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput