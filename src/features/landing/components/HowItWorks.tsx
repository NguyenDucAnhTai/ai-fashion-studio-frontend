import { CreditCard, Palette, RefreshCw, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../shared/components/Container";

const STEPS = [
  {
    id: "catalog",
    title: "Choose a T-shirt",
    description: "Browse active products, select a variant, and start a design draft.",
    icon: Shirt,
    gradient: "from-beige-100 via-beige-200 to-beige-300",
  },
  {
    id: "design",
    title: "Customize the design",
    description: "Add text, artwork, colors, and print-ready layers in the studio.",
    icon: Palette,
    gradient: "from-primary-800 via-primary-900 to-black",
    dark: true,
  },
  {
    id: "tryon",
    title: "Preview with AI Try-On",
    description: "Save the design, upload a photo, and poll the async try-on result.",
    icon: RefreshCw,
    gradient: "from-accent-100 via-accent-200 to-accent-300",
  },
  {
    id: "checkout",
    title: "Order and pay",
    description: "Create an order, continue to PayOS or SePay, and track production.",
    icon: CreditCard,
    gradient: "from-primary-100 via-primary-200 to-primary-300",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-beige-50 py-20 lg:py-28">
      <Container>
        <motion.div
          className="mx-auto mb-14 max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-primary-400">
            How It Works
          </p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-primary-900 sm:text-4xl">
            From blank tee to ready order
          </h2>
          <p className="text-base leading-relaxed text-primary-500">
            The MVP flow follows the backend contract: catalog, saved design,
            async try-on, order, payment, and staff production updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const titleColor = step.dark ? "text-white" : "text-primary-900";
            const bodyColor = step.dark ? "text-white/65" : "text-primary-600";

            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.08,
                }}
                className={[
                  "group relative min-h-72 overflow-hidden rounded-3xl bg-gradient-to-br p-5 shadow-soft",
                  step.gradient,
                ].join(" ")}
              >
                <div
                  className={[
                    "mb-10 flex h-11 w-11 items-center justify-center rounded-2xl",
                    step.dark ? "bg-white/12 text-accent-300" : "bg-white/65 text-primary-900",
                  ].join(" ")}
                >
                  <Icon size={19} strokeWidth={1.7} />
                </div>
                <p
                  className={[
                    "mb-3 text-[10px] font-semibold uppercase tracking-widest",
                    step.dark ? "text-white/40" : "text-primary-400",
                  ].join(" ")}
                >
                  Step {index + 1}
                </p>
                <h3 className={["mb-3 font-display text-xl font-semibold", titleColor].join(" ")}>
                  {step.title}
                </h3>
                <p className={["text-sm leading-relaxed", bodyColor].join(" ")}>
                  {step.description}
                </p>
                <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

