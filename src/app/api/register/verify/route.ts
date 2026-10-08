import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';
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
  currency: string;
  payment_status: string;
  razorpay_order_id: string;
}

interface MemberRow extends RowDataPacket {
  id: number;
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
    const body = await request.json();
    const { teamId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!teamId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification details.' },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay Signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      await pool.query(
        `UPDATE altst_events_1_registrations SET payment_status = 'FAILED' WHERE team_id = ?`,
        [teamId]
      );
      return NextResponse.json(
        { error: 'Payment signature verification failed. Please contact support if amount was deducted.' },
        { status: 400 }
      );
    }

    // 2. Update registration in database
    await pool.query(
      `UPDATE altst_events_1_registrations 
       SET payment_status = 'PAID', razorpay_payment_id = ?, razorpay_signature = ? 
       WHERE team_id = ?`,
      [razorpay_payment_id, razorpay_signature, teamId]
    );

    // 3. Fetch registration and member details
    const [registrations] = await pool.query<RegistrationRow[]>(
      `SELECT * FROM altst_events_1_registrations WHERE team_id = ?`,
      [teamId]
    );

    if (registrations.length === 0) {
      return NextResponse.json({ error: 'Registration record not found.' }, { status: 404 });
    }

    const reg = registrations[0];

    const [members] = await pool.query<MemberRow[]>(
      `SELECT name, email, phone, college_name, dept, year_of_study, is_leader 
       FROM altst_events_1_members 
       WHERE team_id = ? ORDER BY member_number ASC`,
      [teamId]
    );

    // 4. Send Confirmation Email to all members
    let emailSent = false;
    try {
      await sendTeamConfirmationEmail({
        teamId: reg.team_id,
        teamName: reg.team_name,
        teamSize: reg.team_size,
        ideaTitle: reg.idea_title,
        domain: reg.domain,
        description: reg.description,
        paymentId: razorpay_payment_id,
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
      emailSent = true;
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr);
      // We don't fail the registration if email throws, but record the state
    }

    return NextResponse.json({
      success: true,
      teamId: reg.team_id,
      teamName: reg.team_name,
      paymentId: razorpay_payment_id,
      amount: reg.amount,
      emailSent,
      members,
      message: 'Registration and payment successfully verified!',
    });
  } catch (err: unknown) {
    console.error('Error verifying payment:', err);
    const message = err instanceof Error ? err.message : 'Payment verification error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
