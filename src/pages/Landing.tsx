import { useEffect, useState } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RequestAccessPopup from "@/components/landing/RequestAccessPopup";
import Footer from "@/components/landing/Footer";
import { homeNavigationConfig } from "@/config/navigation";
import { toast } from "sonner";
import { Contact } from "@/types/Contact";
import useRequestEarlyAccess from "@/hooks/useRequestEarlyAccess";
import axios from "axios";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const { accessRequestFormData, updateAccessRequestFormField, handleSubmitEarlyAccessRequest } = useRequestEarlyAccess();

  const [contactFormData, setContactFormData] = useState<Partial<Contact>>({
    email: "",
    message: "",
  });

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function openPopup() {
    setIsPopupOpen(true);
  }

  function closePopup() {
    setIsPopupOpen(false);
  }

  function updateContactFormField(field: string, value: string) {
    setContactFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const handleContactFormSubmit = async () => {
    // Handle form submission logic here
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact`,
        {
          contactData: contactFormData
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      console.log(response);
      if (response.status !== 200) {
        throw new Error(response.data.error);
      }

      // set form data to empty
      setContactFormData({
        email: "",
        message: "",
      });
      // Show success toast
      toast.success("Thanks for reaching out. We'll be in touch soon.");
    }
    catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <div className="min-h-screen">
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} navigationConfig={homeNavigationConfig} />
      <main>
        <HeroSection openPopup={openPopup} />
        <div className="space-y-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <HowItWorksSection />
          <FeaturesSection
            formData={accessRequestFormData}
            updateFormField={updateAccessRequestFormField}
            submitForm={handleSubmitEarlyAccessRequest}
          />
        </div>
      </main>
      <Footer
        formData={contactFormData}
        updateFormField={updateContactFormField}
        submitForm={handleContactFormSubmit}
      />

      {/* Request Access Popup */}
      <RequestAccessPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        formData={accessRequestFormData}
        updateFormField={updateAccessRequestFormField}
        submitForm={handleSubmitEarlyAccessRequest}
      />
    </div>
  );
}
