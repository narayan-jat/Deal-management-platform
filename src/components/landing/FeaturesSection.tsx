import { useState } from "react";

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
    <div>
      <div className="box-border flex relative flex-col shrink-0 pt-8 pr-6 pb-6 my-5 -mr-0.5 h-auto bg-[#004646] border border-hidden">
     
      <h2 className="self-stretch pt-1.5 mx-auto mb-6 text-4xl font-light text-white font-lora leading-[72px] max-sm:text-6xl text-center">
      <p>Stop Chasing Emails.</p>
      <p>Start Closing Deals.</p>
    </h2>

      </div>
      <div className="mt-20">
        <h2 className="pt-0.5 mb-6 text-4xl font-lora text-gray-800 max-sm:text-3xl">
          Streamline your private credit workflow
        </h2>
        <p className="mb-16 text-lg font-lora leading-relaxed text-neutral-600">
          GoDex is the all-in-one platform for private credit professionals.
          From deal creation to collaboration, we've got you covered{" "}
        </p>
        <div className="grid gap-8 mb-20 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          <div className="p-8 rounded-xl border border-blue-50 border-solid bg-[white]">
            <h3 className="mb-4 text-2xl font-medium text-gray-800">
              {" "}
              Create Deal{" "}
            </h3>
            <p className="text-base leading-relaxed text-neutral-600">
              {" "}
              Easily create and manage deals with our intuitive interface. Add
              key information, documents, and track progress in one place.{" "}
            </p>
          </div>
          <div className="p-8 rounded-xl border border-blue-50 border-solid bg-[white]">
            <h3 className="mb-4 text-2xl font-medium text-gray-800">
              {" "}
              Share Securely{" "}
            </h3>
            <p className="text-base leading-relaxed text-neutral-600">
              {" "}
              Share deals securely with investors and stakeholders. Control
              access and permissions to ensure confidentiality.{" "}
            </p>
          </div>
          <div className="p-8 rounded-xl border border-blue-50 border-solid bg-[white]">
            <h3 className="mb-4 text-2xl font-medium text-gray-800">
              {" "}
              Collaborate{" "}
            </h3>
            <p className="text-base leading-relaxed text-neutral-600">
              {" "}
              Collaborate with your team and investors in real-time. Discuss
              deals, share updates, and make decisions efficiently.{" "}
            </p>
          </div>
        </div>
        <div className="box-border flex relative flex-col shrink-0 pb-8 mt-5 h-auto">
          <h2 className="mb-6 text-4xl font-lora text-gray-800 max-sm:text-3xl">
            {" "}
            Be Among the First to Use GoDex — Join the Beta{" "}
          </h2>
          <p className="mb-16 text-lg font-lora leading-relaxed text-neutral-600">
            {" "}
            A simpler way to manage your deals. Built for borrowers, brokers,
            and lenders who want less friction and more focus.{" "}
          </p>
        </div>
        <div className="p-10 rounded-2xl border border border-solid bg-[white] shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
          <h2 className="mb-8 text-3xl font-light text-gray-800">
            {" "}
            Request Access.{" "}
          </h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitForm();
            }}
          >
            <div className="mb-6">
              <label
                htmlFor="email-input"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                {" "}
                Email *{" "}
              </label>
              <input
                id="email-input"
                type="email"
                className="px-4 py-3 w-full text-base rounded-md border border-solid bg-[white] border-stone-300"
                required
                value={formData.email}
                onChange={(event) =>
                  updateFormField("email", event.target.value)
                }
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="firstName-input"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                {" "}
                First Name *{" "}
              </label>
              <input
                id="firstName-input"
                type="text"
                className="px-4 py-3 w-full text-base rounded-md border border-solid bg-[white] border-stone-300"
                required
                value={formData.firstName}
                onChange={(event) =>
                  updateFormField("firstName", event.target.value)
                }
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="lastName-input"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                {" "}
                Last Name *{" "}
              </label>
              <input
                id="lastName-input"
                type="text"
                className="px-4 py-3 w-full text-base rounded-md border border-solid bg-[white] border-stone-300"
                required
                value={formData.lastName}
                onChange={(event) =>
                  updateFormField("lastName", event.target.value)
                }
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="phone-input"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                {" "}
                Phone{" "}
              </label>
              <input
                id="phone-input"
                type="tel"
                className="px-4 py-3 w-full text-base rounded-md border border-solid bg-[white] border-stone-300"
                value={formData.phone}
                onChange={(event) =>
                  updateFormField("phone", event.target.value)
                }
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="company-input"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                {" "}
                Company *{" "}
              </label>
              <input
                id="company-input"
                type="text"
                className="px-4 py-3 w-full text-base rounded-md border border-solid bg-[white] border-stone-300"
                required
                value={formData.company}
                onChange={(event) =>
                  updateFormField("company", event.target.value)
                }
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="accountType-select"
                className="block mb-2 text-sm font-medium text-gray-800"
              >
                {" "}
                Account Type{" "}
              </label>
              <select
                id="accountType-select"
                className="px-4 py-3 w-full text-base rounded-md border border-solid bg-[white] border-stone-300"
                value={formData.accountType}
                onChange={(event) =>
                  updateFormField("accountType", event.target.value)
                }
              >
                <option value=""> Select account type </option>
                <option value="gp"> General Partner </option>
                <option value="lp"> Limited Partner </option>
                <option value="service-provider"> Service Provider </option>
              </select>
            </div>
            <div className="mb-8">
              <label className="block mb-3 text-sm font-medium text-gray-800">
                {" "}
                Asset Classes (select all that apply){" "}
              </label>
              {[
                "Private Equity",
                "Venture Capital",
                "Real Estate",
                "Credit",
                "Infrastructure",
              ]?.map((assetClass) => (
                <label
                  className="flex items-center mb-2 cursor-pointer"
                  key={assetClass}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.assetClasses.includes(assetClass)}
                    onChange={(event) => toggleAssetClass(assetClass)}
                  />
                  <span className="text-sm text-gray-800">{assetClass}</span>
                </label>
              ))}
            </div>
            <button
              className="p-4 w-full text-base font-medium bg-[#C8B273] rounded-lg transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] text-[white]"
              type="submit"
            >
              {" "}
              Submit{" "}
            </button>
          </form>
        </div>
        <div className="box-border flex relative flex-col shrink-0 p-5 min-h-[100px]">
          <section className="box-border relative grow shrink-0 self-stretch p-5 mx-auto w-full max-w-[1200px] min-h-[100px]" />
        </div>
        <h2 className="mb-10 text-4xl font-light text-gray-800 max-sm:text-3xl" />
        <div className="grid gap-10 text-center grid-cols-[repeat(auto-fit,minmax(200px,1fr))]" />
      </div>
    </div>
  );
}
