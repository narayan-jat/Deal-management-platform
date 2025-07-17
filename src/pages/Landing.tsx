import { useState } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

interface AccessRequestType {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  accountType: string;
  assetClasses: string[];
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
    accountType: "",
    assetClasses: [] as string[],
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

  function toggleAssetClass(assetClass: string) {
    setFormData((prev) => {
      const index = prev.assetClasses.indexOf(assetClass);
      const newAssetClasses = [...prev.assetClasses];

      if (index > -1) {
        newAssetClasses.splice(index, 1);
      } else {
        newAssetClasses.push(assetClass);
      }

      return {
        ...prev,
        assetClasses: newAssetClasses,
      };
    });
  }

  function submitForm() {
    console.log("Form submitted:", formData);
    // Handle form submission
  }

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
            toggleAssetClass={toggleAssetClass}
            submitForm={submitForm}
          />
        </div>
      </main>
      <Footer
        formData={formData}
        updateFormField={updateFormField}
        submitForm={submitForm}
      />
    </div>
  );
}
