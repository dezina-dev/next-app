import { faCheck, faCircleMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type UserCardProps = {
  userId: any;
  username: string;
  onClick: (userId: any) => void;
  active: boolean;
  handleDeleteUser: (userId: any) => void;
};

const UserGroupCard: React.FC<UserCardProps> = ({ userId, username, onClick, active, handleDeleteUser }) => (
  <div
    className={`class="divide-y divide-dashed md:divide-solid" mb-4 cursor-pointer p-2 border-l-4 ${active ? 'border-blue-500' : 'border-transparent'}`}
    style={{ backgroundColor: active ? '#EDF2F7' : 'transparent', transition: 'background-color 0.3s' }}
    onClick={() => onClick(userId)}
  >
    <div className={`font-bold ${active ? 'text-blue-500' : ''}`}>{username}
      <FontAwesomeIcon icon={faCheck} className="text-white" />
      <FontAwesomeIcon icon={faCircleMinus} className="text-black text-red-500" title='delete' onClick={() => handleDeleteUser(userId)} />
    </div>
    <div className="border-t mt-2" style={{ borderColor: '#CBD5E0' }}></div>
  </div>
);

export default UserGroupCard;