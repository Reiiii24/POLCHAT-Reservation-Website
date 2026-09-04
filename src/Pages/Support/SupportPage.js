// This file shows the support page where users can get help.

import { useState } from "react";
import "./SupportPage.css";

import servicePageBg from "../../Assets/servicepagebg.png";
import Chatbot from "./Chatbot";
import AdminChat from "./AdminChat";

function SupportPage() {
  const [activeTab, setActiveTab] = useState("chatbot");

  return (
    <div
      className="support-page" /* Support page container for the background image with plants*/
           style={{ backgroundImage: `linear-gradient(rgba(13, 28, 17, 0), rgba(18, 38, 23, 0.76)), url(${servicePageBg})` }}
    >

      {/* PAGE HEADER */}
      <div className="support-header">
        <p className="support-small-title">
          POLCHAT GARDEN RESORT
        </p>

        <h1>Support Center</h1>

        <p className="support-subtitle">
          Get quick answers to common questions or speak directly
          with our resort staff for further assistance.
        </p>
      </div>

      {/* MAIN CHAT CONTAINER */}
      <div className="support-container">

        {/* TABS */}
        <div className="support-tabs">

          <button
            type="button"
            className={`support-tab ${
              activeTab === "chatbot" ? "active" : ""
            }`}
            onClick={() => setActiveTab("chatbot")}
          >
            <span className="tab-icon">●</span>
            Automated Help
          </button>

          <button
            type="button"
            className={`support-tab ${
              activeTab === "admin" ? "active" : ""
            }`}
            onClick={() => setActiveTab("admin")}
          >
            <span className="tab-icon">●</span>
            Chat with Admin
          </button>

        </div>

        {/* TAB CONTENT */}
        <div className="support-chat-area">

          {/* Swap between self-service help and the live admin chat view. */}
          {activeTab === "chatbot" ? (
            <Chatbot
              switchToAdmin={() => setActiveTab("admin")}
            />
          ) : (
            <AdminChat />
          )}

        </div>

      </div>

    </div>
  );
}

export default SupportPage;