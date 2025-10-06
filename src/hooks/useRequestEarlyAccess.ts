
import { useState } from "react";
import { EarlyAccessModel } from "@/types/EarlyAccess";
import { toast } from "sonner";
import axios from "axios";


export default function useRequestEarlyAccess() {

  const [accessRequestFormData, setAccessRequestFormData] = useState<Partial<EarlyAccessModel>>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    accountType: "LENDER",
  });

  function updateAccessRequestFormField(field: string, value: string) {
    setAccessRequestFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const handleSubmitEarlyAccessRequest = async () => {
    // Handle form submission logic here
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/request-early-access`,
        {
          requestEarlyAccessData: accessRequestFormData
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.error);
      }
      // Show success toast
      toast.success("Thanks for reaching out. We'll be in touch soon.");

      // Reset form data
      setAccessRequestFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        company: "",
        accountType: "LENDER",
      });
    }
    catch (error) {
      toast.error(error.message)
    }
  };

  return {
    accessRequestFormData,
    updateAccessRequestFormField,
    handleSubmitEarlyAccessRequest
  }
}