import { useState } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

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

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<AccessRequestType>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    accountType: "lender",
    message: "",
  });

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function updateFormField(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const handleSubmit = () => {
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen">
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main>
        <HeroSection />
        <div className="space-y-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <HowItWorksSection />
          <FeaturesSection
            formData={formData}
            updateFormField={updateFormField}
            submitForm={handleSubmit}
          />
        </div>
      </main>
      <Footer
        formData={formData}
        updateFormField={updateFormField}
        submitForm={handleSubmit}
      />
    </div>
  );
}
