import { useState } from "react";
import StatusMessage from "./StatusMessage.jsx";
import useFetch from "../useFetch.js";

function FAQ() {
  const { data: faqList, loading, error, reload } = useFetch("/api/faqs");
  const [openId, setOpenId] = useState(null);

  const toggleQuestion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section aria-labelledby="faq-heading">
      <h1 id="faq-heading" className="page-title">
        Frequently Asked Questions
      </h1>

      <p className="page-subtitle">
        Quick answers to common campus questions.
      </p>

      <StatusMessage
        loading={loading}
        error={error}
        onRetry={reload}
        loadingText="Loading FAQs..."
      />

      {!loading && !error && faqList.length === 0 && (
        <div className="empty-state">
          <p>❓ No FAQs have been added yet.</p>
        </div>
      )}

      <div className="faq-list">
        {faqList.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className="faq-item">
              <h3>
                <button
                  className="faq-question"
                  onClick={() => toggleQuestion(item.id)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>

                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>

              {isOpen && (
                <p className="faq-answer">
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

export default FAQ;