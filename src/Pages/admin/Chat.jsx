import { useState } from 'react';
import './Chat.css';

const initialChats = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    lastMessage: 'Thank you! I will wait for the confirmation.',
    time: '10:32 AM',
    unread: 2,
    messages: [
      {
        id: 1,
        sender: 'guest',
        text: 'Hello, I would like to ask about my reservation.',
        time: '10:25 AM',
      },
      {
        id: 2,
        sender: 'admin',
        text: 'Hello Juan! Sure, may I have your booking name?',
        time: '10:27 AM',
      },
      {
        id: 3,
        sender: 'guest',
        text: 'Juan Dela Cruz. I booked an Overnight Stay.',
        time: '10:29 AM',
      },
      {
        id: 4,
        sender: 'admin',
        text: 'Thank you! I found your reservation. It is currently being processed.',
        time: '10:30 AM',
      },
      {
        id: 5,
        sender: 'guest',
        text: 'Thank you! I will wait for the confirmation.',
        time: '10:32 AM',
      },
    ],
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    lastMessage: 'Can I change my booking date?',
    time: '9:15 AM',
    unread: 1,
    messages: [
      {
        id: 1,
        sender: 'guest',
        text: 'Can I change my booking date?',
        time: '9:15 AM',
      },
    ],
  },
  {
    id: 3,
    name: 'Pedro Reyes',
    email: 'pedro.reyes@email.com',
    lastMessage: 'I already sent my payment receipt.',
    time: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'guest',
        text: 'I already sent my payment receipt.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 4,
    name: 'Ana Lopez',
    email: 'ana.lopez@email.com',
    lastMessage: 'Thank you for your help!',
    time: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'admin',
        text: 'Your reservation has been cancelled successfully.',
        time: 'Yesterday',
      },
      {
        id: 2,
        sender: 'guest',
        text: 'Thank you for your help!',
        time: 'Yesterday',
      },
    ],
  },
];

export default function Chat() {
  const [chats, setChats] = useState(initialChats);
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState(initialChats[0]);
  const [message, setMessage] = useState('');

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectChat = (chat) => {
    setSelectedChat(chat);

    setChats((prev) =>
      prev.map((item) =>
        item.id === chat.id
          ? { ...item, unread: 0 }
          : item
      )
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'admin',
      text: message,
      time: 'Just now',
    };

    const updatedChat = {
      ...selectedChat,
      lastMessage: message,
      time: 'Just now',
      messages: [...selectedChat.messages, newMessage],
    };

    setSelectedChat(updatedChat);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id ? updatedChat : chat
      )
    );

    setMessage('');
  };

  return (
    <div className="chat-page">

      <div className="chat-header">
        <div>
          <h1>Chat</h1>
          <p>Communicate with your guests</p>
        </div>
      </div>

      <div className="chat-container">

        {/* Conversations */}
        <div className="chat-sidebar">

          <div className="chat-search">
            <input
              type="text"
              placeholder="Search guests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="chat-list">

            {filteredChats.length === 0 ? (
              <div className="chat-no-results">
                No conversations found.
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`chat-preview ${
                    selectedChat.id === chat.id ? 'active' : ''
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="chat-avatar">
                    {chat.name.charAt(0)}
                  </div>

                  <div className="chat-preview-content">
                    <div className="chat-preview-top">
                      <strong>{chat.name}</strong>
                      <small>{chat.time}</small>
                    </div>

                    <div className="chat-preview-bottom">
                      <span>{chat.lastMessage}</span>

                      {chat.unread > 0 && (
                        <b className="chat-unread">
                          {chat.unread}
                        </b>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}

          </div>
        </div>

        {/* Conversation */}
        <div className="chat-conversation">

          <div className="conversation-header">

            <div className="chat-avatar large">
              {selectedChat.name.charAt(0)}
            </div>

            <div>
              <h2>{selectedChat.name}</h2>
              <p>{selectedChat.email}</p>
            </div>

          </div>

          <div className="messages">

            {selectedChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${
                  msg.sender === 'admin' ? 'admin-message' : 'guest-message'
                }`}
              >
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <small>{msg.time}</small>
                </div>
              </div>
            ))}

          </div>

          <form className="message-form" onSubmit={sendMessage}>

            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit">
              Send
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}