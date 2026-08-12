import { useState } from "react";

function AdminChat() {
  const [messages, setMessages] = useState([
    {
      sender: "admin",
      text:
        "Hello! Welcome to PolChat Garden Resort support. How may we assist you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: trimmedMessage,
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

      {/* ADMIN HEADER */}
      <div className="chat-header">

        <div className="chat-avatar admin-avatar">
          A
        </div>

        <div>
          <h2>Resort Admin</h2>

          <p>
            PolChat Garden Resort Support
          </p>
        </div>

        <span className="admin-status">
          Staff Support
        </span>

      </div>

      {/* TEMPORARY NOTICE */}
      <div className="development-notice">
        This chat interface is currently in development.
        Messages will be connected to the resort administrator
        once the system database is integrated.
      </div>

      {/* MESSAGES */}
      <div className="chat-messages admin-messages">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${
              message.sender === "admin"
                ? "bot"
                : "user"
            }`}
          >

            {message.sender === "admin" && (
              <div className="message-avatar admin-message-avatar">
                A
              </div>
            )}

            <div
              className={`message-bubble ${
                message.sender === "admin"
                  ? "bot"
                  : "user"
              }`}
            >
              {message.text}
            </div>

          </div>
        ))}

      </div>

      {/* MESSAGE BOX */}
      <div className="chat-input-container">

        <input
          type="text"
          placeholder="Type a message to the resort admin..."
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="chat-send-button"
          onClick={handleSend}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default AdminChat;