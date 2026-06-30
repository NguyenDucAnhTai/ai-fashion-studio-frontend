import { ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function FinalCTASection() {
  return (
    <section className="relative w-full overflow-hidden bg-primary-900 py-28 lg:py-36 flex items-center justify-center">
      {/* Purple glow blobs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.18) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.10) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-8 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-accent-300 text-[10px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            Start for free today
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display font-semibold text-white leading-[1.1] mb-6 text-balance">
            Create a Look That
            <br />
            <span className="italic text-accent-300">Actually Fits You</span>
          </h2>

          <p className="text-base sm:text-lg text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
            Start with your body profile, get fashion guidance, build your
            outfit, and preview it before buying.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 bg-accent-300 text-primary-900 font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-accent-400 transition-colors shadow-accent"
            >
              Start Fit Preview
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 border border-white/25 text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-white/8 hover:border-white/40 transition-all"
            >
              <UserPlus size={15} />
              Create Account
            </motion.button>
          </div>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-14 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: "50K+", label: "Users Styled" },
            { value: "200K+", label: "Designs Created" },
            { value: "4.9/5", label: "Avg. Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-semibold text-white">{value}</p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
