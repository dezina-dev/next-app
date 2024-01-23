import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Message } from '../utils/db';
import Layout from '../components/Layout';
import UserGroupCard from '../components/UserGroupCard';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from '../components/DeleteModal';

let socket;

const GroupsPage = () => {
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [user, setUser] = useState(null);
    const [allusers, setAllusers] = useState<any[]>([]);
    const [activeUserId, setActiveUserId] = useState<any | null>(null);
    const [showCreateGroup, setShowCreateGroup] = useState<Boolean>(false)
    const groupRef = useRef(null)
    const [groups, setGroups] = useState<any[]>([]);
    const [groupMembers, setGroupMembers] = useState<any[]>([])
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupId, setGroupId] = useState('')
    const [groupName, setGroupName] = useState('')
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        socketInitializer();
        getGroupUsers();
        getGroups();

        return () => {
            socket.disconnect();
        };
    }, []);

    async function fetchMessages(receiverId: any, userId: any) {
        try {
            const response = await fetch(`/api/messages?receiverId=${receiverId}&userId=${userId}&groupId=${groupId}`);
            const result = await response.json();

            if (response.ok) {
                setAllMessages(result);
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    const getGroupUsers = async () => {
        try {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                setAllusers(result?.data);
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

    const getGroups = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`/api/groups?userId=${storedUser?._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            if (response.ok) {
                setGroups(result?.data);
            } else {
                toast.error(result?.error); // Display error toast
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('An error occurred'); // Display error toast
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
            groupId
        });
        setMessage('');
    }

    const handleUserCardClick = (receiverId: any) => {
        setActiveUserId(receiverId);
        fetchMessages(receiverId, user?._id)
        // socket.emit('request-messages', { userId: user?._id, receiverId: receiverId });
    };

    const handleCreateGroup = async (e) => {

        let data = {
            createdById: user?._id,
            groupName: groupRef.current.value
        }
        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            // If login is successful, redirect to the chat page
            if (response.ok) {
                toast.success(result?.message);

            }
            else {
                toast.error('Failed to create group');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred'); // Display error toast
        }
        groupRef.current.value = ''
        //setShowCreateGroup(false)

        // fetchMessages(receiverId, user?._id)
        // socket.emit('request-messages', { userId: user?._id, receiverId: receiverId });
    };

    const handleSelectGroup = async (groupId: string, name: string) => {
        let filterGroup = groups.filter((item) => item._id === groupId)
        setGroupMembers(filterGroup[0]?.members)
        setGroupId(groupId)
        setGroupName(name)
    }

    const handleAddUsers = async (groupUsers: any) => {
        let data = {
            groupId: groupId,
            groupUsers: groupUsers
        }
        try {
            setLoading(true)
            const response = await fetch('/api/groups', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                // setAllusers(result?.data);
                toast.success(result?.message)
                setGroupMembers(result?.data?.members)
            } else {
                toast.error(result?.error); // Display error toast
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('An error occurred'); // Display error toast
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (deleteUserId) {
            try {
                const response = await fetch(`/api/groups?groupId=${groupId}&deleteUserId=${deleteUserId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const updatedGroupMembers = await response.json();
                    setGroupMembers(updatedGroupMembers);
                    toast.success(updatedGroupMembers?.message);
                } else {
                    console.error('Error deleting user from group:', response);
                    toast.error('Error while deleting');
                }

            } catch (error) {
                console.error('Error deleting user from group:', error);
            } finally {
                setDeleteUserId(null);
                setDeleteModalOpen(false);
            }
        } else if (deleteUserId === null) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            try {
                const response = await fetch(`/api/groups?group=${groupId}&createdBy=${storedUser?._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const updatedGroups = await response.json();
                    setGroups(updatedGroups?.data);
                    toast.success(updatedGroups?.message);
                } else {
                    console.error('Error deleting user from group:', response.statusText);
                    toast.error('Error while deleting');
                }

            } catch (error) {
                console.error('Error deleting user from group:', error);
            } finally {
                setGroupId('');
                setDeleteModalOpen(false);
            }
        }

    };

    const handleCancelDelete = () => {
        setDeleteUserId(null);
        setGroupId('')
        setDeleteModalOpen(false);
    };

    const handleDeleteUser = (userId) => {
        setDeleteUserId(userId);
        setDeleteModalOpen(true);
    };

    const handleDeleteGroup = (groupId) => {
        setGroupId(groupId);
        setDeleteModalOpen(true);
    };

    return (
        <Layout title="About | Next.js + TypeScript Example">
            <div className="flex">
                <button
                    type="submit"
                    className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-md border create-group-button"
                    onClick={() => setShowCreateGroup(true)}
                >
                    Create group
                </button>
                {/* Create group form */}
                {
                    showCreateGroup ? (
                        <form onSubmit={handleCreateGroup} className="flex items-center">
                            <div>
                                <input
                                    type="text"
                                    id="group"
                                    ref={groupRef}
                                    placeholder="Group name"
                                    className="w-full px-3 py-2 rounded-md border mb-2 outline-none focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-md border"
                            >
                                <FontAwesomeIcon icon={faCheck} className="text-white" />
                            </button>
                        </form>

                    ) : null
                }

                {/* Display group names on the right */}
                <div className="ml-auto p-2 flex">
                    <h1 className="text-xl font-bold mb-4b underline decoration-sky-500">My Groups</h1>
                    <ul className="flex">
                        {groups.map(({ _id, groupName }) => (
                            <li key={_id}>
                                <button className="px-4 py-2 ml-3 px-4 py-2 border text-sm font-medium text-gray-900 bg-pink-400 text-white rounded-md cursor"
                                    onClick={() => handleSelectGroup(_id, groupName)}>
                                    {groupName}
                                </button>
                                <FontAwesomeIcon icon={faTrash} className="text-black" title='delete group'
                                    onClick={() => handleDeleteGroup(_id)} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* show loader */}
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
                </div>
            )}
            <div className="flex">
                {/* Sidebar with Vertical Tabs */}
                <div className="w-1/4 p-4 bg-gray-100" style={{ height: '100vh', overflowY: 'auto', borderRight: '1px solid #E2E8F0' }}>
                    {
                        groupId === '' ? (
                            <></>
                        ) : (
                            <>
                                <p>Add group members</p>
                                <div>
                                    <select
                                        className="form-multiselect block w-full mt-1 bg-pink-100"
                                        multiple
                                        size={5}
                                        value={selectedUsers}
                                        onChange={(e) => setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, ...Array.from(e.target.selectedOptions, (option) => option.value)])}
                                    >
                                        {allusers.map(({ _id, username }) => (
                                            <option key={_id} value={_id}>
                                                {username}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => handleAddUsers(selectedUsers)}>
                                        Add
                                    </button>
                                </div>
                                <br />
                                {
                                    groupMembers.length === 0 ? (
                                        <p>No group members</p>
                                    ) : (
                                        <p>Group members</p>
                                    )
                                }

                                {
                                    groupMembers && groupMembers.map(({ _id, username }) => (
                                        <UserGroupCard
                                            key={_id}
                                            username={username}
                                            onClick={() => handleUserCardClick(_id)}
                                            active={_id === activeUserId}
                                            userId={_id}
                                            handleDeleteUser={(userId) => handleDeleteUser(userId)}  // Pass userId as a parameter
                                        />
                                    ))
                                }
                                {/* Modal for delete confirmation */}
                                <DeleteModal isOpen={isDeleteModalOpen} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
                            </>

                        )
                    }
                </div>

                {/* Main Chat Section */}
                <div className="w-3/4 p-4">
                    {/* Chat header */}
                    <h1 className="text-3xl font-bold mb-4 text-center text-blue-500">{groupName}</h1>

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

export default GroupsPage;
