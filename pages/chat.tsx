import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Message } from '../utils/db';
import Layout from '../components/Layout';
import UserCard from '../components/UserCard';
import { toast } from 'react-toastify';

let socket;

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [user, setUser] = useState(null);
  const [cardData, setCardData] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    socketInitializer();
    getUsers();

    return () => {
      socket.disconnect();
    };
  }, []);

  async function fetchMessages(receiverId: any, userId: any) {
    try {
      const response = await fetch(`/api/messages?receiverId=${receiverId}&userId=${userId}`);
      const data = await response.json();
      setAllMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  const getUsers = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        setCardData(result?.data);
      } else {
        toast.error(result?.error); // Display error toast
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred'); // Display error toast
    }
  }

  async function socketInitializer() {
    try {
      await fetch('/api/chat');
      socket = io();

      socket.on('existing-messages', (data: Message[]) => {
        setAllMessages(data);
      });

      socket.on('requested-messages', (data: Message[]) => {
        setAllMessages(data);
      });

      socket.on('receive-message', (data: Message) => {
        setAllMessages((pre) => [...pre, data]);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!activeUserId) {
      // Handle the case where no user is selected
      return;
    }

    const userId = user?._id;
    const username = user?.username;

    socket.emit('send-message', {
      userId,
      receiverId: activeUserId,
      username,
      message,
    });
    setMessage('');
  }

  const handleUserCardClick = (receiverId: any) => {
    setActiveUserId(receiverId);
    fetchMessages(receiverId, user?._id)
  };

  return (
    <Layout title="About | Next.js + TypeScript Example">
      <div className="flex">
        {/* Sidebar with Vertical Tabs */}
        <div className="w-1/4 p-4 bg-gray-100" style={{ height: '100vh', overflowY: 'auto', borderRight: '1px solid #E2E8F0' }}>
          {cardData.map(({ _id, username }) => (
            <UserCard
              key={_id}
              username={username}
              onClick={() => handleUserCardClick(_id)}
              active={_id === activeUserId}
              userId={_id}
            />
          ))}
        </div>

        {/* Main Chat Section */}
        <div className="w-3/4 p-4">
          {/* Chat header */}
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-500">Chat Here</h1>

          {/* Chat input form */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <textarea
              name="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
              style={{ border: '1px solid gray' }}
              className="w-1/2 bg-green-200 px-3 py-2 border rounded-md mb-2 outline-none focus:border-blue-500"
            ></textarea>
            <button
              type="submit"
              style={{ border: '1px solid gray' }}
              className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-md border"
            >
              Send
            </button>
          </form>

          {/* Chat messages */}
          <div>
            {allMessages.map(({ userId, username, message }, index) => (
              <div key={index}>
                <div
                  key={index}
                  style={{
                    padding: '5px',
                    margin: '5px',
                    borderRadius: '5px',
                    maxWidth: '50%',
                    display: 'inline-block',
                    textAlign: userId === user._id ? 'right' : 'left',
                    backgroundColor: userId === user?._id ? '#DCF8C6' : '#F3F3F3',
                  }}
                  className="divide-y divide-gray-200 py-4"
                >
                  <strong>{username}:</strong> {message}
                </div>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
