import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { Warden } from '@/app/models/warden'
import { ProjectOwner } from '@/app/models/projectowner'
import { signToken } from '@/app/lib/jwt'
import dbConnect from '@/app/lib/dbconnect'

export async function POST (req: NextRequest) {
  await dbConnect() // Ensure the database connection is established

  try {
    const { email, password } = await req.json()

    // Find the user based on email and type (warden or project-owner)
    let user = await ProjectOwner.findOne({ email })

    // If user is not found in ProjectOwner collection, search in the Warden collection
    if (!user) {
      user = await Warden.findOne({ email })
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 401 })
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      telegramId: user.telegramId,
      role: user.role
    })

    // Successful login
    return NextResponse.json({ token }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Sign-in failed', error: error.message },
      { status: 400 }
    )
  }
}
