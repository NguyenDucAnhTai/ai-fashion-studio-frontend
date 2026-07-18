import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../shared/components/Container";

const FEEDBACKS = [
  {
    id: "fd-1",
    name: "Minh Anh",
    role: "Customer",
    comment:
      "The studio made it easy to save my T-shirt design before trying it on. The preview felt much safer than ordering blind.",
    product: "Oversized Cotton Tee",
  },
  {
    id: "fd-2",
    name: "Gia Bao",
    role: "Campus buyer",
    comment:
      "I picked a variant, adjusted the graphic, and the virtual try-on helped me choose the right size before checkout.",
    product: "Campus Daily",
  },
  {
    id: "fd-3",
    name: "Linh Tran",
    role: "Repeat customer",
    comment:
      "The whole flow from design to payment is clear. I can see why staff can print from the saved design instead of the try-on image.",
    product: "Minimal Essentials",
  },
];

export default function FeedbackPreview() {
  return (
    <section className="w-full border-t border-primary-100 bg-beige-50 py-20 lg:py-28">
      <Container>
        <motion.div
          className="mx-auto mb-14 max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-primary-400">
            Public Feedback
          </p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-primary-900 sm:text-4xl">
            Designs customers trust
          </h2>
          <p className="text-base leading-relaxed text-primary-500">
            Landing feedback will later connect to approved reviews from
            <span className="font-medium text-primary-700"> /feedbacks/public</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {FEEDBACKS.map((feedback, index) => (
            <motion.article
              key={feedback.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.08,
              }}
              className="flex min-h-72 flex-col rounded-3xl border border-primary-100 bg-white p-6 shadow-soft"
            >
              <div className="mb-6 flex items-center gap-1 text-accent-500">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={15} fill="currentColor" strokeWidth={1.5} />
                ))}
              </div>
              <p className="flex-1 text-sm leading-7 text-primary-600">
                {feedback.comment}
              </p>
              <div className="mt-8 border-t border-primary-100 pt-5">
                <p className="text-sm font-semibold text-primary-900">{feedback.name}</p>
                <p className="mt-1 text-xs text-primary-400">
                  {feedback.role} - {feedback.product}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
