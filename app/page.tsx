'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Sidebar from './components/sidebar/page';
import ProjectsPage from './projectsPage/page';
import AuthPopup from './components/authPopup/page';
import { useAuth } from './context/authContext';
import { jwtDecode } from 'jwt-decode';

function HomePage() {
  const { user, setUser } = useAuth();
  const [filter, setFilter] = useState<string>('All');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleFilterClick = (status: string) => {
    setFilter(status);
  };

  const handleSignIn = (token: string) => {
    const decodedToken: any = jwtDecode(token);
    setUser({
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
      telegramId: decodedToken.telegramId,
      role: decodedToken.role
    });
    localStorage.setItem('authToken', token);
    closePopup();
  };

  const renderFilterButton = (status: string, icon: string) => (
    <div
      className={`flex flex-row p-2 rounded-lg hover:bg-[#2a2f49] transition-colors duration-200 ${
        filter === status ? 'bg-[#2a2f49]' : ''
      }`}
      onClick={() => handleFilterClick(status)}
    >
      <Image src={`/icons/${icon}.svg`} alt={status.toLowerCase()} width={20} height={20} />
      <button className='mx-2'>{status}</button>
    </div>
  );

  return (
    <div className='bg-gradient-to-r from-[#181e2e] to-[#1f243c] pt-4'>
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
          {renderFilterButton('All', 'all')}
          {renderFilterButton('Open', 'active')}
          {renderFilterButton('Closed', 'closed')}
        </div>
        <div className='mt-10'>
          <ProjectsPage filter={filter} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
