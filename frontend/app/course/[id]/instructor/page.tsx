'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateChatModal from '@/app/components/modals/create-chat-modal';

const InstructorPage = () => {
  const [chats, setChats] = useState<{ id: number; title: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams<{id: string}>()
  const id = params.id;
  console.log(params);
  
  useEffect(() => {
    // Placeholder data for chats
    setChats([
      { id: 1, title: 'Chat 1' },
      { id: 2, title: 'Chat 2' },
      { id: 3, title: 'Chat 3' },
    ]);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h2>Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>{chat.title}</li>
          ))}
        </ul>
        <button
          onClick={openModal}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create Chat
        </button>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Instructor Page for Course ID: {id || 'Loading...'}</h2>
      </div>
      <CreateChatModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};
export default InstructorPage;