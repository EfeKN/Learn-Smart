"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import backend from '@/api/backend';

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await backend.post('/login', { name, password });
      if (response.status === 200) {
        alert('Login successful');
        // Redirect to another page after successful login
        router.push('/genai');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  const handleCreateAccount = () => {
    // Redirect to create account page or handle account creation
    router.push('/create-account');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
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
      <button onClick={handleLogin} style={{ marginBottom: '10px' }}>Login</button>
      <button onClick={handleCreateAccount}>Create Account</button>
    </div>
  );
};

export default LoginPage;
