import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../../lib/supabaseClient";


/* ==========================================
   SETTINGS
   ========================================== */

const CHAT_STORAGE_KEY =
  "polchat_customer_chat";

const ATTACHMENT_BUCKET =
  "chat-attachments";

const CHAT_SESSION_DAYS =
  30;

const CHAT_SESSION_DURATION =
  CHAT_SESSION_DAYS *
  24 *
  60 *
  60 *
  1000;


/* ==========================================
   FORMAT TIME
   ========================================== */

function formatTime(value) {
  if (!value) {
    return "";
  }

  return new Date(
    value
  ).toLocaleTimeString(
    "en-PH",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


/* ==========================================
   FORMAT MONEY
   ========================================== */

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


/* ==========================================
   FILE VALIDATION
   ========================================== */

function validFile(file) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  const maxFileSize =
    5 * 1024 * 1024;

  return (
    allowedTypes.includes(
      file.type
    ) &&
    file.size <=
      maxFileSize
  );
}


/* ==========================================
   FILE EXTENSION
   ========================================== */

function getFileExtension(file) {
  return (
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "file"
  );
}


/* ==========================================
   ADMIN CHAT
   CUSTOMER-SIDE COMPONENT
   ========================================== */

function AdminChat() {
  const [
    session,
    setSession,
  ] = useState(null);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState("");

  const [
    conversationStatus,
    setConversationStatus,
  ] = useState("Open");

  const [
    reservationStatus,
    setReservationStatus,
  ] = useState(null);

  const [
    reservationType,
    setReservationType,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    starting,
    setStarting,
  ] = useState(false);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    showPaymentForm,
    setShowPaymentForm,
  ] = useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("GCash");

  const [
    paymentAmount,
    setPaymentAmount,
  ] = useState("");

  const [
    paymentReference,
    setPaymentReference,
  ] = useState("");

  const [
    receiptFile,
    setReceiptFile,
  ] = useState(null);


  const attachmentInputRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);


  /* ========================================
     ADD SIGNED URLS TO ATTACHMENTS
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
                  "Attachment URL error:",
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
     LOAD CHAT MESSAGES
     ======================================== */

  const fetchMessages =
    useCallback(
      async (
        accessToken
      ) => {

        if (!accessToken) {
          return;
        }


        const {
          data,
          error:
            messageError,
        } =
          await supabase.rpc(
            "get_customer_chat_messages",
            {
              p_access_token:
                accessToken,
            }
          );


        if (messageError) {
          console.error(
            "Customer message loading error:",
            messageError
          );

          setError(
            "Unable to load your conversation."
          );

          return;
        }


        const signedMessages =
          await addSignedUrls(
            data || []
          );


        setMessages(
          signedMessages
        );

      },
      [
        addSignedUrls,
      ]
    );


  /* ========================================
     LOAD CHAT INFORMATION
     ======================================== */

  const fetchChatInfo =
    useCallback(
      async (
        accessToken
      ) => {

        if (!accessToken) {
          return false;
        }


        const {
          data,
          error:
            infoError,
        } =
          await supabase.rpc(
            "get_customer_chat_info",
            {
              p_access_token:
                accessToken,
            }
          );


        if (
          infoError ||
          !data ||
          data.length === 0
        ) {
          console.error(
            "Customer chat info error:",
            infoError
          );

          return false;
        }


        const info =
          data[0];


        setConversationStatus(
          info.conversation_status
        );

        setCustomerName(
          info.customer_name ||
            ""
        );

        setCustomerEmail(
          info.customer_email ||
            ""
        );

        setReservationStatus(
          info.reservation_status
        );

        setReservationType(
          info.reservation_type
        );


        return true;

      },
      []
    );


  /* ========================================
     RESTORE SAVED CHAT SESSION
     ======================================== */

  useEffect(() => {

    const restoreChat =
      async () => {

        try {

          const stored =
            localStorage.getItem(
              CHAT_STORAGE_KEY
            );


          if (!stored) {
            return;
          }


          const parsed =
            JSON.parse(
              stored
            );


          /*
            Invalid locally saved session.
          */

          if (
            !parsed?.accessToken ||
            !parsed?.conversationId
          ) {

            localStorage.removeItem(
              CHAT_STORAGE_KEY
            );

            return;
          }


          /*
            Existing sessions created before
            the 30-day system may not have an
            expiration date yet.

            Give those sessions a fresh
            30-day period.
          */

          if (
            !parsed.expiresAt
          ) {

            parsed.expiresAt =
              Date.now() +
              CHAT_SESSION_DURATION;


            localStorage.setItem(
              CHAT_STORAGE_KEY,
              JSON.stringify(
                parsed
              )
            );

          }


          /*
            Forget expired browser sessions.

            This does NOT delete the
            Supabase conversation.
          */

          if (
            Date.now() >
            parsed.expiresAt
          ) {

            localStorage.removeItem(
              CHAT_STORAGE_KEY
            );

            return;
          }


          const valid =
            await fetchChatInfo(
              parsed.accessToken
            );


          if (!valid) {

            localStorage.removeItem(
              CHAT_STORAGE_KEY
            );

            return;
          }


          setSession(
            parsed
          );


          await fetchMessages(
            parsed.accessToken
          );


        } catch (restoreError) {

          console.error(
            "Chat restore error:",
            restoreError
          );


          localStorage.removeItem(
            CHAT_STORAGE_KEY
          );


        } finally {

          setLoading(
            false
          );

        }

      };


    restoreChat();

  }, [
    fetchChatInfo,
    fetchMessages,
  ]);


  /* ========================================
     REALTIME ADMIN REPLIES
     ======================================== */

  useEffect(() => {

    if (
      !session?.accessToken
    ) {
      return undefined;
    }


    const accessToken =
      session.accessToken;


    const channel =
      supabase
        .channel(
          `customer-chat:${accessToken}`
        )
        .on(
          "broadcast",
          {
            event:
              "message_changed",
          },
          () => {

            fetchMessages(
              accessToken
            );

            fetchChatInfo(
              accessToken
            );

          }
        )
        .subscribe();


    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, [
    session?.accessToken,
    fetchMessages,
    fetchChatInfo,
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
     START NEW CHAT
     ======================================== */

  const startChat =
    async (event) => {

      event.preventDefault();


      if (starting) {
        return;
      }


      const name =
        customerName.trim();

      const email =
        customerEmail
          .trim()
          .toLowerCase();


      if (!name) {

        setError(
          "Please enter your name."
        );

        return;
      }


      if (!email) {

        setError(
          "Please enter your email address."
        );

        return;
      }


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(
          email
        )
      ) {

        setError(
          "Please enter a valid email address."
        );

        return;
      }


      setStarting(
        true
      );

      setError(
        ""
      );


      const {
        data,
        error:
          createError,
      } =
        await supabase.rpc(
          "create_customer_chat",
          {
            p_customer_name:
              name,

            p_customer_email:
              email,
          }
        );


      if (
        createError ||
        !data ||
        data.length === 0
      ) {

        console.error(
          "Create chat error:",
          createError
        );


        setError(
          "Unable to start the conversation. Please try again."
        );


        setStarting(
          false
        );

        return;
      }


      const created =
        data[0];


      /*
        Save the private conversation
        token in this browser for 30 days.
      */

      const newSession = {

        conversationId:
          created.conversation_id,

        accessToken:
          created.access_token,

        expiresAt:
          Date.now() +
          CHAT_SESSION_DURATION,

      };


      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(
          newSession
        )
      );


      setSession(
        newSession
      );

      setConversationStatus(
        "Open"
      );

      setMessages(
        []
      );


      await fetchChatInfo(
        created.access_token
      );


      setStarting(
        false
      );

    };


  /* ========================================
     SEND TEXT MESSAGE
     ======================================== */

  const sendText =
    async (event) => {

      event.preventDefault();


      const trimmedMessage =
        input.trim();


      if (
        !trimmedMessage ||
        !session?.accessToken ||
        sending
      ) {
        return;
      }


      if (
        conversationStatus ===
        "Closed"
      ) {

        setError(
          "This conversation has been closed."
        );

        return;
      }


      setSending(
        true
      );

      setError(
        ""
      );


      const {
        error:
          sendError,
      } =
        await supabase.rpc(
          "send_customer_chat_message",
          {
            p_access_token:
              session.accessToken,

            p_message:
              trimmedMessage,
          }
        );


      if (sendError) {

        console.error(
          "Customer send message error:",
          sendError
        );


        setError(
          sendError.message ||
            "Unable to send your message."
        );


        setSending(
          false
        );

        return;
      }


      setInput(
        ""
      );


      await fetchMessages(
        session.accessToken
      );


      setSending(
        false
      );

    };


  /* ========================================
     UPLOAD FILE TO STORAGE
     ======================================== */

  const uploadFile =
    async (file) => {

      if (
        !session?.accessToken
      ) {

        throw new Error(
          "No active conversation."
        );

      }


      if (
        !validFile(
          file
        )
      ) {

        throw new Error(
          "File must be JPG, PNG, WEBP, or PDF and 5 MB or smaller."
        );

      }


      const randomPart =
        Math.random()
          .toString(36)
          .slice(2, 9);


      const attachmentPath =
        `${session.accessToken}/` +
        `${Date.now()}-` +
        `${randomPart}.` +
        `${getFileExtension(
          file
        )}`;


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
            attachmentPath,
            file,
            {
              upsert:
                false,

              contentType:
                file.type,
            }
          );


      if (uploadError) {
        throw uploadError;
      }


      return attachmentPath;

    };


  /* ========================================
     SEND NORMAL ATTACHMENT
     ======================================== */

  const sendAttachment =
    async (file) => {

      if (
        !file ||
        uploading ||
        !session?.accessToken
      ) {
        return;
      }


      if (
        conversationStatus ===
        "Closed"
      ) {

        setError(
          "This conversation is closed."
        );

        return;
      }


      setUploading(
        true
      );

      setError(
        ""
      );


      let attachmentPath =
        null;


      try {

        attachmentPath =
          await uploadFile(
            file
          );


        const {
          error:
            messageError,
        } =
          await supabase.rpc(
            "send_customer_chat_attachment",
            {
              p_access_token:
                session.accessToken,

              p_attachment_path:
                attachmentPath,

              p_attachment_name:
                file.name,

              p_attachment_mime:
                file.type,

              p_message:
                null,
            }
          );


        if (messageError) {
          throw messageError;
        }


        await fetchMessages(
          session.accessToken
        );


      } catch (attachmentError) {

        console.error(
          "Attachment error:",
          attachmentError
        );


        /*
          Remove orphaned file if the
          database message failed.
        */

        if (attachmentPath) {

          await supabase
            .storage
            .from(
              ATTACHMENT_BUCKET
            )
            .remove([
              attachmentPath,
            ]);

        }


        setError(
          attachmentError.message ||
            "Unable to send attachment."
        );


      } finally {

        setUploading(
          false
        );

      }

    };


  /* ========================================
     SUBMIT PAYMENT RECEIPT
     ======================================== */

  const submitPaymentReceipt =
    async (event) => {

      event.preventDefault();


      if (
        uploading ||
        !session?.accessToken
      ) {
        return;
      }


      if (
        conversationStatus ===
        "Closed"
      ) {

        setError(
          "This conversation is closed."
        );

        return;
      }


      if (
        reservationStatus !==
        "Awaiting Payment"
      ) {

        setError(
          "Your reservation is not currently awaiting payment."
        );

        return;
      }


      if (
        !paymentAmount ||
        Number(
          paymentAmount
        ) <= 0
      ) {

        setError(
          "Please enter the amount paid."
        );

        return;
      }


      if (
        !paymentReference.trim()
      ) {

        setError(
          "Please enter the GCash or bank reference number."
        );

        return;
      }


      if (!receiptFile) {

        setError(
          "Please select your payment receipt."
        );

        return;
      }


      setUploading(
        true
      );

      setError(
        ""
      );


      let attachmentPath =
        null;


      try {

        attachmentPath =
          await uploadFile(
            receiptFile
          );


        const {
          error:
            paymentError,
        } =
          await supabase.rpc(
            "submit_chat_payment_receipt",
            {
              p_access_token:
                session.accessToken,

              p_payment_method:
                paymentMethod,

              p_payment_amount:
                Number(
                  paymentAmount
                ),

              p_payment_reference:
                paymentReference.trim(),

              p_attachment_path:
                attachmentPath,

              p_attachment_name:
                receiptFile.name,

              p_attachment_mime:
                receiptFile.type,
            }
          );


        if (paymentError) {
          throw paymentError;
        }


        /*
          Reset payment form.
        */

        setPaymentMethod(
          "GCash"
        );

        setPaymentAmount(
          ""
        );

        setPaymentReference(
          ""
        );

        setReceiptFile(
          null
        );

        setShowPaymentForm(
          false
        );


        await fetchMessages(
          session.accessToken
        );


      } catch (paymentError) {

        console.error(
          "Payment receipt error:",
          paymentError
        );


        if (attachmentPath) {

          await supabase
            .storage
            .from(
              ATTACHMENT_BUCKET
            )
            .remove([
              attachmentPath,
            ]);

        }


        setError(
          paymentError.message ||
            "Unable to submit your payment receipt."
        );


      } finally {

        setUploading(
          false
        );

      }

    };


  /* ========================================
     END CUSTOMER CHAT
     ======================================== */

  const endChat =
    async () => {

      if (
        !session?.accessToken
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "End this conversation? You will no longer be able to access this chat from this browser. You can start a new conversation later."
        );


      if (!confirmed) {
        return;
      }


      setError(
        ""
      );


      const {
        error:
          endError,
      } =
        await supabase.rpc(
          "end_customer_chat",
          {
            p_access_token:
              session.accessToken,
          }
        );


      if (endError) {

        console.error(
          "End chat error:",
          endError
        );


        setError(
          "Unable to end the conversation. Please try again."
        );

        return;
      }


      /*
        Forget secret chat token
        from this browser.
      */

      localStorage.removeItem(
        CHAT_STORAGE_KEY
      );


      /*
        Reset all customer chat state.
      */

      setSession(
        null
      );

      setMessages(
        []
      );

      setConversationStatus(
        "Open"
      );

      setReservationStatus(
        null
      );

      setReservationType(
        null
      );

      setCustomerName(
        ""
      );

      setCustomerEmail(
        ""
      );

      setInput(
        ""
      );

      setError(
        ""
      );

      setShowPaymentForm(
        false
      );

      setPaymentMethod(
        "GCash"
      );

      setPaymentAmount(
        ""
      );

      setPaymentReference(
        ""
      );

      setReceiptFile(
        null
      );

    };


  /* ========================================
     PENDING PAYMENT CHECK
     ======================================== */

  const hasPendingPayment =
    messages.some(
      (item) =>
        item.message_type ===
          "payment_receipt" &&
        item.payment_status ===
          "Pending"
    );


  /* ========================================
     LOADING
     ======================================== */

  if (loading) {

    return (
      <div className="chat-content">

        <div className="admin-chat-loading">

          Loading conversation...

        </div>

      </div>
    );

  }


  /* ========================================
     START CONVERSATION SCREEN
     ======================================== */

  if (!session) {

    return (
      <div className="chat-content">

        {/* ADMIN HEADER */}

        <div className="chat-header">

          <div className="chat-avatar admin-avatar">
            A
          </div>


          <div>

            <h2>
              Resort Admin
            </h2>

            <p>
              PolChat Garden Resort Support
            </p>

          </div>


          <span className="admin-status">
            Staff Support
          </span>

        </div>


        {/* INTRO */}

        <div className="admin-chat-intro">

          <h3>
            Start a Conversation
          </h3>


          <p>
            Enter your information to speak directly with the resort administrator.
          </p>


          <p className="admin-chat-intro-note">

            If you already submitted a reservation,
            use the same name and email address from
            your reservation form so the administrator
            can more easily identify your booking.

          </p>

        </div>


        {/* START FORM */}

        <form
          className="admin-chat-start-form"
          onSubmit={
            startChat
          }
        >

          <label>

            <span>
              Name
            </span>


            <input
              type="text"
              value={
                customerName
              }
              onChange={(event) =>
                setCustomerName(
                  event.target.value
                )
              }
              placeholder="Enter your name"
              disabled={
                starting
              }
            />

          </label>


          <label>

            <span>
              Email Address
            </span>


            <input
              type="email"
              value={
                customerEmail
              }
              onChange={(event) =>
                setCustomerEmail(
                  event.target.value
                )
              }
              placeholder="Enter your email"
              disabled={
                starting
              }
            />

          </label>


          {error && (

            <div
              className="admin-chat-error"
              role="alert"
            >
              {error}
            </div>

          )}


          <button
            type="submit"
            className="admin-chat-start-button"
            disabled={
              starting
            }
          >

            {starting
              ? "Starting..."
              : "Start Chat"}

          </button>

        </form>

      </div>
    );

  }


  /* ========================================
     ACTIVE CONVERSATION
     ======================================== */

  return (
    <div className="chat-content">

      {/* ===================================
          ADMIN HEADER
          =================================== */}

      <div className="chat-header">

        <div className="chat-avatar admin-avatar">
          A
        </div>


        <div>

          <h2>
            Resort Admin
          </h2>


          <p>

            {reservationType
              ? `${reservationType} • ${
                  reservationStatus ||
                  "Reservation"
                }`
              : "PolChat Garden Resort Support"}

          </p>

        </div>


        <span
          className={`admin-status ${
            conversationStatus ===
            "Closed"
              ? "closed"
              : ""
          }`}
        >

          {conversationStatus ===
          "Open"
            ? "Conversation Open"
            : "Conversation Closed"}

        </span>

      </div>


      {/* ===================================
          CUSTOMER SESSION BAR
          =================================== */}

      <div className="admin-chat-customer-bar">

        <div>

          <span>
            Chatting as
          </span>


          <strong>
            {customerName}
          </strong>


          <small>
            {customerEmail}
          </small>

        </div>


        <button
          type="button"
          className="admin-chat-end-button"
          onClick={
            endChat
          }
        >
          End Chat
        </button>

      </div>


      {/* ===================================
          MESSAGES
          =================================== */}

      <div className="chat-messages admin-messages">

        {messages.length ===
        0 ? (

          <div className="admin-chat-empty">

            <strong>
              Conversation started
            </strong>


            <p>
              Send a message below and the resort administrator will be able to respond from the Admin Dashboard.
            </p>

          </div>

        ) : (

          messages.map(
            (message) => (

              <div
                key={
                  message.id
                }
                className={`message-row ${
                  message.sender_type ===
                  "admin"
                    ? "bot"
                    : "user"
                }`}
              >

                {/* ADMIN AVATAR */}

                {message.sender_type ===
                  "admin" && (

                  <div className="message-avatar admin-message-avatar">
                    A
                  </div>

                )}


                {/* ===========================
                    PAYMENT RECEIPT
                    =========================== */}

                {message.message_type ===
                "payment_receipt" ? (

                  <div className="customer-payment-card">

                    {/* RECEIPT IMAGE */}

                    {message.attachment_url &&
                    message.attachment_mime
                      ?.startsWith(
                        "image/"
                      ) ? (

                      <a
                        href={
                          message.attachment_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >

                        <img
                          src={
                            message.attachment_url
                          }
                          alt="Payment receipt"
                        />

                      </a>

                    ) : message.attachment_url ? (

                      <a
                        href={
                          message.attachment_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Payment Receipt
                      </a>

                    ) : null}


                    {/* PAYMENT INFORMATION */}

                    <div className="customer-payment-card-body">

                      <span>
                        Payment Receipt
                      </span>


                      <strong>
                        ₱
                        {formatMoney(
                          message.payment_amount
                        )}
                      </strong>


                      <p>
                        {
                          message.payment_method
                        }
                      </p>


                      <p>
                        Ref. No.{" "}
                        <strong>
                          {
                            message.payment_reference
                          }
                        </strong>
                      </p>


                      <div
                        className={`customer-payment-state ${
                          message.payment_status
                            ?.toLowerCase()
                        }`}
                      >

                        {message.payment_status ===
                        "Verified"
                          ? "✓ Transfer Confirmed"
                          : message.payment_status ===
                            "Rejected"
                          ? "✕ Payment Proof Rejected"
                          : "Waiting for Admin Verification"}

                      </div>


                      {message.payment_status ===
                        "Verified" && (

                        <small>
                          Verified by Resort Admin
                        </small>

                      )}


                      {message.payment_reviewed_at && (

                        <small>
                          {formatTime(
                            message.payment_reviewed_at
                          )}
                        </small>

                      )}

                    </div>

                  </div>


                /* ===========================
                   NORMAL ATTACHMENT
                   =========================== */

                ) : message.message_type ===
                  "attachment" ? (

                  <div className="customer-chat-attachment">

                    {message.attachment_url &&
                    message.attachment_mime
                      ?.startsWith(
                        "image/"
                      ) ? (

                      <a
                        href={
                          message.attachment_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >

                        <img
                          src={
                            message.attachment_url
                          }
                          alt={
                            message.attachment_name
                          }
                        />

                      </a>

                    ) : message.attachment_url ? (

                      <a
                        href={
                          message.attachment_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Attachment
                      </a>

                    ) : (

                      <span>
                        Attachment unavailable
                      </span>

                    )}


                    <small>
                      {
                        message.attachment_name
                      }
                    </small>

                  </div>


                /* ===========================
                   TEXT MESSAGE
                   =========================== */

                ) : (

                  <div>

                    <div
                      className={`message-bubble ${
                        message.sender_type ===
                        "admin"
                          ? "bot"
                          : "user"
                      }`}
                    >

                      {
                        message.message_text
                      }

                    </div>


                    <small
                      className={`admin-chat-message-time ${
                        message.sender_type ===
                        "customer"
                          ? "customer"
                          : ""
                      }`}
                    >

                      {formatTime(
                        message.created_at
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


      {/* ===================================
          CLOSED CONVERSATION
          =================================== */}

      {conversationStatus ===
        "Closed" && (

        <div className="admin-chat-closed-notice">

          This conversation has been closed.
          You can start a new conversation if
          you still need assistance.

        </div>

      )}


      {/* ===================================
          PAYMENT BUTTON
          =================================== */}

      {conversationStatus ===
        "Open" &&
        reservationStatus ===
          "Awaiting Payment" &&
        !hasPendingPayment && (

        <div className="customer-payment-tools">

          <button
            type="button"
            onClick={() => {

              setError(
                ""
              );

              setShowPaymentForm(
                (current) =>
                  !current
              );

            }}
          >
            Send Payment Receipt
          </button>

        </div>

      )}


      {/* ===================================
          PAYMENT RECEIPT FORM
          =================================== */}

      {showPaymentForm &&
        conversationStatus ===
          "Open" &&
        reservationStatus ===
          "Awaiting Payment" &&
        !hasPendingPayment && (

        <form
          className="customer-payment-form"
          onSubmit={
            submitPaymentReceipt
          }
        >

          <h3>
            Submit Payment Receipt
          </h3>


          <select
            value={
              paymentMethod
            }
            disabled={
              uploading
            }
            onChange={(event) =>
              setPaymentMethod(
                event.target.value
              )
            }
          >

            <option value="GCash">
              GCash
            </option>

            <option value="Online Banking">
              Online Banking
            </option>

          </select>


          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Amount paid"
            value={
              paymentAmount
            }
            disabled={
              uploading
            }
            onChange={(event) =>
              setPaymentAmount(
                event.target.value
              )
            }
          />


          <input
            type="text"
            placeholder="Reference number"
            value={
              paymentReference
            }
            disabled={
              uploading
            }
            onChange={(event) =>
              setPaymentReference(
                event.target.value
              )
            }
          />


          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            disabled={
              uploading
            }
            onChange={(event) =>
              setReceiptFile(
                event.target
                  .files?.[0] ||
                  null
              )
            }
          />


          <div className="customer-payment-form-actions">

            <button
              type="submit"
              disabled={
                uploading
              }
            >

              {uploading
                ? "Submitting..."
                : "Submit Receipt"}

            </button>


            <button
              type="button"
              disabled={
                uploading
              }
              onClick={() => {

                setShowPaymentForm(
                  false
                );

                setPaymentMethod(
                  "GCash"
                );

                setPaymentAmount(
                  ""
                );

                setPaymentReference(
                  ""
                );

                setReceiptFile(
                  null
                );

              }}
            >
              Cancel
            </button>

          </div>

        </form>

      )}


      {/* ===================================
          ERROR
          =================================== */}

      {error && (

        <div
          className="admin-chat-error message-error"
          role="alert"
        >
          {error}
        </div>

      )}


      {/* ===================================
          MESSAGE INPUT
          =================================== */}

      <form
        className="chat-input-container"
        onSubmit={
          sendText
        }
      >

        {/* HIDDEN ATTACHMENT INPUT */}

        <input
          ref={
            attachmentInputRef
          }
          hidden
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
          onChange={(event) => {

            const selectedFile =
              event.target
                .files?.[0];


            if (selectedFile) {

              sendAttachment(
                selectedFile
              );

            }


            /*
              Reset input so the same
              file can be selected again.
            */

            event.target.value =
              "";

          }}
        />


        {/* ATTACH BUTTON */}

        <button
          type="button"
          className="customer-attach-button"
          disabled={
            conversationStatus ===
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
            ? "Uploading..."
            : "Attach"}

        </button>


        {/* MESSAGE INPUT */}

        <input
          type="text"
          placeholder={
            conversationStatus ===
            "Closed"
              ? "Conversation is closed"
              : "Type a message to the resort admin..."
          }
          value={
            input
          }
          disabled={
            conversationStatus ===
              "Closed" ||
            sending
          }
          onChange={(event) =>
            setInput(
              event.target.value
            )
          }
        />


        {/* SEND */}

        <button
          type="submit"
          className="chat-send-button"
          disabled={
            conversationStatus ===
              "Closed" ||
            sending ||
            !input.trim()
          }
        >

          {sending
            ? "Sending..."
            : "Send"}

        </button>

      </form>

    </div>
  );
}

export default AdminChat;