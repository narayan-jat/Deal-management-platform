export default function HowItWorksSection() {
  return (
    <div id="how-it-works" className="rounded-2xl bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-12 text-center lg:mb-16">
        <p className="mb-4 text-sm font-medium tracking-wider text-brand-primary uppercase font-inter">
          How It Works
        </p>
        <h2 className="text-3xl font-inter font-semibold text-black sm:text-4xl lg:text-5xl">
          Start in 3 Easy Steps
        </h2>
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-3">
          <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,70,70,0.08)] transition-all duration-300 ease-[ease] hover:shadow-[0_15px_40px_rgba(0,70,70,0.12)] sm:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary sm:h-20 sm:w-20">
              <span className="text-2xl font-bold text-white sm:text-3xl font-inter">1</span>
            </div>
            <h3 className="mb-4 text-xl font-inter font-semibold text-black sm:text-2xl">
              Create Your Account
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 sm:text-base font-inter">
              Sign up in seconds. Choose your account type and set up your
              workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,70,70,0.08)] transition-all duration-300 ease-[ease] hover:shadow-[0_15px_40px_rgba(0,70,70,0.12)] sm:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary sm:h-20 sm:w-20">
              <span className="text-2xl font-bold text-white sm:text-3xl font-inter">2</span>
            </div>
            <h3 className="mb-4 text-xl font-inter font-semibold text-black sm:text-2xl">
              Start a New Deal
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 sm:text-base font-inter">
              Add key info, upload documents, and share with everyone working on
              the deal—no more scattered files or email chains.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,70,70,0.08)] transition-all duration-300 ease-[ease] hover:shadow-[0_15px_40px_rgba(0,70,70,0.12)] sm:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary sm:h-20 sm:w-20">
              <span className="text-2xl font-bold text-white sm:text-3xl font-inter">3</span>
            </div>
            <h3 className="mb-4 text-xl font-inter font-semibold text-black sm:text-2xl">
              Collaborate and Close
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 sm:text-base font-inter">
              Track updates, message collaborators, and keep everything moving.
              Simple, secure, and organized. Just send a link and get to work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
