export default function HowItWorksSection() {
  return (
    <div className="box-border flex relative flex-col shrink-0 px-0 py-20 mt-5 rounded-2xl bg-zinc-100">
      <div className="mb-16 text-center">
        <p className="mb-4 text-sm font-medium tracking-wider text-[#004646] uppercase">
          How It Works
        </p>
        <h2 className="m-0 text-4xl font-light text-gray-800 max-sm:text-3xl">
          Start in 3 Easy Steps
        </h2>
      </div>
      <div className="grid relative gap-10 px-10 py-0 mx-auto my-0 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-w-[1000px] max-md:gap-16 max-md:grid-cols-[1fr]">
      
      
        <div className="relative px-8 py-10 text-center rounded-2xl border border-solid transition-all border-[#004646] border-opacity-10 duration-[0.3s] ease-[ease] shadow-[0_10px_30px_rgba(0,70,70,0.08)]">
          <div className="flex relative justify-center items-center mx-auto mt-0 mb-6 w-20 h-20 bg-emerald-900 bg-center bg-no-repeat bg-cover rounded-full bg-[url(https://encycolorpedia.com/004646)] z-[2]">
            <span className="text-3xl font-bold text-[white]">1</span>
          </div>
          <h3 className="mb-4 text-2xl font-medium text-gray-800">
            Create Your Account
          </h3>
          <p className="m-0 text-base leading-relaxed text-neutral-600">
            Sign up in seconds. Choose your account type and set up your
            workspace.
          </p>
        </div>
        <div className="relative px-8 py-10 text-center rounded-2xl border border-solid transition-all border-[#004646] border-opacity-10 duration-[0.3s] ease-[ease] shadow-[0_10px_30px_rgba(0,70,70,0.08)]">
          <div className="flex relative justify-center items-center mx-auto mt-0 mb-6 w-20 h-20 bg-emerald-900 bg-center bg-no-repeat bg-cover rounded-full bg-[url(https://encycolorpedia.com/004646)] z-[2]">
            <span className="text-3xl font-bold text-[white]">2</span>
          </div>
          <h3 className="mb-4 text-2xl font-medium text-gray-800">
            Start a New Deal
          </h3>
          <p className="m-0 text-base leading-relaxed text-neutral-600">
            Add key info, upload documents, and share with everyone working on
            the deal—no more scattered files or email chains.
          </p>
        </div>
        <div className="relative px-8 py-10 text-center rounded-2xl border border-solid transition-all border-[#004646] border-opacity-10 duration-[0.3s] ease-[ease] shadow-[0_10px_30px_rgba(0,70,70,0.08)]">
          <div className="flex relative justify-center items-center mx-auto mt-0 mb-6 w-20 h-20 bg-emerald-900 bg-center bg-no-repeat bg-cover rounded-full bg-[url(https://encycolorpedia.com/004646)] z-[2]">
            <span className="text-3xl font-bold text-[white]">3</span>
          </div>
          <h3 className="mb-4 text-2xl font-medium text-gray-800">
            Collaborate and Close
          </h3>
          <p className="m-0 text-base leading-relaxed text-neutral-600">
            Track updates, message collaborators, and keep everything moving.
            Simple, secure, and organized. Just send a link and get to work.
          </p>
        </div>
      </div>
    </div>
  );
}
