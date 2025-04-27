
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TouchFeedback } from '@/components/ui/ios-feedback';
import { triggerHapticFeedback } from '@/utils/platformUtils';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    triggerHapticFeedback();
  };

  return (
    <div 
      className="border-b border-gray-200 dark:border-gray-700 py-4 animate-fadeIn opacity-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <TouchFeedback onClick={toggleOpen} feedbackColor="#6366f1">
        <button 
          className="flex justify-between items-center w-full text-left focus:outline-none"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{question}</h3>
          {isOpen ? 
            <ChevronUp className="h-5 w-5 text-ems-600 dark:text-ems-400" /> : 
            <ChevronDown className="h-5 w-5 text-ems-600 dark:text-ems-400" />
          }
        </button>
      </TouchFeedback>
      
      {isOpen && (
        <div 
          id={`faq-answer-${index}`}
          className="mt-2 text-gray-600 dark:text-gray-300 transition-all duration-300"
        >
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What is the Fire & EMS Narrative Generator?",
      answer: "The Fire & EMS Narrative Generator is an AI-powered tool that helps emergency service professionals create accurate, compliant, and detailed narratives quickly and efficiently. It supports both Fire incident reports (NFIRS) and EMS patient care narratives (PCRs)."
    },
    {
      question: "How does it handle NFIRS reporting requirements?",
      answer: "Our system understands National Fire Incident Reporting System (NFIRS) requirements and helps generate compliant narratives that include all required elements, proper terminology, and consistent formatting according to department standards."
    },
    {
      question: "How much time can I save using this tool?",
      answer: "Most users report saving 15-20 minutes per report, which can translate to hours saved per shift depending on call volume. Fire departments with high call volumes often see the greatest time savings."
    },
    {
      question: "Is my patient and incident data secure and HIPAA compliant?",
      answer: "Yes, we take data security very seriously. Our system is fully HIPAA compliant, utilizes end-to-end encryption, and we never store patient-identifiable information."
    },
    {
      question: "Can I customize the narratives to my agency's specific protocols?",
      answer: "Yes, the system can be customized to follow your specific agency protocols and reporting requirements for both Fire and EMS documentation."
    },
    {
      question: "Does it work with existing ePCR and Fire reporting software?",
      answer: "Yes, our narrative generator creates text that can be copied and pasted into most electronic patient care reporting and fire incident reporting software systems."
    },
    {
      question: "How does the subscription work?",
      answer: "We offer a simple $10/month subscription with unlimited narrative generation for both Fire and EMS reports. You can cancel anytime with no long-term commitment."
    },
    {
      question: "Is there an admin access option for my organization?",
      answer: "Yes, we offer an admin panel for supervisors and organization administrators to manage team access and review generated narratives."
    }
  ];

  return (
    <section id="faq" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about our Fire & EMS Narrative Generator.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <TouchFeedback feedbackColor="#6366f1">
            <a 
              href="#"
              className="inline-flex items-center text-ems-600 dark:text-ems-400 hover:underline"
              aria-label="Contact support for more questions"
            >
              <span>Don't see your question? Contact our support team</span>
            </a>
          </TouchFeedback>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
