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
    <section id="faq" className="mt-16 scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-bold text-[#0F1111]">
        Frequently asked questions
      </h2>

      <div className="mt-6 space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const open = openIndex === index;

          return (
            <div
              key={item.question}
              className="pdp-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-[#0F1111] font-semibold"
              >
                <span>{item.question}</span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <p className="px-5 py-4 text-sm text-[#565959] leading-6">
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