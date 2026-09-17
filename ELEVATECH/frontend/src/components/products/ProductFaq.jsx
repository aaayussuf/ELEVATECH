import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How do I know this product is genuine?",
    answer:
      "We sell 100% genuine products sourced from trusted distributors. Every review on this page comes from a customer who actually purchased the item — reviews are verified.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "Nairobi orders typically arrive in 1–2 days, and nationwide delivery takes 2–4 days. Delivery is FREE.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer easy returns. If you are not happy with your order, contact us and we will guide you through the process for a refund or replacement.",
  },
  {
    question: "Is checkout secure?",
    answer:
      "Yes. Checkout runs over an encrypted connection and supports M-PESA, Visa, Mastercard, and Stripe so you can pay the way you prefer.",
  },
  {
    question: "Is the warranty valid?",
    answer:
      "Yes. The warranty shown on this page is valid, and your account order history serves as proof of purchase.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Reach out to us through the contact options shown in the footer or on social media — our team is happy to help.",
  },
];

export default function ProductFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="mt-10 min-w-0 scroll-mt-24 sm:mt-12 md:mt-14 lg:mt-16"
    >
      <h2 className="text-lg font-bold leading-tight text-[#0F1111] sm:text-xl md:text-2xl">
        Frequently asked questions
      </h2>

      <div className="mt-4 min-w-0 space-y-2.5 sm:mt-6 sm:space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const open = openIndex === index;

          return (
            <div
              key={item.question}
              className="pdp-card w-full min-w-0 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
                aria-controls={`faq-answer-${index}`}
                className="flex min-h-12 w-full min-w-0 items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[#0F1111] transition hover:bg-black/[0.02] sm:min-h-14 sm:px-5 sm:py-4 sm:text-base"
              >
                <span className="min-w-0 flex-1 break-words leading-6">
                  {item.question}
                </span>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.03]">
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {open && (
                <p
                  id={`faq-answer-${index}`}
                  className="border-t border-black/5 px-4 py-3.5 text-sm leading-6 text-[#565959] sm:px-5 sm:py-4"
                >
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
