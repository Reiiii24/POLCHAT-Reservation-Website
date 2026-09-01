// This file shows the admin chat page for customer conversations.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../../lib/supabaseClient";

import "./Chat.css";


const ATTACHMENT_BUCKET =
  "chat-attachments";


function formatMessageTime(dateString) {
  if (!dateString) {
    return "";
  }

  return new Date(
    dateString
  ).toLocaleTimeString(
    "en-PH",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


function formatPreviewTime(dateString) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(dateString);

  const now =
    new Date();

  const sameDay =
    date.getFullYear() ===
      now.getFullYear() &&
    date.getMonth() ===
      now.getMonth() &&
    date.getDate() ===
      now.getDate();

  if (sameDay) {
    return formatMessageTime(
      dateString
    );
  }

  return date.toLocaleDateString(
    "en-PH",
    {
      month: "short",
      day: "numeric",
    }
  );
}


function formatMoney(value) {
  return Number(
    value || 0
  ).toLocaleString(
    "en-PH",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}


function getExtension(file) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  return extension || "file";
}


function validAttachment(file) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  return (
    allowed.includes(
      file.type
    ) &&
    file.size <=
      5 * 1024 * 1024
  );
}


export default function Chat() {
  const [chats, setChats] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedChat,
    setSelectedChat,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    messagesLoading,
    setMessagesLoading,
  ] = useState(false);

  const [sending, setSending] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    reviewingId,
    setReviewingId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [
    mobileConversationOpen,
    setMobileConversationOpen,
  ] = useState(false);

  const messagesEndRef =
    useRef(null);

  const attachmentInputRef =
    useRef(null);


  /* ========================================
     FETCH CONVERSATIONS
     ======================================== */

  const fetchChats =
    useCallback(async () => {
      const {
        data,
        error: fetchError,
      } = await supabase
        .from(
          "chat_conversations"
        )
        .select(`
          id,
          access_token,
          customer_name,
          customer_email,
          reservation_id,
          status,
          last_message_preview,
          last_message_at,
          unread_admin,
          created_at,
          reservations (
            id,
            reservation_type,
            reservation_date,
            status
          )
        `)
        .order(
          "last_message_at",
          {
            ascending: false,
            nullsFirst: false,
          }
        );


      if (fetchError) {
        console.error(
          fetchError
        );

        setError(
          "Unable to load conversations."
        );

        setLoading(false);

        return;
      }


      const rows =
        data || [];

      setChats(rows);


      setSelectedChat(
        (current) => {
          if (!current) {
            return current;
          }

          return (
            rows.find(
              (item) =>
                item.id ===
                current.id
            ) || current
          );
        }
      );


      setLoading(false);
    }, []);


  /* ========================================
     SIGN ATTACHMENTS
     ======================================== */

  const addSignedUrls =
    useCallback(
      async (rows) => {
        return Promise.all(
          rows.map(
            async (item) => {
              if (
                !item.attachment_path
              ) {
                return item;
              }


              const {
                data,
                error:
                  urlError,
              } =
                await supabase
                  .storage
                  .from(
                    ATTACHMENT_BUCKET
                  )
                  .createSignedUrl(
                    item.attachment_path,
                    3600
                  );


              if (urlError) {
                console.error(
                  "Signed URL error:",
                  urlError
                );

                return {
                  ...item,
                  attachment_url:
                    null,
                };
              }


              return {
                ...item,

                attachment_url:
                  data.signedUrl,
              };
            }
          )
        );
      },
      []
    );


  /* ========================================
     FETCH MESSAGES
     ======================================== */

  const fetchMessages =
    useCallback(
      async (
        conversationId,
        showLoader = true
      ) => {
        if (!conversationId) {
          return;
        }


        if (showLoader) {
          setMessagesLoading(
            true
          );
        }


        const {
          data,
          error:
            fetchError,
        } =
          await supabase
            .from(
              "chat_messages"
            )
            .select(`
              id,
              conversation_id,
              sender_type,
              message_type,
              message_text,
              attachment_path,
              attachment_name,
              attachment_mime,
              payment_method,
              payment_amount,
              payment_reference,
              payment_status,
              payment_reviewed_at,
              created_at
            `)
            .eq(
              "conversation_id",
              conversationId
            )
            .order(
              "created_at",
              {
                ascending: true,
              }
            );


        if (fetchError) {
          console.error(
            fetchError
          );

          setError(
            "Unable to load this conversation."
          );

          setMessagesLoading(
            false
          );

          return;
        }


        const signed =
          await addSignedUrls(
            data || []
          );


        setMessages(
          signed
        );

        setMessagesLoading(
          false
        );
      },
      [
        addSignedUrls,
      ]
    );


  useEffect(() => {
    fetchChats();
  }, [
    fetchChats,
  ]);


  /* ========================================
     REALTIME
     ======================================== */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          "admin-chat-conversations"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "chat_conversations",
          },
          fetchChats
        )
        .subscribe();


    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    fetchChats,
  ]);


  useEffect(() => {
    if (!selectedChat?.id) {
      return undefined;
    }


    const conversationId =
      selectedChat.id;


    const channel =
      supabase
        .channel(
          `admin-messages-${conversationId}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "chat_messages",
            filter:
              `conversation_id=eq.${conversationId}`,
          },
          () => {
            fetchMessages(
              conversationId,
              false
            );

            fetchChats();
          }
        )
        .subscribe();


    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    selectedChat?.id,
    fetchMessages,
    fetchChats,
  ]);


  useEffect(() => {
    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, [
    messages,
  ]);


  /* ========================================
     SELECT CHAT
     ======================================== */

  const selectChat =
    async (chat) => {
      setSelectedChat(chat);

      setMobileConversationOpen(
        true
      );

      await fetchMessages(
        chat.id
      );


      if (
        chat.unread_admin > 0
      ) {
        await supabase
          .from(
            "chat_conversations"
          )
          .update({
            unread_admin: 0,
          })
          .eq(
            "id",
            chat.id
          );

        fetchChats();
      }
    };


  /* ========================================
     SEND TEXT
     ======================================== */

  const sendMessage =
    async (event) => {
      event.preventDefault();

      const trimmed =
        message.trim();


      if (
        !trimmed ||
        !selectedChat ||
        sending
      ) {
        return;
      }


      setSending(true);

      setError("");


      const {
        error:
          sendError,
      } =
        await supabase
          .from(
            "chat_messages"
          )
          .insert({
            conversation_id:
              selectedChat.id,

            sender_type:
              "admin",

            message_type:
              "text",

            message_text:
              trimmed,
          });


      if (sendError) {
        setError(
          "Unable to send message."
        );
      } else {
        setMessage("");
      }


      setSending(false);
    };


  /* ========================================
     ADMIN ATTACHMENT / QR
     ======================================== */

  const sendAttachment =
    async (file) => {
      if (
        !file ||
        !selectedChat ||
        uploading
      ) {
        return;
      }


      if (!validAttachment(file)) {
        setError(
          "Attachments must be JPG, PNG, WEBP, or PDF and 5 MB or smaller."
        );

        return;
      }


      setUploading(true);

      setError("");


      const path =
        `${selectedChat.access_token}/` +
        `${Date.now()}-` +
        `${Math.random()
          .toString(36)
          .slice(2, 9)}.` +
        getExtension(file);


      const {
        error:
          uploadError,
      } =
        await supabase
          .storage
          .from(
            ATTACHMENT_BUCKET
          )
          .upload(
            path,
            file,
            {
              upsert: false,
              contentType:
                file.type,
            }
          );


      if (uploadError) {
        console.error(
          uploadError
        );

        setError(
          "Unable to upload attachment."
        );

        setUploading(false);

        return;
      }


      const {
        error:
          messageError,
      } =
        await supabase
          .from(
            "chat_messages"
          )
          .insert({
            conversation_id:
              selectedChat.id,

            sender_type:
              "admin",

            message_type:
              "attachment",

            attachment_path:
              path,

            attachment_name:
              file.name,

            attachment_mime:
              file.type,
          });


      if (messageError) {
        await supabase
          .storage
          .from(
            ATTACHMENT_BUCKET
          )
          .remove([
            path,
          ]);

        setError(
          "Unable to send attachment."
        );
      }


      setUploading(false);
    };


  /* ========================================
     CONFIRM / REJECT PAYMENT
     ======================================== */

  const reviewPayment =
    async (
      messageId,
      decision
    ) => {
      if (reviewingId) {
        return;
      }


      setReviewingId(
        messageId
      );

      setError("");


      const {
        error:
          reviewError,
      } =
        await supabase.rpc(
          "review_chat_payment",
          {
            p_message_id:
              messageId,

            p_decision:
              decision,
          }
        );


      if (reviewError) {
        console.error(
          reviewError
        );

        setError(
          reviewError.message ||
            "Unable to review payment."
        );

        setReviewingId(
          null
        );

        return;
      }


      await fetchMessages(
        selectedChat.id,
        false
      );

      await fetchChats();


      setReviewingId(
        null
      );
    };


  /* ========================================
     CLOSE / OPEN CHAT
     ======================================== */

  const toggleConversation =
    async () => {
      if (!selectedChat) {
        return;
      }


      const nextStatus =
        selectedChat.status ===
        "Open"
          ? "Closed"
          : "Open";


      const {
        error:
          updateError,
      } =
        await supabase
          .from(
            "chat_conversations"
          )
          .update({
            status:
              nextStatus,
          })
          .eq(
            "id",
            selectedChat.id
          );


      if (updateError) {
        setError(
          "Unable to update conversation."
        );

        return;
      }


      fetchChats();
    };


  const searchText =
    search
      .trim()
      .toLowerCase();


  const filteredChats =
    chats.filter(
      (chat) =>
        !searchText ||
        chat.customer_name
          ?.toLowerCase()
          .includes(
            searchText
          ) ||
        chat.customer_email
          ?.toLowerCase()
          .includes(
            searchText
          )
    );


  return (
    <div className="chat-page">

      <header className="chat-page-header">
        <h1>Chat</h1>

        <p>
          Communicate with guests and verify payment submissions.
        </p>
      </header>


      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}


      <div
        className={`chat-container ${
          mobileConversationOpen
            ? "mobile-conversation-open"
            : ""
        }`}
      >

        <aside className="chat-sidebar">

          <div className="chat-search">
            <input
              type="text"
              placeholder="Search guests..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>


          <div className="chat-list">

            {loading ? (
              <div className="chat-no-results">
                Loading conversations...
              </div>

            ) : filteredChats.length === 0 ? (
              <div className="chat-no-results">
                No conversations found.
              </div>

            ) : (
              filteredChats.map(
                (chat) => (
                  <button
                    type="button"
                    key={chat.id}
                    className={`chat-preview ${
                      selectedChat?.id ===
                      chat.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      selectChat(
                        chat
                      )
                    }
                  >
                    <div className="chat-avatar">
                      {chat.customer_name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div className="chat-preview-content">

                      <div className="chat-preview-top">
                        <strong>
                          {chat.customer_name}
                        </strong>

                        <small>
                          {formatPreviewTime(
                            chat.last_message_at ||
                              chat.created_at
                          )}
                        </small>
                      </div>


                      <div className="chat-preview-bottom">
                        <span>
                          {chat.last_message_preview ||
                            "New conversation"}
                        </span>

                        {chat.unread_admin >
                          0 && (
                          <b className="chat-unread">
                            {chat.unread_admin}
                          </b>
                        )}
                      </div>

                    </div>
                  </button>
                )
              )
            )}

          </div>

        </aside>


        <section className="chat-conversation">

          {!selectedChat ? (

            <div className="chat-empty-conversation">
              <h2>
                Select a conversation
              </h2>

              <p>
                Choose a guest to view their messages.
              </p>
            </div>

          ) : (

            <>

              <div className="conversation-header">

                <button
                  type="button"
                  className="conversation-back-button"
                  onClick={() =>
                    setMobileConversationOpen(
                      false
                    )
                  }
                >
                  ‹
                </button>


                <div className="chat-avatar large">
                  {selectedChat.customer_name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>


                <div className="conversation-person">

                  <h2>
                    {selectedChat.customer_name}
                  </h2>

                  <p>
                    {selectedChat.customer_email}
                  </p>

                  {selectedChat.reservations && (
                    <small className="conversation-booking">
                      {
                        selectedChat
                          .reservations
                          .reservation_type
                      }
                      {" • "}
                      {
                        selectedChat
                          .reservations
                          .status
                      }
                    </small>
                  )}

                </div>


                <div className="conversation-header-actions">

                  <span
                    className={`conversation-status ${
                      selectedChat.status ===
                      "Open"
                        ? "open"
                        : "closed"
                    }`}
                  >
                    {selectedChat.status}
                  </span>


                  <button
                    type="button"
                    className="conversation-status-button"
                    onClick={
                      toggleConversation
                    }
                  >
                    {selectedChat.status ===
                    "Open"
                      ? "Close"
                      : "Reopen"}
                  </button>

                </div>

              </div>


              <div className="messages">

                {messagesLoading ? (
                  <div className="chat-message-loading">
                    Loading messages...
                  </div>

                ) : messages.length === 0 ? (
                  <div className="chat-message-loading">
                    No messages yet.
                  </div>

                ) : (
                  messages.map(
                    (msg) => (
                      <div
                        key={msg.id}
                        className={`message-row ${
                          msg.sender_type ===
                          "admin"
                            ? "admin-message"
                            : "guest-message"
                        }`}
                      >

                        {msg.message_type ===
                        "payment_receipt" ? (

                          <div className="payment-receipt-card">

                            {msg.attachment_url &&
                              msg.attachment_mime
                                ?.startsWith(
                                  "image/"
                                ) && (

                              <a
                                href={
                                  msg.attachment_url
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={
                                    msg.attachment_url
                                  }
                                  alt="Payment receipt"
                                />
                              </a>
                            )}


                            <div className="payment-receipt-details">

                              <span className="payment-receipt-label">
                                Payment Receipt
                              </span>

                              <strong className="payment-receipt-amount">
                                ₱
                                {formatMoney(
                                  msg.payment_amount
                                )}
                              </strong>

                              <p>
                                {
                                  msg.payment_method
                                }
                              </p>

                              <p>
                                Ref. No.{" "}
                                <strong>
                                  {
                                    msg.payment_reference
                                  }
                                </strong>
                              </p>


                              <div
                                className={`payment-verification-status ${
                                  msg.payment_status?.toLowerCase()
                                }`}
                              >

                                {msg.payment_status ===
                                "Verified"
                                  ? "✓ Transfer Confirmed"
                                  : msg.payment_status ===
                                    "Rejected"
                                  ? "✕ Proof Rejected"
                                  : "Awaiting Verification"}

                              </div>


                              {msg.payment_status ===
                                "Verified" && (
                                <small>
                                  Verified by Resort Admin
                                </small>
                              )}


                              {msg.payment_status ===
                                "Pending" && (

                                <div className="payment-verification-actions">

                                  <button
                                    type="button"
                                    className="confirm-transfer-btn"
                                    disabled={
                                      reviewingId ===
                                      msg.id
                                    }
                                    onClick={() =>
                                      reviewPayment(
                                        msg.id,
                                        "Verified"
                                      )
                                    }
                                  >
                                    Confirm Transfer
                                  </button>


                                  <button
                                    type="button"
                                    className="reject-transfer-btn"
                                    disabled={
                                      reviewingId ===
                                      msg.id
                                    }
                                    onClick={() =>
                                      reviewPayment(
                                        msg.id,
                                        "Rejected"
                                      )
                                    }
                                  >
                                    Reject Proof
                                  </button>

                                </div>
                              )}

                            </div>

                          </div>

                        ) : msg.message_type ===
                          "attachment" ? (

                          <div className="chat-attachment-card">

                            {msg.attachment_url &&
                            msg.attachment_mime
                              ?.startsWith(
                                "image/"
                              ) ? (

                              <a
                                href={
                                  msg.attachment_url
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={
                                    msg.attachment_url
                                  }
                                  alt={
                                    msg.attachment_name
                                  }
                                />
                              </a>

                            ) : (

                              <a
                                href={
                                  msg.attachment_url
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open attachment
                              </a>
                            )}

                            <small>
                              {
                                msg.attachment_name
                              }
                            </small>

                          </div>

                        ) : (

                          <div className="message-bubble">
                            <p>
                              {msg.message_text}
                            </p>

                            <small>
                              {formatMessageTime(
                                msg.created_at
                              )}
                            </small>
                          </div>
                        )}

                      </div>
                    )
                  )
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>


              <form
                className="message-form"
                onSubmit={
                  sendMessage
                }
              >

                <input
                  ref={
                    attachmentInputRef
                  }
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={(event) => {
                    const file =
                      event.target
                        .files?.[0];

                    if (file) {
                      sendAttachment(
                        file
                      );
                    }

                    event.target.value =
                      "";
                  }}
                />


                <button
                  type="button"
                  className="chat-attach-btn"
                  disabled={
                    selectedChat.status ===
                      "Closed" ||
                    uploading
                  }
                  onClick={() =>
                    attachmentInputRef
                      .current
                      ?.click()
                  }
                >
                  {uploading
                    ? "..."
                    : "Attach"}
                </button>


                <input
                  type="text"
                  placeholder={
                    selectedChat.status ===
                    "Closed"
                      ? "Conversation is closed"
                      : "Type your message..."
                  }
                  value={message}
                  disabled={
                    selectedChat.status ===
                      "Closed" ||
                    sending
                  }
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                />


                <button
                  type="submit"
                  disabled={
                    selectedChat.status ===
                      "Closed" ||
                    sending ||
                    !message.trim()
                  }
                >
                  {sending
                    ? "Sending..."
                    : "Send"}
                </button>

              </form>

            </>
          )}

        </section>

      </div>

    </div>
  );
}