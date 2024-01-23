import React, { useState } from 'react';

const GroupChatComponent: React.FC<{ socket: any; allUsers: any[]; groupMessages: any[] }> = ({
  socket,
  allUsers,
  groupMessages,
}) => {
  const [groupMessage, setGroupMessage] = useState('');
  const [groupId, setGroupId] = useState(''); // You need to manage groupId

  const handleSendGroupMessage = () => {
    const userId = 'currentUserId'; // Replace with the actual user ID
    const username = 'currentUsername'; // Replace with the actual username

    socket.emit('send-group-message', {
      userId,
      groupId,
      username,
      message: groupMessage,
    });

    setGroupMessage('');
  };

  return (
    <div>
      <h1>Group Chat</h1>
      <div>
        {allUsers.map((user) => (
          <div key={user._id}>{user.username}</div>
        ))}
      </div>
      <div>
        {groupMessages.map((message) => (
          <div key={message._id}>{`${message.username}: ${message.message}`}</div>
        ))}
      </div>
      <div>
        <textarea value={groupMessage} onChange={(e) => setGroupMessage(e.target.value)} placeholder="Enter your message" />
        <button onClick={handleSendGroupMessage}>Send</button>
      </div>
    </div>
  );
};

export default GroupChatComponent;
