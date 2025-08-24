import { GoldButton } from "@/components/ui/button"

interface HeroSectionProps {
  openPopup: () => void;
}

export default function HeroSection({ openPopup }: HeroSectionProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-godex-primary px-4 py-16 sm:px-8 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:gap-20 lg:grid-cols-2 lg:items-center">
          {/* Dashboard Preview Card */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute top-5 right-10 h-32 w-32 opacity-30 bg-[20px_20px] sm:h-40 sm:w-40 lg:h-48 lg:w-48" />
            <div className="absolute bottom-10 left-8 h-24 w-24 opacity-40 bg-[15px_15px] sm:h-32 sm:w-32 lg:h-36 lg:w-36" />
            <div className="relative rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-[10px] sm:p-6 lg:p-8">
              <div className="rounded-xl bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] sm:p-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-godex-primary text-sm font-semibold text-white">
                      ▶
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-800 sm:text-base font-inter">
                        Opportunity Summary
                      </div>
                      <div className="text-xs text-stone-500 font-inter">
                        View Full Dashboard
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6 flex items-center justify-center">
                  <div className="relative h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40">
                    <svg width="100%" height="100%" viewBox="0 0 160 160">
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
                      <text
                        x="80"
                        y="65"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="rgb(59, 130, 246)"
                        fontSize="12"
                        fontWeight="600"
                      >
                        30%
                      </text>
                      <text
                        x="80"
                        y="95"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="rgb(0, 170, 108)"
                        fontSize="12"
                        fontWeight="600"
                      >
                        70%
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-600" />
                    <div>
                      <div className="text-xs text-stone-500 font-inter">New Opportunities</div>
                      <div className="text-sm font-semibold text-zinc-800 sm:text-base font-inter">
                        <span>35 </span>
                        <span className="text-xs text-emerald-600">70%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <div>
                      <div className="text-xs text-stone-500 font-inter">
                        Viewed Opportunities
                      </div>
                      <div className="text-sm font-semibold text-zinc-800 sm:text-base font-inter">
                        <span>15 </span>
                        <span className="text-xs text-blue-500">30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="order-1 text-center text-white lg:order-2 lg:text-left">
            <h1 className="mb-6 text-3xl font-inter font-semibold leading-tight tracking-normal sm:text-4xl lg:text-5xl xl:text-6xl">
              Try the GoDex Beta
            </h1>
            <p className="mb-8 text-lg font-inter text-white/90 sm:text-xl lg:max-w-lg">
              A simpler way to manage your deals. Built for borrowers, brokers, and
              lenders who want less friction and more focus.
            </p>
            <GoldButton 
              className="w-full sm:w-auto"
              onClick={openPopup}
              id="request-early-access-button"
            >
              Request Early Access
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}
