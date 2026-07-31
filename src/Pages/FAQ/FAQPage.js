import { useMemo, useState } from "react";
import "./FAQPage.css";
import Background from "../../Assets/Background.png";

/*
  Change the answers below once the resort's official
  policies and information have been finalized.
*/
const faqItems = [
  {
    id: "reservation",
    icon: "calendar",
    question: "How do I make a reservation?",
    answer:
      "You can make a reservation online through our website using the booking form. Fill in your details, choose your preferred date, and we will confirm your booking.",
  },
  {
    id: "check-in",
    icon: "clock",
    question: "What are your check-in and check-out times?",
    answer:
      "The official check-in and check-out schedule will be provided during booking confirmation. You may also contact the resort for the latest schedule.",
  },
  {
    id: "guest-limit",
    icon: "users",
    question: "What is the maximum number of guests allowed?",
    answer:
      "The maximum number of guests depends on the selected room, cottage, or resort package. The allowed capacity will be shown during the reservation process.",
  },
  {
    id: "payment",
    icon: "card",
    question: "What payment methods do you accept?",
    answer:
      "PolChat Garden Resort accepts GCash and online bank transfers. Complete payment instructions will be provided after your reservation request is reviewed.",
  },
  {
    id: "pets",
    icon: "paw",
    question: "Are pets allowed in the resort?",
    answer:
      "Please contact the resort before bringing a pet. Pet approval may depend on the resort's current policies, the type of pet, and the selected accommodation.",
  },
  {
    id: "corkage",
    icon: "info",
    question: "Do you have corkage fees for food and drinks?",
    answer:
      "Corkage fees may apply to outside food and beverages. Contact the resort for the current rates and items covered by the corkage policy.",
  },
  {
    id: "deposit",
    icon: "shield",
    question: "Is there a security deposit?",
    answer:
      "A security or reservation deposit may be required depending on the selected package. The amount and refund conditions will be explained before payment.",
  },
];

/*
  These are simple built-in SVG icons.
  No additional icon package is required.
*/
function FAQIcon({ name }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  switch (name) {
    case "calendar":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <path d="M8 14h2M14 14h2M8 18h2" />
        </svg>
      );

    case "clock":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "users":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3.5 19c.5-3.2 2.5-5 5.5-5s5 1.8 5.5 5" />
          <path d="M14 15c3.2-.4 5.5 1.1 6.2 4" />
        </svg>
      );

    case "card":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18M7 15h4" />
        </svg>
      );

    case "paw":
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="16" rx="4.5" ry="3.5" />
          <circle cx="7" cy="10" r="1.8" />
          <circle cx="11" cy="7.5" r="1.8" />
          <circle cx="15" cy="8" r="1.8" />
          <circle cx="18" cy="11" r="1.8" />
        </svg>
      );

    case "info":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6M12 7.5h.01" />
        </svg>
      );

    case "shield":
      return (
        <svg {...commonProps}>
          <path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        </svg>
      );

    case "headset":
      return (
        <svg {...commonProps}>
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <rect x="3" y="13" width="4" height="6" rx="2" />
          <rect x="17" y="13" width="4" height="6" rx="2" />
          <path d="M17 19c-1 2-2.5 2-5 2" />
        </svg>
      );

    case "chat":
      return (
        <svg {...commonProps}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.5-4A8.5 8.5 0 1 1 21 12Z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...commonProps}>
          <path d="m7 10 5 5 5-5" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...commonProps}>
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg>
      );

    default:
      return null;
  }
}

function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openId, setOpenId] = useState("reservation");

  const visibleFaqs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return faqItems;
    }

    return faqItems.filter((item) => {
      return (
        item.question.toLowerCase().includes(normalizedSearch) ||
        item.answer.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm]);

  const toggleQuestion = (id) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <main
      className="faq-page"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="faq-page-content">
        <section className="faq-introduction">
          <div className="faq-heading-section">
            <p className="faq-eyebrow">PolChat Garden Resort</p>

            <h1>FAQs</h1>

            <p className="faq-subtitle">
              Find quick answers to common questions about PolChat Garden
              Resort.
            </p>

            <div className="faq-heading-decoration">
              <span>❧</span>
            </div>
          </div>

          <div className="faq-search-container">
            <FAQIcon name="search" />

            <input
              type="search"
              value={searchTerm}
              placeholder="Search questions..."
              aria-label="Search frequently asked questions"
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <span className="faq-search-decoration" aria-hidden="true">
              ❧
            </span>
          </div>
        </section>

        <section className="faq-panel" aria-label="Frequently asked questions">
          <div className="faq-list">
            {visibleFaqs.length > 0 ? (
              visibleFaqs.map((item) => {
                const isOpen = openId === item.id;
                const answerId = `faq-answer-${item.id}`;

                return (
                  <article
                    className={`faq-item ${isOpen ? "is-open" : ""}`}
                    key={item.id}
                  >
                    <button
                      className="faq-question-row"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleQuestion(item.id)}
                    >
                      <span className="faq-icon-container">
                        <FAQIcon name={item.icon} />
                      </span>

                      <span className="faq-question">{item.question}</span>

                      <span
                        className={`faq-toggle ${isOpen ? "is-open" : ""}`}
                      >
                        <FAQIcon name="chevron" />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="faq-answer" id={answerId}>
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="faq-no-results">
                <h2>No questions found</h2>
                <p>Try searching with a different word or phrase.</p>
              </div>
            )}
          </div>

          <div className="faq-contact-card">
            <div className="faq-contact-icon">
              <FAQIcon name="headset" />
            </div>

            <div className="faq-contact-message">
              <h2>Still have questions?</h2>
              <p>We're happy to help! Contact us for more information.</p>
            </div>

            <div className="faq-contact-divider" />

            {/*
              This is only a visual button for now.
              It can later become a React Router Link.
            */}
            <button className="faq-contact-button" type="button">
              Contact Us
              <FAQIcon name="arrow" />
            </button>

            <span className="faq-contact-decoration" aria-hidden="true">
              ❧
            </span>
          </div>
        </section>
      </div>

      <button
        className="faq-chat-button"
        type="button"
        aria-label="Open resort chat"
      >
        <FAQIcon name="chat" />
      </button>
    </main>
  );
}

export default FAQPage;