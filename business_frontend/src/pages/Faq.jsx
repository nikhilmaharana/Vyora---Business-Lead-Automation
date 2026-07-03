import { useState } from "react";

import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
} from "react-icons/fa";

const faqData = [
  {
    question: "What is BusinessFlow?",
    answer:
      "BusinessFlow is a modern business automation platform that helps companies manage workflows, vendors, CRM, ERP, and automation tools efficiently.",
  },
  {
    question: "How does BusinessFlow help businesses?",
    answer:
      "We simplify operations by connecting businesses with smart automation tools, verified vendors, and digital workflow solutions.",
  },
  {
    question: "Can startups use BusinessFlow?",
    answer:
      "Yes. BusinessFlow is designed for startups, SMEs, and enterprises looking to automate and scale operations digitally.",
  },
  {
    question: "Do you provide vendor support?",
    answer:
      "Yes. Businesses can connect with trusted vendors and service providers across multiple categories.",
  },
  {
    question: "Is customer support available?",
    answer:
      "Absolutely. Our support team is available 24/7 to assist businesses with platform-related queries and services.",
  },
  {
    question: "What services are available on BusinessFlow?",
    answer:
      "We provide CRM solutions, ERP software, AI automation, inventory management, billing systems, marketing tools, and more.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="bg-white text-gray-900">


        {/* Hero Section */}
        <section className="px-4 sm:px-6 py-20">
          <div className="relative max-w-7xl mx-auto overflow-hidden rounded-4xl">

            {/* BACKGROUND IMAGE */}
            <img
              src="src/assets/banners.jpg"
              alt="FAQ Banner"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* CONTENT */}
            <div className="relative 
                            z-10 px-8 py-20 sm:px-16 
                            text-center
                             text-white">

              <span className="inline-block 
                              px-4 py-2 
                              rounded-full
                             bg-white/10 backdrop-blur-md 
                             text-sm font-medium
                              border border-white/20 
                              mb-6">
                Frequently Asked Questions
              </span>

              <h1 className="text-4xl sm:text-5xl 
                             font-bold 
                             leading-tight tracking-tight
                              max-w-4xl mx-auto">
                Answers To Common Questions
              </h1>

              <p className="mt-6 text-gray-300 text-lg
                            leading-8 
                            max-w-2xl mx-auto">
                Find answers to the most frequently asked questions about
                BusinessFlow, automation services, vendors, and platform support.
              </p>

            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">

          <div className="space-y-6">

            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-3xl 
                           overflow-hidden 
                           shadow-sm
                            transition-all"
              >

                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full 
                           flex items-center justify-between gap-6 
                           text-left 
                           px-6 sm:px-8 py-6
                          bg-white
                           hover:bg-gray-50 transition-all"
                >

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 min-w-12 
                                    rounded-2xl
                                   bg-green-100 
                                   flex items-center justify-center
                                    text-green-600 text-lg">
                      <FaQuestionCircle />
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className="text-gray-500 text-lg">
                    {openIndex === index ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-6 sm:px-8 pb-8 pl-24 text-gray-600 leading-8 text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <section className="px-4 sm:px-6 pb-20">

          <div className="max-w-7xl mx-auto
                       bg-gray-900 
                       rounded-4xl
                        p-10 sm:p-16
                       text-center text-white">

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Still Have Questions?
            </h2>

            <p className="mt-6
                       text-gray-300
                        text-lg 
                        max-w-2xl mx-auto 
                        leading-8">
              Our team is always ready to help you with automation,
              vendor support, and business solutions.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">

              <button className="px-7 py-3 rounded-2xl bg-green-500 hover:bg-green-600 transition-all text-white font-medium">
                Contact Support
              </button>

              <button className="px-7 py-3 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-all text-white font-medium">
                Explore Services
              </button>

            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;
