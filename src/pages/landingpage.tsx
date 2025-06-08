import { useState } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
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
    <div>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main>
        <HeroSection />
        <section className="grid gap-16 px-16 py-32 mx-auto my-0 grid-cols-[1fr] max-w-[1488px] max-sm:px-8 max-sm:py-20">
          <HowItWorksSection />
          <FeaturesSection
            formData={formData}
            updateFormField={updateFormField}
            toggleAssetClass={toggleAssetClass}
            submitForm={submitForm}
          />
          <div className="static top-[100px]" />
        </section>
      </main>
      <Footer
        formData={formData}
        updateFormField={updateFormField}
        submitForm={submitForm}
      />
    </div>
  );
}
