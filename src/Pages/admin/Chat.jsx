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


/* ========================================
   CHAT MODERATION
   ======================================== */

/*
  Basic list of inappropriate words/phrases. Can add or remove words from this list.
*/
const INAPPROPRIATE_WORDS = [
  "fuck",
  "fucking",
  "fucked",
  "shit",
  "shitty",
  "bitch",
  "bastard",
  "asshole",
  "dick",
  "dumbass",
  "bullshit",
  "motherfucker",
  "cunt",
  "slut",
  "whore",
];


/*
  Checks whether a message contains inappropriate
  language.
*/
function containsInappropriateContent(text) {
  if (!text) {
    return false;
  }

  const normalized =
    text
      .toLowerCase()
      .replace(
        /[\s._\-*]+/g,
        ""
      );

  return INAPPROPRIATE_WORDS.some(
    (word) =>
      normalized.includes(
        word
      )
  );
}


/* ========================================
   MESSAGE TIME
   ======================================== */

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


/* ========================================
   CHAT PREVIEW TIME
   ======================================== */

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


/* ========================================
   MONEY
   ======================================== */

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


/* ========================================
   FILE EXTENSION
   ======================================== */

function getExtension(file) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  return extension || "file";
}


/* ========================================
   ATTACHMENT VALIDATION
   ======================================== */

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


/* ========================================
   MAIN COMPONENT
   ======================================== */

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

  const [
    deletingId,
    setDeletingId,
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
     SIGN ATTACHMENT URLS
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


  /* ========================================
     INITIAL CHAT LOAD
     ======================================== */

  useEffect(() => {

    fetchChats();

  }, [
    fetchChats,
  ]);


  /* ========================================
     REALTIME CONVERSATIONS
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


  /* ========================================
     REALTIME MESSAGES
     ======================================== */

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


  /* ========================================
     AUTO SCROLL
     ======================================== */

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

      setError("");

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
     SEND TEXT MESSAGE
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


      /* ------------------------------------
         CLOSED CONVERSATION CHECK
         ------------------------------------ */

      if (
        selectedChat.status ===
        "Closed"
      ) {

        setError(
          "This conversation is closed."
        );

        return;
      }


      /* ------------------------------------
         MODERATION CHECK
         ------------------------------------ */

      if (
        containsInappropriateContent(
          trimmed
        )
      ) {

        setError(
          "Your message contains inappropriate language. Please remove it before sending."
        );

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

        console.error(
          sendError
        );

        setError(
          "Unable to send message."
        );

      } else {

        setMessage("");

      }


      setSending(false);

    };


  /* ========================================
     SEND ATTACHMENT
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


      if (
        selectedChat.status ===
        "Closed"
      ) {

        setError(
          "This conversation is closed."
        );

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
     DELETE MESSAGE
     ======================================== */

  const deleteMessage =
    async (msg) => {

      if (
        deletingId ||
        !msg?.id
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this message?"
        );


      if (!confirmed) {
        return;
      }


      setDeletingId(
        msg.id
      );

      setError("");


      /*
        Delete the message row first.

        This prevents a situation where the
        attachment is deleted successfully but
        the database message remains.
      */
      const {
        error:
          deleteError,
      } =
        await supabase
          .from(
            "chat_messages"
          )
          .delete()
          .eq(
            "id",
            msg.id
          );


      if (deleteError) {

        console.error(
          "Message deletion error:",
          deleteError
        );

        setError(
          deleteError.message ||
            "Unable to delete message."
        );

        setDeletingId(
          null
        );

        return;
      }


      /*
        The database message has successfully
        been deleted.

        If the message had an attachment,
        clean up the corresponding Storage file.

        A Storage cleanup failure does not restore
        the already-deleted message.
      */
      if (
        msg.attachment_path
      ) {

        const {
          error:
            storageError,
        } =
          await supabase
            .storage
            .from(
              ATTACHMENT_BUCKET
            )
            .remove([
              msg.attachment_path,
            ]);


        if (storageError) {

          console.error(
            "Attachment cleanup error:",
            storageError
          );

        }

      }


      /*
        Refresh the conversation and chat list.
      */
      await fetchMessages(
        selectedChat.id,
        false
      );

      await fetchChats();


      setDeletingId(
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


  /* ========================================
     SEARCH
     ======================================== */

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


  /* ========================================
     RENDER
     ======================================== */

  return (
    <div className="chat-page">

      <header className="chat-page-header">

        <h1>
          Chat
        </h1>

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

        {/* ====================================
            CHAT SIDEBAR
            ==================================== */}

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


        {/* ====================================
            CONVERSATION
            ==================================== */}

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

              {/* ==================================
                  CONVERSATION HEADER
                  ================================== */}

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


              {/* ==================================
                  MESSAGES
                  ================================== */}

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

                        {/* =================================
                            DELETE MESSAGE
                            ================================= */}

                        <button
                          type="button"
                          className="delete-message-btn"
                          disabled={
                            deletingId ===
                            msg.id
                          }
                          onClick={() =>
                            deleteMessage(
                              msg
                            )
                          }
                          aria-label="Delete message"
                          title="Delete message"
                        >

                          {deletingId ===
                          msg.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>


                        {/* =================================
                            PAYMENT RECEIPT
                            ================================= */}

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

                          /* =================================
                             NORMAL ATTACHMENT
                             ================================= */

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

                          /* =================================
                             NORMAL TEXT MESSAGE
                             ================================= */

                          <div className="message-bubble">

                            <p>
                              {msg.message_text}
                            </p>


                            {containsInappropriateContent(
                              msg.message_text
                            ) && (

                              <div className="moderation-warning">
                                ⚠ Inappropriate content detected
                              </div>

                            )}


                            <div className="message-meta">

                              <small>
                                {formatMessageTime(
                                  msg.created_at
                                )}
                              </small>

                            </div>

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


              {/* ==================================
                  MESSAGE FORM
                  ================================== */}

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