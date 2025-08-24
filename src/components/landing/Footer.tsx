import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Contact } from "@/types/Contact";

interface FooterProps {
  formData: Partial<Contact>;
  updateFormField: (field: string, value: string) => void;
  submitForm: () => void;
}

export default function Footer({
  formData,
  updateFormField,
  submitForm,
}: FooterProps) {

  return (
    <footer id="contact" className="bg-godex-primary px-4 py-16 text-white sm:px-6 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-8 text-3xl font-inter leading-tight text-white sm:text-4xl lg:text-5xl">
          Got questions? Let's get in touch
        </h2>
        <form
          className="mx-auto mb-12 max-w-2xl"
          onSubmit={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          <div className="mb-6">
            <Label
              htmlFor="footer-email"
              className="mb-2 block text-left text-base font-medium text-white font-inter"
            >
              Email
            </Label>
            <Input
              className="w-full border-white/30 bg-white/10 text-white placeholder-white/70 font-inter focus:border-white/50 focus:ring-white/20"
              id="footer-email"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={(event) => updateFormField("email", event.target.value)}
            />
          </div>
          <div className="mb-8">
            <Label
              htmlFor="footer-message"
              className="mb-2 block text-left text-base font-medium text-white font-inter"
            >
              Message
            </Label>
            <Textarea
              className="min-h-[120px] w-full resize-y border-white/30 bg-white/10 text-white placeholder-white/70 font-inter focus:border-white/50 focus:ring-white/20"
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
          <Button
            className="w-[80%] mx-auto block bg-godex-secondary text-black hover:bg-godex-secondary/90 font-inter"
            type="submit"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                submitForm();
              }
            }}
          >
            Submit
          </Button>
        </form>
        <div className="flex flex-col items-center gap-6 border-t border-white/20 pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-stone-300 font-inter">© 2025 GoDex</p>
          <div className="flex flex-wrap gap-6">
            <Link
              to="/terms-of-service"
              className="text-sm text-stone-300 transition-colors duration-200 ease-[ease] hover:text-white font-inter"
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy-policy"
              className="text-sm text-stone-300 transition-colors duration-200 ease-[ease] hover:text-white font-inter"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
