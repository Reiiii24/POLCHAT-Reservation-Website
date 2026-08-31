import { useState } from "react";

const quickQuestions = [
  {
    id: 1,
    question: "How do I make a reservation?",
    answer:
      "To make a reservation, go to the Reservation page, fill in the required information, select your preferred reservation date and booking type, then submit your request. Please wait for confirmation from the resort before considering the reservation final.",
  },

  {
    id: 2,
    question: "What reservation types are available?",
    answer:
      "PolChat Garden Resort currently offers three reservation options: Day Tour, Overnight, and 22 Hours.",
  },

  {
    id: 3,
    question: "How many guests are allowed?",
    answer:
      "The base rate covers up to 20 guests. Additional guests are charged ₱200 per person. Day Tour can accommodate up to 60 guests, Overnight can accommodate up to 35 guests, and 22-Hour stays have a sleeping capacity of 25 guests.",
  },

  {
    id: 4,
  question: "What payment methods do you accept?",
  answer:
    "PolChat Garden Resort accepts GCash and online banking. Once your reservation request is accepted, payment instructions can be provided through Chat with Admin. Payments are manually verified by the resort administrator before the reservation is confirmed.",
  },

  {
    id: 5,
    question: "Is there a security deposit?",
    answer:
      "Yes. A ₱2,000 security deposit is required. It may be refunded within 24 hours after checkout after the resort verifies that there are no missing or damaged properties.",
  },

  {
     id: 6,
  question: "How much do I need to pay to reserve?",
  answer:
    "Reservation confirmation requires the applicable 50% down payment together with the ₱2,000 security deposit. Payment instructions will be provided by the resort administrator through the official chat.",

  },

  {
    id: 7,
    question: "Are there rules regarding noise and gatherings?",
    answer:
      "Yes. Guests are expected to maintain a comfortable and orderly environment. Loud, disruptive, or disorderly gatherings are discouraged to help the resort manage the property safely and comfortably.",
  },

  {
    id: 8,
    question: "Should guests bring their own items?",
    answer:
      "Guests are encouraged to bring their own personal essentials and preferred items for their stay.",
  },
];

function Chatbot({ switchToAdmin }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Hello! Welcome to PolChat Garden Resort. I can answer some of our most frequently asked questions. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");

  const addQuestionAndAnswer = (question, answer) => {
    setMessages((previousMessages) => [
      ...previousMessages,

      {
        sender: "user",
        text: question,
      },

      {
        sender: "bot",
        text: answer,
      },
    ]);
  };

  const findAutomaticResponse = (message) => {
    // Match broad customer wording before falling back to canned help text.
    const text = message.toLowerCase();

    if (
      text.includes("reserve") ||
      text.includes("reservation") ||
      text.includes("book")
    ) {
      return quickQuestions[0].answer;
    }

    if (
      text.includes("day tour") ||
      text.includes("overnight") ||
      text.includes("22 hour") ||
      text.includes("type")
    ) {
      return quickQuestions[1].answer;
    }

    if (
      text.includes("guest") ||
      text.includes("capacity") ||
      text.includes("pax") ||
      text.includes("people")
    ) {
      return quickQuestions[2].answer;
    }

    if (
      text.includes("payment") ||
      text.includes("pay") ||
      text.includes("gcash") ||
      text.includes("bank")
    ) {
      return quickQuestions[3].answer;
    }

    if (
      text.includes("deposit") ||
      text.includes("security")
    ) {
      return quickQuestions[4].answer;
    }

    if (
      text.includes("downpayment") ||
      text.includes("down payment") ||
      text.includes("50%")
    ) {
      return quickQuestions[5].answer;
    }

    if (
      text.includes("noise") ||
      text.includes("loud") ||
      text.includes("party") ||
      text.includes("rule")
    ) {
      return quickQuestions[6].answer;
    }

    if (
      text.includes("bring") ||
      text.includes("items") ||
      text.includes("essentials")
    ) {
      return quickQuestions[7].answer;
    }

    return (
      "I'm sorry, I don't have an automatic answer for that question yet. " +
      "You can try one of the suggested questions below or switch to Chat with Admin for further assistance."
    );
  };

  const handleSend = () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) {
      return;
    }

    const response =
      findAutomaticResponse(trimmedMessage);

    setMessages((previousMessages) => [
      ...previousMessages,

      {
        sender: "user",
        text: trimmedMessage,
      },

      {
        sender: "bot",
        text: response,
      },
    ]);

    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-content">

      {/* CHAT HEADER */}
      <div className="chat-header">

        <div className="chat-avatar bot-avatar">
          B
        </div>

        <div>
          <h2>PolChat Assistant</h2>

          <p>
            Automated help • Available anytime
          </p>
        </div>

        <span className="online-status">
          Online
        </span>

      </div>

      {/* MESSAGES */}
      <div className="chat-messages">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${message.sender}`}
          >
            {message.sender === "bot" && (
              <div className="message-avatar">
                B
              </div>
            )}

            <div
              className={`message-bubble ${message.sender}`}
            >
              {message.text}
            </div>
          </div>
        ))}

      </div>

      {/* QUICK QUESTIONS */}
      <div className="quick-help">

        <p className="quick-help-title">
          Frequently Asked Questions
        </p>

        <div className="quick-question-list">

          {quickQuestions.map((item) => (
            <button
              type="button"
              key={item.id}
              className="quick-question"
              onClick={() =>
                addQuestionAndAnswer(
                  item.question,
                  item.answer
                )
              }
            >
              {item.question}
            </button>
          ))}

        </div>

      </div>

      {/* ADMIN OPTION */}
      <div className="admin-help-box">

        <div>
          <strong>
            Still need help?
          </strong>

          <p>
            Speak directly with our resort staff.
          </p>
        </div>

        <button
          type="button"
          onClick={switchToAdmin}
        >
          Chat with Admin
        </button>

      </div>

      {/* MESSAGE INPUT */}
      <div className="chat-input-container">

        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          onClick={handleSend}
          className="chat-send-button"
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default Chatbot;