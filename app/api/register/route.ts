import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Warden } from '@/app/models/warden';
import { ProjectOwner } from '@/app/models/projectowner';
import dbConnect from '@/app/lib/dbconnect';

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure the database connection is established

  try {
    const { username, email, telegramId, password, registerType } = await req.json();

    // Check if email or username already exists
    const existingUser =
      registerType === 'warden'
        ? await Warden.findOne({ $or: [{ email }, { username }] })
        : await ProjectOwner.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return NextResponse.json({ message: 'Email or username already exists.' }, { status: 409 });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    if (registerType === 'warden') {
      const newWarden = new Warden({
        username,
        email,
        telegramId,
        password: hashedPassword, // Store hashed password
        role: 'warden',
      });
      await newWarden.save();
    } else if (registerType === 'project-owner') {
      const newProjectOwner = new ProjectOwner({
        username,
        email,
        telegramId,
        password: hashedPassword, // Store hashed password
        role: 'projectOwner',
      });
      await newProjectOwner.save();
    }

    return NextResponse.json({ message: 'Registration successful!' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Registration failed', error: error.message }, { status: 400 });
  }
}
