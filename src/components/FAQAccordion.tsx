import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: Props) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <section className="faq-item" key={item.question}>
            <h2 style={{ margin: 0 }}>
              <button
                className="faq-item__button"
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="faq-item__icon" aria-hidden="true" />
                <span>{item.question}</span>
              </button>
            </h2>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="faq-item__panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: .28, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <div
                    className="faq-item__answer"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
}
