import { useState } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RequestAccessPopup from "@/components/landing/RequestAccessPopup";
import Footer from "@/components/landing/Footer";
import { toast } from "sonner";

type AccountType = "lender" | "borrower" | "broker" | "other";

interface AccessRequestType {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  accountType: AccountType;
  message: string;
}

interface ContactFormType {
  email: string;
  message: string;
}

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [accessRequestFormData, setAccessRequestFormData] = useState<AccessRequestType>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    accountType: "lender",
    message: "",
  });

  const [contactFormData, setContactFormData] = useState<ContactFormType>({
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

  function updateAccessRequestFormField(field: string, value: string) {
    setAccessRequestFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateContactFormField(field: string, value: string) {
    setContactFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const handleSubmitEarlyAccessRequest = () => {
    // Handle form submission logic here
    // Show success toast
    toast.success("Thanks for reaching out. We'll be in touch soon.");
    
    // Reset form data
    setAccessRequestFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      company: "",
      accountType: "lender",
      message: "",
    });
  };

  const handleContactFormSubmit = () => {
    // Handle form submission logic here
    // set form data to empty
    setContactFormData({
      email: "",
      message: "",
    });
    // Show success toast
    toast.success("Thanks for reaching out. We'll be in touch soon.");
  };

  return (
    <div className="min-h-screen">
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
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
