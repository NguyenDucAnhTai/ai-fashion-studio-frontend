import { ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FinalCTASection() {
  return (
    <section className="relative w-full overflow-hidden bg-primary-900 py-28 lg:py-36 flex items-center justify-center">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.18) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 px-4 sm:px-8 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-accent-300 text-[10px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            Start from catalog
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display font-semibold text-white leading-[1.1] mb-6 text-balance">
            Create a Look That
            <br />
            <span className="italic text-accent-300">Actually Fits You</span>
          </h2>

          <p className="text-base sm:text-lg text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
            Choose a T-shirt, save a design, preview it with AI Try-On, then order and pay through the platform flow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="group flex items-center gap-2 bg-accent-300 text-primary-900 font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-accent-400 transition-colors shadow-accent"
            >
              View Products
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 border border-white/25 text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-white/8 hover:border-white/40 transition-all"
            >
              <UserPlus size={15} />
              Create Account
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-8 mt-14 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: "Catalog", label: "Public Browsing" },
            { value: "Try-On", label: "Async Preview" },
            { value: "PayOS", label: "Payment Ready" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-semibold text-white">{value}</p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
