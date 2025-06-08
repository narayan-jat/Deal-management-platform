interface FormData {
  email: string;
  message: string;
}

interface FooterProps {
  formData: FormData;
  updateFormField: (field: string, value: string) => void;
  submitForm: () => void;
}

export default function Footer({
  formData,
  updateFormField,
  submitForm,
}: FooterProps) {
  return (
    <footer className="px-16 pt-20 pb-10 bg-emerald-900 text-[white] max-sm:px-8 max-sm:pt-16 max-sm:pb-8">
      <div className="mx-auto my-0 text-center max-w-[1488px]">
        <h2 className="mb-6 text-5xl font-light leading-tight text-[white] max-sm:text-4xl">
          {" "}
          Got questions? Let's get in touch
        </h2>
        <form
          className="mx-auto mt-0 mb-16 max-w-[600px]"
          onSubmit={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          <div className="mb-6">
            <label
              htmlFor="footer-email"
              className="block mb-2 text-base font-medium text-left text-[white]"
            >
              Email
            </label>
            <input
              className="p-4 w-full text-base rounded-lg border border-solid bg-white bg-opacity-10 border-white border-opacity-30 text-[white] placeholder-white placeholder-opacity-70"
              id="footer-email"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={(event) => updateFormField("email", event.target.value)}
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="footer-message"
              className="block mb-2 text-base font-medium text-left text-[white]"
            >
              Message
            </label>
            <textarea
              className="p-4 w-full text-base rounded-lg border border-solid resize-y bg-white bg-opacity-10 border-white border-opacity-30 min-h-[120px] text-[white] placeholder-white placeholder-opacity-70"
              id="footer-message"
              rows={5}
              placeholder="Tell us how we can help you..."
              required
              value={formData.message || ""}
              onChange={(event) =>
                updateFormField("message", event.target.value)
              }
            />
          </div>
          <button
            className="px-8 py-4 text-lg font-medium bg-orange-300 rounded-lg transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] text-[white]"
            type="submit"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                submitForm();
              }
            }}
          >
            Submit
          </button>
        </form>
        <div className="flex flex-wrap gap-5 justify-between items-center pt-10 border-t border-solid border-t-white border-t-opacity-20 max-sm:flex-col max-sm:items-center">
          <p className="m-0 text-sm text-stone-300">© 2025 GoDex</p>
          <div className="flex flex-wrap gap-6">
            <a
              className="text-sm no-underline duration-[0.2s] ease-[ease] text-stone-300 transition-[color] hover:text-white"
              href="#"
            >
              Terms of Use
            </a>
            <a
              className="text-sm no-underline duration-[0.2s] ease-[ease] text-stone-300 transition-[color] hover:text-white"
              href="#"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
