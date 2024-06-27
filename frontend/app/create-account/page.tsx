"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import backend from '@/api/backend';

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleCreateAccount = async () => {
    try {
      const response = await backend.post('/users', { name, password });
      if (response.status === 200) {
        alert('Account created successfully');
        // Redirect to login page after successful account creation
        router.push('/login');
      }
    } catch (error) {
      console.error('Create account error:', error);
      alert('Account creation failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Create Account</h1>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={handleCreateAccount} style={{ marginBottom: '10px' }}>Create Account</button>
      <button onClick={() => router.push('/login')}>Back to Login</button>
    </div>
  );
};

export default CreateAccountPage;
