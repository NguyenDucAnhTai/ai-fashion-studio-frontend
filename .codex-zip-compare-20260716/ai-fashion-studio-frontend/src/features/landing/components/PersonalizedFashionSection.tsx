import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Container from "../../../shared/components/Container";

/* ─── Mock data ──────────────────────────────────────────────────────── */

const CHAT_MESSAGES = [
  {
    id: 1,
    role: "user" as const,
    text: "I'm 170cm, 65kg. I need an outfit for a concert.",
  },
  {
    id: 2,
    role: "coach" as const,
    text: "Oversized black tee, cargo pants, cotton fabric — that streetwear fit will look sharp.",
  },
  {
    id: 3,
    role: "user" as const,
    text: "Can you make it more casual?",
  },
];

const COMPONENTS = [
  { id: "top", label: "Top", value: "Oversized Tee", colorDot: "bg-[#18213A]" },
  {
    id: "bottom",
    label: "Bottom",
    value: "Cargo Pants",
    colorDot: "bg-[#5F6A85]",
  },
  {
    id: "fabric",
    label: "Fabric",
    value: "Cotton 250gsm",
    colorDot: "bg-[#C9B896]",
  },
  {
    id: "color",
    label: "Color",
    value: "Black / Grey",
    colorDot: "bg-violet-400",
  },
];

const STATS = [
  { label: "Before", value: 72, heightClass: "h-[58%]", highlight: false },
  {
    label: "With AI Coach",
    value: 91,
    heightClass: "h-[91%]",
    highlight: true,
  },
];

const FEATURES = [
  "AI asks about your body & style preferences",
  "Get instant outfit component suggestions",
  "Preview your try-on before you customize",
];

/* ─── 2D Mannequin SVG ───────────────────────────────────────────────── */

function MannequinPreview() {
  return (
    <svg
      viewBox="0 0 180 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-label="2D outfit preview"
    >
      <defs>
        <linearGradient
          id="coachShirtGradient"
          x1="65"
          y1="54"
          x2="115"
          y2="203"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2A2A2A" />
          <stop offset="1" stopColor="#101010" />
        </linearGradient>
        <linearGradient
          id="coachSleeveGradient"
          x1="35"
          y1="70"
          x2="145"
          y2="152"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#262626" />
          <stop offset="1" stopColor="#131313" />
        </linearGradient>
        <linearGradient
          id="coachPantsGradient"
          x1="52"
          y1="196"
          x2="128"
          y2="293"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7C776E" />
          <stop offset="1" stopColor="#54514B" />
        </linearGradient>
      </defs>

      {/* Head */}
      <ellipse
        cx="90"
        cy="36"
        rx="17"
        ry="20"
        fill="#EFE6DA"
        stroke="#BEB2A3"
        strokeWidth="1.6"
      />
      <path
        d="M74 35c6-13 25-16 34-1"
        stroke="#D8CFC2"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Neck */}
      <path
        d="M76 55h28l5 13H71l5-13Z"
        fill="#E8DED0"
        stroke="#BEB2A3"
        strokeWidth="1.2"
      />

      {/* Sleeves (drawn first so the body overlaps them cleanly at the shoulder seam) */}
      <path
        d="M68 70C56 76 44 86 39 100c-4 11-4 23 0 34l7 16c2 4 7 5 11 2l7-14c-4-12-5-25-3-38 1-10 4-21 7-30Z"
        fill="url(#coachSleeveGradient)"
      />
      <path
        d="M112 70c12 6 24 16 29 30 4 11 4 23 0 34l-7 16c-2 4-7 5-11 2l-7-14c4-12 5-25 3-38-1-10-4-21-7-30Z"
        fill="url(#coachSleeveGradient)"
      />
      <ellipse cx="51" cy="150" rx="9" ry="5" fill="#181818" />
      <ellipse cx="129" cy="150" rx="9" ry="5" fill="#181818" />

      {/* Body (oversized tee) */}
      <path
        d="M68 70C72 60 80 54 90 54c10 0 18 6 22 16l4 40c2 30 2 60-1 86-.5 4-4 7-8 7H73c-4 0-7.5-3-8-7-3-26-3-56-1-86Z"
        fill="url(#coachShirtGradient)"
      />
      <path
        d="M74 62c6 6 26 6 32 0"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M67 188c11 6 35 6 46 0"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Waistband */}
      <rect x="66" y="196" width="48" height="14" rx="7" fill="url(#coachPantsGradient)" />

      {/* Legs */}
      <path
        d="M66 210L86 210C85 220 83 230 82 240L78 288C78 291 75 293 72 293L58 293C55 293 53 291 53 288L58 240C59 230 61 220 66 210Z"
        fill="url(#coachPantsGradient)"
      />
      <path
        d="M114 210L94 210C95 220 97 230 98 240L102 288C102 291 105 293 108 293L122 293C125 293 127 291 127 288L122 240C121 230 119 220 114 210Z"
        fill="url(#coachPantsGradient)"
      />
      <path
        d="M66 214c7 3 13 3 20 0"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.4"
      />
      <path
        d="M114 214c-7 3-13 3-20 0"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.4"
      />

      {/* Cargo pockets */}
      <rect
        x="54"
        y="236"
        width="16"
        height="20"
        rx="3"
        fill="rgba(0,0,0,0.18)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <rect
        x="110"
        y="236"
        width="16"
        height="20"
        rx="3"
        fill="rgba(0,0,0,0.18)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* Shoes */}
      <rect x="46" y="288" width="32" height="11" rx="5.5" fill="#1D1D1D" />
      <rect x="102" y="288" width="32" height="11" rx="5.5" fill="#1D1D1D" />
    </svg>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function CoachChatPreview() {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[#ECECEE] bg-white p-3 shadow-[0_2px_16px_rgba(24,33,58,0.06)]">
      <div className="flex items-center gap-2 border-b border-[#ECECEE] pb-2">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600">
          <Sparkles size={11} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold leading-none text-[#18213A]">
            Coach
          </p>
          <div className="mt-1 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            <span className="text-[8px] text-[#8B93A7]">Online</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {CHAT_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={[
              "max-w-[88%] rounded-lg px-2 py-1.5 text-[9px] leading-snug",
              msg.role === "user"
                ? "self-end rounded-br-sm bg-[#18213A] text-white"
                : "self-start rounded-bl-sm border border-violet-100 bg-violet-50 text-[#3A4358]",
            ].join(" ")}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function OutfitPreview() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#ECECEE] bg-white p-4 shadow-[0_2px_16px_rgba(24,33,58,0.06)]">
      <div className="w-full max-w-[130px]">
        <MannequinPreview />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">
          Size L
        </span>
        <span className="rounded-full bg-[#F5F5F7] px-2.5 py-1 text-[9px] font-semibold text-[#4F5B76]">
          Oversized Fit
        </span>
      </div>
    </div>
  );
}

function StatsOverlayCard() {
  return (
    <div className="rounded-2xl border border-[#ECECEE] bg-white p-4 shadow-[0_16px_44px_rgba(24,33,58,0.16)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#4F5B76]">
          Fit Confidence
        </p>
        <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
          <TrendingUp size={10} />
          +19%
        </span>
      </div>

      <div className="flex items-end justify-center gap-1.5 text-[11px] font-semibold text-[#18213A]">
        <span>72%</span>
        <ArrowRight size={11} className="mb-[1px] text-[#8B93A7]" />
        <span className="text-violet-600">91%</span>
      </div>

      <div className="mt-3 flex h-32 items-end gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <div className="flex h-full w-full items-end">
              <div
                className={[
                  "w-full rounded-t-md transition-all duration-300",
                  stat.heightClass,
                  stat.highlight ? "bg-[#5636F5]" : "bg-[#E4E4E8]",
                ].join(" ")}
              />
            </div>
            <span className="text-center text-[8px] leading-tight text-[#8B93A7]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-[#ECECEE] bg-white shadow-[0_24px_64px_rgba(24,33,58,0.12)]">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 border-b border-[#ECECEE] bg-[#F5F5F7] px-4 py-3">
          <div className="flex flex-shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-xs items-center justify-center gap-1.5 rounded-full border border-[#ECECEE] bg-white px-4 py-1 text-[10px] text-[#8B93A7]">
              <Lock size={9} />
              fitwear.studio/coach
            </div>
          </div>
          <div className="w-12 flex-shrink-0" />
        </div>

        {/* Screen content */}
        <div className="grid grid-cols-[0.85fr_1.3fr] gap-3 bg-[#FAFAFA] p-4 sm:grid-cols-[0.8fr_1.4fr_0.8fr] sm:p-5">
          <CoachChatPreview />
          <OutfitPreview />

          <div className="col-span-2 flex gap-2 sm:col-span-1 sm:flex-col">
            {COMPONENTS.map((comp) => (
              <div
                key={comp.id}
                className="flex flex-1 items-center gap-2 rounded-lg border border-[#ECECEE] bg-white p-2 shadow-[0_2px_16px_rgba(24,33,58,0.06)] sm:flex-none"
              >
                <span
                  className={[
                    "h-5 w-5 flex-shrink-0 rounded-md",
                    comp.colorDot,
                  ].join(" ")}
                />
                <div className="min-w-0">
                  <p className="truncate text-[7px] font-medium uppercase tracking-wide text-[#8B93A7] leading-none">
                    {comp.label}
                  </p>
                  <p className="mt-0.5 truncate text-[9px] font-semibold text-[#18213A]">
                    {comp.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div className="mx-auto mt-1.5 h-3 w-[88%] rounded-b-2xl bg-gradient-to-b from-[#DADCE2] to-[#C7C9D1]" />
      <div className="mx-auto h-1 w-[72%] rounded-b-md bg-[#C7C9D1]/70" />

      {/* Floating stats overlay */}
      <div className="absolute -bottom-12 -right-4 w-[172px] sm:-bottom-14 sm:-right-10 sm:w-[196px] lg:-bottom-16 lg:-right-14">
        <StatsOverlayCard />
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────── */

export default function FashionCoachSection() {
  return (
    <section className="w-full bg-[#FAFAFA] py-20 lg:py-28">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <h2 className="text-4xl font-semibold text-[#18213A] sm:text-5xl">
            AI Fashion Coach Services
          </h2>
        </div>

        {/* Main content */}
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-8">
            <LaptopMockup />
          </div>

          <div className="lg:col-span-4">
            <h3 className="mb-5 text-3xl font-semibold leading-tight text-[#18213A] sm:text-4xl">
              Build Your Look Faster
              <br />
              With AI-Powered Styling
            </h3>

            <p className="mb-7 max-w-md text-base leading-relaxed text-[#4F5B76]">
              Answer a few simple questions and receive personalized suggestions
              for fit, fabric, color, size, and outfit components. The AI coach
              helps customers choose a better outfit direction before
              customizing their final design.
            </p>

            <ul className="mb-9 flex flex-col gap-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-violet-600"
                  />
                  <span className="text-sm text-[#4F5B76]">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#5636F5] px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4527d9] hover:shadow-[0_12px_30px_rgba(86,54,245,0.35)]"
            >
              START STYLING
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
