import { useState } from "react";
import { CreditCard, Palette, RefreshCw, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../shared/components/Container";
import Stepper, { Step } from "../../../shared/components/Stepper";

const STEPS = [
  {
    id: "catalog",
    title: "Choose a T-shirt",
    description:
      "Browse active products, select a size and material variant, then begin a design draft from the detail page.",
    icon: Shirt,
    gradient: "from-beige-100 via-beige-200 to-beige-300",
    stat: "01",
  },
  {
    id: "design",
    title: "Customize the design",
    description:
      "Add typography, artwork, color, and print-ready layers while keeping the saved design as the source of truth.",
    icon: Palette,
    gradient: "from-primary-800 via-primary-900 to-black",
    dark: true,
    stat: "02",
  },
  {
    id: "tryon",
    title: "Preview with AI Try-On",
    description:
      "Upload a photo, request async Try-On, and review the generated preview before checkout.",
    icon: RefreshCw,
    gradient: "from-accent-100 via-accent-200 to-accent-300",
    stat: "03",
  },
  {
    id: "checkout",
    title: "Order and pay",
    description:
      "Create the order, continue to PayOS or SePay, then let staff track production and shipping.",
    icon: CreditCard,
    gradient: "from-primary-100 via-primary-200 to-primary-300",
    stat: "04",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const activeMeta = STEPS[Math.min(activeStep, STEPS.length) - 1] ?? STEPS[0];

  return (
    <section className="w-full bg-beige-50 py-24 lg:py-32">
      <Container>
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-primary-400">
            How It Works
          </p>
          <h2 className="mb-5 font-display text-4xl font-semibold text-primary-900 sm:text-5xl">
            From blank tee to ready order
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-primary-500">
            The MVP flow follows the backend contract: catalog, saved design,
            async try-on, order, payment, and staff production updates.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Stepper
            initialStep={1}
            loop
            onStepChange={(step) => setActiveStep(step)}
            backButtonText="Previous"
            nextButtonText="Next"
            stepCircleContainerClassName={[
              "w-full border border-white/40 bg-gradient-to-br shadow-medium",
              activeMeta.gradient,
            ].join(" ")}
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const titleColor = step.dark ? "text-white" : "text-primary-900";
              const bodyColor = step.dark ? "text-white/68" : "text-primary-600";
              const metaColor = step.dark ? "text-white/40" : "text-primary-400";
              const iconBox = step.dark
                ? "bg-white/12 text-accent-300 border-white/10"
                : "bg-white/70 text-primary-900 border-white/70";

              return (
                <Step key={step.id}>
                  <div className="relative overflow-hidden py-16 sm:py-24">
                    <div
                      className="absolute inset-0 opacity-[0.07]"
                      style={{
                        backgroundImage:
                          "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                      }}
                    />
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
                    <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

                    <div className="relative z-10 grid grid-cols-1 items-center gap-10 sm:grid-cols-[240px_1fr] sm:gap-16">
                      <div className="flex flex-row items-center gap-6 sm:flex-col sm:items-start sm:gap-10">
                        <div className={["flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] border shadow-soft sm:h-28 sm:w-28", iconBox].join(" ")}>
                          <Icon size={36} strokeWidth={1.6} className="sm:h-11 sm:w-11" />
                        </div>
                        <span className={["font-display text-6xl font-semibold leading-none opacity-40 sm:text-8xl", metaColor].join(" ")}>
                          {step.stat}
                        </span>
                      </div>

                      <div>
                        <p className={["mb-4 text-xs font-semibold uppercase tracking-widest", metaColor].join(" ")}>
                          Step {index + 1} of {STEPS.length}
                        </p>
                        <h3 className={["mb-5 font-display text-3xl font-semibold leading-tight sm:text-5xl", titleColor].join(" ")}>
                          {step.title}
                        </h3>
                        <p className={["max-w-xl text-base leading-8 sm:text-xl sm:leading-9", bodyColor].join(" ")}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Step>
              );
            })}
          </Stepper>
        </motion.div>
      </Container>
    </section>
  );
}
