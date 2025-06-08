export default function HeroSection() {
  return (
    <section className="grid overflow-hidden relative gap-20 items-center px-16 py-32 mx-auto my-0 bg-emerald-900 grid-cols-[1fr_1fr] max-w-[1488px] text-[white] max-md:gap-10 max-md:px-8 max-md:py-20 max-md:grid-cols-[1fr]">
      <div className="absolute top-5 right-10 opacity-30 bg-[20px_20px] h-[200px] w-[200px]" />
      <div className="absolute bottom-10 opacity-40 bg-[15px_15px] h-[150px] left-[60px] w-[150px]" />
      <div className="relative p-10 rounded-2xl border border-solid backdrop-blur-[10px] border-white border-opacity-10">
        <div className="p-6 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center pb-4 mb-5 border-b border-solid border-b-zinc-100">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 text-base font-semibold bg-emerald-600 rounded-lg text-[white] flex items-center justify-center">
                ▶
              </div>
              <div>
                <div className="text-base font-semibold text-zinc-800">
                  Opportunity Summary
                </div>
                <div className="text-xs text-stone-500">
                  View Full Dashboard
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-40 h-40">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgb(0, 170, 108)"
                  strokeWidth="12"
                  strokeDasharray="308 440"
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="12"
                  strokeDasharray="132 440"
                  strokeDashoffset="-308"
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-5 justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-emerald-600 rounded-full" />
              <div>
                <div className="text-xs text-stone-500">New Opportunities</div>
                <div className="text-base font-semibold text-zinc-800">
                  <span>35 </span>
                  <span className="text-xs text-emerald-600">70%</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <div>
                <div className="text-xs text-stone-500">
                  Viewed Opportunities
                </div>
                <div className="text-base font-semibold text-zinc-800">
                  <span>15 </span>
                  <span className="text-xs text-blue-500">30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="pr-8 mb-8 w-auto text-5xl font-semibold tracking-normal leading-none max-md:text-5xl max-sm:text-4xl">
          Try the GoDex Beta
        </h1>
        <p className="mb-10 text-xl leading-normal max-w-[480px] text-white text-opacity-80">
          A simpler way to manage your deals. Built for borrowers, brokers, and
          lenders who want less friction and more focus.
        </p>
        <button className="gap-2 px-7 py-3.5 text-base font-medium bg-orange-300 rounded-md transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] text-[white] hover:bg-[#006666]">
          &nbsp;Request Early Access
        </button>
      </div>
    </section>
  );
}
