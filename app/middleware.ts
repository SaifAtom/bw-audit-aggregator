import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { JwtPayload } from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'No token provided.' }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
  }

  // Attach user to the request for further processing
  req.nextUrl.pathname = `/protected/${(user as JwtPayload).id}`;
  return NextResponse.next();
}
