'use client';
import React, { useState } from 'react'
import validator from 'validator'

interface AuthPopupProps {
  isOpen: boolean
  onClose: () => void
  onSignIn: (token: string) => void; // New prop for handling sign-in
}

const AuthPopup: React.FC<AuthPopupProps> = ({ isOpen, onClose, onSignIn }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [registerType, setRegisterType] = useState<'projectowner' | 'warden' | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-gray-800">Welcome to Blockwarden</h2>
          <button className="text-gray-500 hover:text-gray-700 text-3xl" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="mb-4">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 text-sm font-medium text-center rounded-t-lg ${activeTab === 'signin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setRegisterType(null); // Reset registerType when switching to register tab
              }}
              className={`flex-1 py-2 text-sm font-medium text-center rounded-t-lg ${activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Register
            </button>
          </div>
        </div>
        {activeTab === 'signin' ? (
          <SignInForm onSignIn={onSignIn} />
        ) : (
          <RegisterForm
            registerType={registerType}
            setRegisterType={setRegisterType}
          />
        )}
      </div>
    </div>
  );
};


const SignInForm: React.FC<{ onSignIn: (token: string) => void }> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!validator.isEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!validator.isLength(password, { min: 6 })) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage or cookies
        localStorage.setItem('token', data.token);
        onSignIn(data.token); // Call onSignIn with the token
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please try again.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          type="email"
          id="signin-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">
          Password:
        </label>
        <input
          type="password"
          id="signin-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign In
      </button>
    </form>
  );
};

const RegisterForm: React.FC<{
  registerType: 'projectowner' | 'warden' | null
  setRegisterType: React.Dispatch<
    React.SetStateAction<'projectowner' | 'warden' | null>
  >
}> = ({ registerType, setRegisterType }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [telegramId, setTelegramId] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerType) {
      setErrorMessage('Please select a registration type.')
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          telegramId,
          password,
          registerType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Registration successful!')
        setErrorMessage('')
        // Optionally reset form fields
        setUsername('')
        setEmail('')
        setTelegramId('')
        setPassword('')
        setRegisterType(null)
      } else {
        setErrorMessage(data.message || 'Registration failed.')
        setSuccessMessage('')
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.')
      setSuccessMessage('')
    }
  }

  return (
    <div>
      {registerType === null ? (
        <div className='flex flex-col space-y-4 mb-4'>
          <button
            onClick={() => setRegisterType('projectowner')}
            className={`py-2 text-sm font-medium rounded-lg ${
              registerType === 'projectowner'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Project Owner
          </button>
          <button
            onClick={() => setRegisterType('warden')}
            className={`py-2 text-sm font-medium rounded-lg ${
              registerType === 'warden'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Warden
          </button>
        </div>
      ) : (
        <form className='space-y-4' onSubmit={handleRegister}>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-gray-700'
            >
              Username:
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email:
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>
          <div>
            <label
              htmlFor='telegram-id'
              className='block text-sm font-medium text-gray-700'
            >
              Telegram ID:
            </label>
            <input
              type='text'
              id='telegram-id'
              name='telegramId'
              value={telegramId}
              onChange={e => setTelegramId(e.target.value)}
              required
              className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password:
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>
          {errorMessage && (
            <div className='text-red-500 text-sm'>{errorMessage}</div>
          )}
          {successMessage && (
            <div className='text-green-500 text-sm'>{successMessage}</div>
          )}
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Register
          </button>
        </form>
      )}
    </div>
  )
}

export default AuthPopup
