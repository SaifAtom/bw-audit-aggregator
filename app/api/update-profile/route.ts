import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { Warden } from '@/app/models/warden';
import { ProjectOwner } from '@/app/models/projectowner';
import dbConnect from '@/app/lib/dbconnect';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, username, email, telegramId, oldPassword, newPassword } = await req.json();

    // Find the user in both Warden and ProjectOwner collections
    const user = await Warden.findById(userId) || await ProjectOwner.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Update profile information
    if (username) user.username = username;
    if (email) user.email = email;
    if (telegramId) user.telegramId = telegramId;

    // If password fields are provided, update the password
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'Incorrect old password' }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save the updated user info in the database
    await user.save();

    return NextResponse.json({ success: true, message: 'Profile updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
