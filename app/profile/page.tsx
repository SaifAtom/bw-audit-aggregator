'use client'
import { useAuth } from '@/app/context/authContext'
import { useState, useEffect } from 'react'
import Sidebar from '../components/sidebar'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProfilePage = () => {
  const { user, setUser } = useAuth() // Use context to get and update user info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telegramId, setTelegramId] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(true) // Loading state
  console.log(user);
  useEffect(() => {
    if (user) {
      setName(user.username)
      setEmail(user.email)
      setTelegramId(user.telegramId)
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordMatchError('New password and confirm password do not match')
      } else {
        setPasswordMatchError(null) // Clear the error if passwords match
      }
    } else {
      setPasswordMatchError(null) // Clear the error if either field is empty
    }
  }, [newPassword, confirmPassword])

  const handleSave = async () => {
    if (passwordMatchError) {
      setPasswordError('Please resolve the password mismatch')
      return
    }

    // Check if at least one field is filled
    if (!telegramId && !oldPassword && !newPassword) {
      setPasswordError('Please fill in at least one field to update')
      return
    }

    // Validate password fields if they are filled
    if (
      (oldPassword || newPassword || confirmPassword) &&
      (oldPassword === '' || newPassword === '' || confirmPassword === '')
    ) {
      setPasswordError('Please fill in all password fields')
      return
    }

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id, // Assuming user context has the user ID
          username: name, // Username will not be updated
          email, // Email will not be updated
          telegramId,
          oldPassword, // Include old password if provided
          newPassword // Include new password if provided
        })
      })

      const data = await response.json()

      if (!data.success) {
        console.error(data.error)
        setPasswordError(data.error)
        return
      }

      // Clear password fields and errors after successful update
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError(null)
      setPasswordMatchError(null)

      // Update context with new profile info (no password in context)
      setUser({
        ...user,
        id: user?.id ?? '',
        username: name,
        email,
        telegramId,
        role: user?.role ?? ''
      })

      // Show success message
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile', error)
      setPasswordError('Error updating profile')
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-r from-[#181e2e] to-[#1f243c] p-4 text-white'></div>
    ) 
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#181e2e] to-[#1f243c] p-4 text-white'>
      <div className='flex flex-row ml-[25%] p-5 text-white'>
        <Sidebar />
        <div className='flex flex-col w-full'>
          <h1 className='text-3xl font-bold mb-4'>Update Profile</h1>
          <div className='bg-[#242432] p-4 rounded-lg'>
            <label className='block mb-2'>Username:</label>
            <input
              type='text'
              value={name}
              readOnly
              className='w-full p-2 mb-4 bg-[#111723] rounded-md cursor-not-allowed'
            />
            <label className='block mb-2'>Email:</label>
            <input
              type='email'
              value={email}
              readOnly
              className='w-full p-2 mb-4 bg-[#111723] rounded-md cursor-not-allowed'
            />
            <label className='block mb-2'>Telegram ID:</label>
            <input
              type='text'
              value={telegramId}
              onChange={e => setTelegramId(e.target.value)}
              className='w-full p-2 mb-4 bg-[#111723] rounded-md'
            />
            <label className='block mb-2'>Old Password:</label>
            <input
              type='password'
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className='w-full p-2 mb-4 bg-[#111723] rounded-md'
            />
            <label className='block mb-2'>New Password:</label>
            <input
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className='w-full p-2 mb-4 bg-[#111723] rounded-md'
            />
            <label className='block mb-2'>Confirm Password:</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className='w-full p-2 mb-4 bg-[#111723] rounded-md'
            />
            {passwordMatchError && (
              <div className='text-red-500 mb-4'>{passwordMatchError}</div>
            )}
            {passwordError && (
              <div className='text-red-500 mb-4'>{passwordError}</div>
            )}
            <button
              onClick={handleSave}
              className='bg-[#00beea] px-5 py-3 rounded-lg font-medium text-xl'
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  )
}

export default ProfilePage
