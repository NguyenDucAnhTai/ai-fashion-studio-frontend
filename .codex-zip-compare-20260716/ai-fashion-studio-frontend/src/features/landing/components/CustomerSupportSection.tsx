import {
  Package,
  Ruler,
  Palette,
  CreditCard,
  Sparkles,
  Send,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../shared/components/Container";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SUPPORT_MESSAGES = [
  {
    id: 1,
    role: "user" as const,
    text: "Can I change my size after checkout?",
    time: "10:32 AM",
  },
  {
    id: 2,
    role: "support" as const,
    text: "You can edit your size before the order is confirmed. Once it's in production, changes may take 24h. Would you like me to check your order status?",
    time: "10:32 AM",
  },
  {
    id: 3,
    role: "user" as const,
    text: "Yes, order #FW-8821.",
    time: "10:33 AM",
  },
  {
    id: 4,
    role: "support" as const,
    text: "Order #FW-8821 is still in the design review stage. I've flagged it for a size update. You'll get a confirmation within the hour.",
    time: "10:33 AM",
  },
];

const FEATURES = [
  {
    id: "order",
    icon: Package,
    title: "Order Assistance",
    description:
      "Track status, request changes, and manage your active orders.",
    accent: "bg-beige-200 text-primary-700",
  },
  {
    id: "size",
    icon: Ruler,
    title: "Size Guidance",
    description: "Get help choosing the right size based on your body profile.",
    accent: "bg-accent-100 text-accent-600",
  },
  {
    id: "design",
    icon: Palette,
    title: "Design Support",
    description: "Fix, revise, or regenerate your saved outfit configurations.",
    accent: "bg-beige-100 text-primary-600",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment Questions",
    description: "Resolve billing issues, receipts, and refund requests fast.",
    accent: "bg-primary-100 text-primary-700",
  },
  {
    id: "recommend",
    icon: Sparkles,
    title: "Product Recommendations",
    description: "Find pieces that match your wardrobe, occasion, and taste.",
    accent: "bg-accent-100 text-accent-500",
  },
];

/* ─── Chat ───────────────────────────────────────────────────────────────── */

function SupportChat() {
  return (
    <div
      className="flex flex-col bg-white rounded-2xl border border-primary-100 overflow-hidden"
      style={{ minHeight: 440 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-primary-100">
        <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center flex-shrink-0">
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary-900 leading-none">
            Support Assistant
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
            <span className="text-[10px] text-primary-400">
              Always available
            </span>
          </div>
        </div>
        <span className="text-[9px] font-medium bg-beige-100 text-primary-500 px-2.5 py-0.5 rounded-full border border-primary-100">
          24/7
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {SUPPORT_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={[
              "flex gap-2.5",
              msg.role === "user" ? "flex-row-reverse" : "flex-row",
            ].join(" ")}
          >
            {/* Avatar */}
            <div
              className={[
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold mt-0.5",
                msg.role === "user"
                  ? "bg-primary-900 text-white"
                  : "bg-beige-200 text-primary-700",
              ].join(" ")}
            >
              {msg.role === "user" ? "U" : <Sparkles size={11} />}
            </div>

            {/* Bubble */}
            <div className="max-w-[78%]">
              <div
                className={[
                  "px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary-900 text-white rounded-tr-sm"
                    : "bg-beige-100 text-primary-800 rounded-tl-sm",
                ].join(" ")}
              >
                {msg.text}
              </div>
              <p className="text-[9px] text-primary-300 mt-1 px-1">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-primary-100">
        <div className="flex items-center gap-2 bg-beige-50 rounded-xl px-3.5 py-2.5 border border-primary-100">
          <input
            type="text"
            placeholder="Ask about size, order, payment, or design..."
            className="flex-1 bg-transparent text-xs text-primary-700 placeholder-primary-300 outline-none"
            readOnly
          />
          <button className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary-900 flex items-center justify-center hover:bg-primary-700 transition-colors">
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature cards ──────────────────────────────────────────────────────── */

function FeatureCards() {
  return (
    <div className="flex flex-col gap-3">
      {FEATURES.map((feat, i) => (
        <motion.a
          key={feat.id}
          href={`/support/${feat.id}`}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.07,
          }}
          className="group flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 border border-primary-100 hover:border-primary-200 hover:shadow-soft transition-all duration-200 cursor-pointer"
        >
          {/* Icon */}
          <div
            className={[
              "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
              feat.accent,
            ].join(" ")}
          >
            <feat.icon size={16} strokeWidth={1.5} />
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary-900 leading-none mb-0.5">
              {feat.title}
            </p>
            <p className="text-xs text-primary-400 leading-snug line-clamp-1">
              {feat.description}
            </p>
          </div>
          {/* Arrow */}
          <ArrowRight
            size={14}
            className="flex-shrink-0 text-primary-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200"
          />
        </motion.a>
      ))}
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export default function CustomerSupportSection() {
  return (
    <section className="w-full bg-beige-50 py-20 lg:py-28 border-t border-primary-100">
      <Container>
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] text-primary-400 uppercase tracking-widest font-medium mb-3">
            Customer Support
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-primary-900 mb-4">
            Support That Understands
            <br className="hidden sm:block" /> Your Style
          </h2>
          <p className="text-base text-primary-500 leading-relaxed">
            Ask about size, order status, customization, payment, or design
            advice through a smart customer support assistant.
          </p>
        </motion.div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <SupportChat />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
          >
            {/* Right header */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-primary-500 mb-1">
                What we help with
              </p>
              <p className="text-sm text-primary-400 leading-relaxed max-w-sm">
                Our AI support assistant handles the full customer journey —
                from pre-purchase questions to post-delivery requests.
              </p>
            </div>
            <FeatureCards />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
