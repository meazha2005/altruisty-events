import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { setAdminSessionCookie } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface AdminRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const [admins] = await pool.query<AdminRow[]>(
      'SELECT id, username, password_hash FROM altst_events_1_admins WHERE username = ?',
      [username.trim()]
    );

    if (admins.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    await setAdminSessionCookie({
      userId: admin.id,
      username: admin.username,
    });

    return NextResponse.json({
      success: true,
      username: admin.username,
    });
  } catch (err: unknown) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
