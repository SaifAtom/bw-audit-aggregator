'use client' // Ensure this is a client component

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AuthPopup from '../authPopup'
import { jwtDecode } from 'jwt-decode' // Use default import
import { useAuth } from '@/app/context/authContext'
import { useRouter } from 'next/navigation'

// Define the user type with all fields
interface User {
  _id: string
  username: string
  email: string
  telegramId: string
  password: string // Note: Storing passwords is generally not recommended
}

const Sidebar = () => {
  const router = useRouter() // Initialize useRouter

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const { user, setUser } = useAuth() // Using context for user state

  const openPopup = () => setIsPopupOpen(true)
  const closePopup = () => setIsPopupOpen(false)
  const [loading, setLoading] = useState(true) // Loading state
  console.log(user);
  useEffect(() => {
    if (user) {
      setLoading(false)
    }
  }, [user])
  const handleSignIn = (token: string) => {
    try {
      // Decode token to get user info
      const decodedToken: any = jwtDecode(token)
      setUser({
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        telegramId: decodedToken.telegramId,
        role: decodedToken.role
      })
      localStorage.setItem('authToken', token) // Store token on successful sign-in
      closePopup() // Close popup on successful sign-in
    } catch (error) {
      console.error('Token decoding failed', error)
    }
  }

  const handleSignOut = () => {
    setUser(null) // Clear user state
    localStorage.removeItem('authToken') // Remove token from localStorage
    router.push('/') // Navigate to the home page
  }
  const navigateToProfile = () => {
    if (user) {
      router.push('/profile') // Navigate to the profile page
    }
  }
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-r from-[#181e2e] to-[#1f243c] p-4 text-white'></div>
    ) 
  }
  return (
    <div className='fixed top-0 left-0 h-screen w-1/6 bg-[#111723] text-white p-4 flex flex-col'>
      <div className='flex flex-col items-center mt-4'>
        <Image
          onClick={() => router.push('/')}
          src='/icons/logo-white.svg'
          alt='logo blockwarden'
          width={150}
          height={150}
        />
      </div>

      <div className='flex flex-row bg-[#242432] hover:bg-[#2a2f49] duration-200 w-full p-3 mt-10'>
        <Image
          src='/icons/all-items.svg'
          alt='all audits'
          width={25}
          height={25}
        />
        <Link href={'/'}>
          <button className='ml-2'>All Audits</button>
        </Link>
      </div>
      {user?.role === 'projectOwner' && (
        <div className='flex flex-row bg-[#242432] hover:bg-[#2a2f49] duration-200 w-full p-3 mt-5'>
          <Image
            src='/icons/dashboard.svg'
            alt='all audits'
            width={25}
            height={25}
          />
          <Link href={'/'}>
            <button className='ml-2'>My projects</button>
          </Link>
        </div>
      )}

      <div className='flex flex-row bg-[#242432] hover:bg-[#2a2f49] duration-200 w-full rounded-sm p-3 mt-5'>
        <Image
          src='/icons/feedback.svg'
          alt='feedback'
          width={25}
          height={25}
        />
        <button className='ml-2'>Feedback</button>
      </div>

      <div className='flex flex-col mt-auto p-5'>
        <div className='flex flex-col bg-white text-black rounded-lg p-3'>
          <div className='font-bold'>Join our Community</div>
          <div className='font-thin text-sm'>
            Get help from our team and share your ideas freely.
          </div>
        </div>

        <div className='flex flex-row gap-3 mt-5'>
          {user ? (
            <>
              <button
                onClick={navigateToProfile} // Use the new function to navigate
                className='flex items-center justify-center bg-[#242432] p-2 rounded-lg font-medium text-xl'
                style={{ flexBasis: '80%' }}
              >
                <Image
                  src={'/icons/logo-white.svg'}
                  alt='logo blockwarden'
                  width={50}
                  height={50}
                />
                <span className='ml-2'>{user.username}</span>
              </button>
              <button
                onClick={handleSignOut}
                className='flex items-center justify-center bg-[#242432] p-2 rounded-lg font-medium text-xl'
                style={{ flexBasis: '20%' }}
              >
                <Image
                  src={'/icons/logout.svg'}
                  alt='logo blockwarden'
                  width={25}
                  height={25}
                  className='m-2'
                ></Image>
              </button>
            </>
          ) : (
            <button
              onClick={openPopup}
              className='flex flex-row justify-center items-center bg-[#242432] w-full p-4 font-medium text-xl'
            >
              <Image
                src={'/icons/logo-white.svg'}
                alt='logo blockwarden'
                width={50}
                height={50}
              />
              Sign In
            </button>
          )}
        </div>
        <AuthPopup
          isOpen={isPopupOpen}
          onClose={closePopup}
          onSignIn={handleSignIn}
        />
      </div>
    </div>
  )
}

export default Sidebar
