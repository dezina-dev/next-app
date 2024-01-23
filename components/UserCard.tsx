import React from 'react';

type UserCardProps = {
  userId: any;
  username: string;
  onClick: (userId: any) => void;
  active: boolean;
};

const UserCard: React.FC<UserCardProps> = ({ userId, username, onClick, active }) => (
  <div
    className={`mb-4 cursor-pointer p-2 border-l-4 ${active ? 'border-blue-500' : 'border-transparent'}`}
    style={{ backgroundColor: active ? '#EDF2F7' : 'transparent', transition: 'background-color 0.3s' }}
    onClick={() => onClick(userId)}
  >
    <div className={`font-bold ${active ? 'text-blue-500' : ''}`}>{username}</div>
    <div className="border-t mt-2" style={{ borderColor: '#CBD5E0' }}></div>
  </div>
);

export default UserCard;