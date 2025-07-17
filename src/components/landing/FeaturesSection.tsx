import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  accountType: string;
  assetClasses: string[];
  message: string;
}

interface FeaturesSectionProps {
  formData: FormData;
  updateFormField: (field: string, value: string) => void;
  toggleAssetClass: (assetClass: string) => void;
  submitForm: () => void;
}

export default function FeaturesSection({
  formData,
  updateFormField,
  toggleAssetClass,
  submitForm,
}: FeaturesSectionProps) {
  return (
    <div id="features">
      {/* Hero Banner */}
      <div className="bg-godex-primary px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-4xl text-center text-3xl font-inter font-semibold text-white leading-tight sm:text-4xl lg:text-5xl">
          <p>Stop Chasing Emails.</p>
          <p>Start Closing Deals.</p>
        </h2>
      </div>

      {/* Features Content */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-inter font-semibold text-black sm:text-4xl lg:text-5xl">
            Streamline your private credit workflow
          </h2>
          <p className="mb-12 text-lg font-inter leading-relaxed text-gray-600 lg:mb-16">
            GoDex is the all-in-one platform for private credit professionals.
            From deal creation to collaboration, we've got you covered
          </p>
          
          {/* Features Grid */}
          <div className="mb-16 grid gap-6 sm:gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow sm:p-8">
              <h3 className="mb-4 text-xl font-inter font-semibold text-black sm:text-2xl">
                Create Deal
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base font-inter">
                Easily create and manage deals with our intuitive interface. Add
                key information, documents, and track progress in one place.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow sm:p-8">
              <h3 className="mb-4 text-xl font-inter font-semibold text-black sm:text-2xl">
                Share Securely
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base font-inter">
                Share deals securely with investors and stakeholders. Control
                access and permissions to ensure confidentiality.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow sm:p-8">
              <h3 className="mb-4 text-xl font-inter font-semibold text-black sm:text-2xl">
                Collaborate
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base font-inter">
                Collaborate with your team and investors in real-time. Discuss
                deals, share updates, and make decisions efficiently.
              </p>
            </div>
          </div>

          {/* Beta Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-inter font-semibold text-black sm:text-4xl lg:text-5xl">
              Be Among the First to Use GoDex — Join the Beta
            </h2>
            <p className="text-lg font-inter leading-relaxed text-gray-600">
              A simpler way to manage your deals. Built for borrowers, brokers,
              and lenders who want less friction and more focus.
            </p>
          </div>

          {/* Request Access Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8 lg:p-10">
            <h2 className="mb-6 text-2xl font-inter font-semibold text-black sm:text-3xl">
              Request Access.
            </h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitForm();
              }}
              className="space-y-6"
              id="requestearlyaccess"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="email-input"
                    className="mb-2 block text-sm font-inter font-medium text-black"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email-input"
                    type="email"
                    className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      updateFormField("email", event.target.value)
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="company-input"
                    className="mb-2 block text-sm font-inter font-medium text-black"
                  >
                    Company *
                  </Label>
                  <Input
                    id="company-input"
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

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="firstName-input"
                    className="mb-2 block text-sm font-inter font-medium text-black"
                  >
                    First Name *
                  </Label>
                  <Input
                    id="firstName-input"
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
                    htmlFor="lastName-input"
                    className="mb-2 block text-sm font-inter font-medium text-black"
                  >
                    Last Name *
                  </Label>
                  <Input
                    id="lastName-input"
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

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="phone-input"
                    className="mb-2 block text-sm font-inter font-medium text-black"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone-input"
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
                    htmlFor="accountType-select"
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
                      <SelectItem value="gp">General Partner</SelectItem>
                      <SelectItem value="lp">Limited Partner</SelectItem>
                      <SelectItem value="service-provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-3 block text-sm font-inter font-medium text-black">
                  Asset Classes (select all that apply)
                </Label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Private Equity",
                    "Venture Capital",
                    "Real Estate",
                    "Credit",
                    "Infrastructure",
                  ]?.map((assetClass) => (
                    <div
                      className="flex items-center space-x-2 font-inter"
                      key={assetClass}
                    >
                      <Checkbox
                        id={assetClass}
                        checked={formData.assetClasses.includes(assetClass)}
                        onCheckedChange={() => toggleAssetClass(assetClass)}
                        className="text-godex-primary focus:ring-godex-primary/20"
                      />
                      <Label
                        htmlFor={assetClass}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {assetClass}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-[90%] mx-auto block bg-godex-secondary text-black hover:bg-godex-secondary/90 font-inter"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
