'use client';

import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Image from 'next/image';
import ProjectsPage from '../projectsPage';
import AuthPopup from '../components/authPopup';
import { useAuth } from '../context/authContext';
import { jwtDecode } from 'jwt-decode';

function HomePage() {
  const { user, setUser } = useAuth(); // Use the auth context
  const [filter, setFilter] = useState<string>('All');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const handleFilterClick = (status: string) => {
    setFilter(status);
  };
  const handleSignIn = (token: string) => {
    // Decode token to get user info
    const decodedToken: any = jwtDecode(token);
    setUser({
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
      telegramId: decodedToken.telegramId,
      role: decodedToken.role
    });
    localStorage.setItem('authToken', token); // Store token on successful sign-in
    closePopup(); // Close popup on successful sign-in
  };
  

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#181e2e] to-[#1f243c] pt-4'>
      <Sidebar />
      <div className='flex flex-col text-white p-4 ml-[25%] mr-[10%]'>
        <div className='flex flex-row justify-between'>
          <div className='font-bold text-3xl m-2'>All Audits</div>
          <div>
            {!user && (
              <button
                onClick={openPopup}
                className='flex flex-row items-center bg-[#00beea] px-5 py-3 rounded-lg font-medium text-xl'
              >
                <Image
                  src='/icons/logo-white.svg'
                  alt='search'
                  width={50}
                  height={50}
                />
                Find Wardens
              </button>
            )}
            <AuthPopup isOpen={isPopupOpen} onClose={closePopup} onSignIn={handleSignIn} />
          </div>
        </div>
        <div className='flex flex-row bg-[#59627f] w-fit p-1 space-x-2 rounded-lg'>
          <div
            className={`flex flex-row p-2 rounded-lg hover:bg-[#2a2f49] transition-colors duration-200 ${
              filter === 'All' ? 'bg-[#2a2f49]' : ''
            }`}
            onClick={() => handleFilterClick('All')}
          >
            <Image src='/icons/all.svg' alt='all' width={20} height={20} />
            <button className='mx-2'>All</button>
          </div>
          <div
            className={`flex flex-row p-2 rounded-lg hover:bg-[#2a2f49] transition-colors duration-200 ${
              filter === 'Open' ? 'bg-[#2a2f49]' : ''
            }`}
            onClick={() => handleFilterClick('Open')}
          >
            <Image
              src='/icons/active.svg'
              alt='active'
              width={20}
              height={20}
            />
            <button className='mx-2'>Active</button>
          </div>
          <div
            className={`flex flex-row p-2 rounded-lg hover:bg-[#2a2f49] transition-colors duration-200 ${
              filter === 'Closed' ? 'bg-[#2a2f49]' : ''
            }`}
            onClick={() => handleFilterClick('Closed')}
          >
            <Image
              src='/icons/closed.svg'
              alt='closed'
              width={20}
              height={20}
            />
            <button className='mx-2'>Closed</button>
          </div>
        </div>
        <div className='mt-10'>
          <ProjectsPage filter={filter} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
