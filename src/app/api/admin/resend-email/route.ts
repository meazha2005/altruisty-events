import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sendTeamConfirmationEmail } from '@/lib/email';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

interface RegistrationRow extends RowDataPacket {
  id: number;
  team_id: string;
  team_name: string;
  team_size: number;
  idea_title: string;
  domain: string;
  description: string;
  amount: number;
  payment_status: string;
  razorpay_payment_id: string | null;
}

interface MemberRow extends RowDataPacket {
  name: string;
  email: string;
  phone: string;
  college_name: string;
  dept: string;
  year_of_study: string;
  is_leader: number;
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { teamId } = await request.json();
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required.' }, { status: 400 });
    }

    const [registrations] = await pool.query<RegistrationRow[]>(
      `SELECT * FROM altst_events_1_registrations WHERE team_id = ?`,
      [teamId]
    );

    if (registrations.length === 0) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    const reg = registrations[0];

    const [members] = await pool.query<MemberRow[]>(
      `SELECT name, email, phone, college_name, dept, year_of_study, is_leader 
       FROM altst_events_1_members 
       WHERE team_id = ? ORDER BY member_number ASC`,
      [teamId]
    );

    const emailResult = await sendTeamConfirmationEmail({
      teamId: reg.team_id,
      teamName: reg.team_name,
      teamSize: reg.team_size,
      ideaTitle: reg.idea_title,
      domain: reg.domain,
      description: reg.description,
      paymentId: reg.razorpay_payment_id || 'MANUAL-CONFIRM',
      amount: reg.amount,
      members: members.map((m) => ({
        name: m.name,
        email: m.email,
        phone: m.phone,
        college_name: m.college_name,
        dept: m.dept,
        year_of_study: m.year_of_study,
        is_leader: Boolean(m.is_leader),
      })),
    });

    await pool.query(
      `UPDATE altst_events_1_registrations SET email_sent = 1 WHERE team_id = ?`,
      [teamId]
    );

    return NextResponse.json({
      success: true,
      message: `Confirmation email sent to ${emailResult.recipientCount} members successfully.`,
    });
  } catch (err: unknown) {
    console.error('Error resending email:', err);
    const message = err instanceof Error ? err.message : 'Failed to send email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
