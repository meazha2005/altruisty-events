import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { razorpay } from '@/lib/razorpay';
import { ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

const VALID_DOMAINS = [
  'edu tech',
  'saas',
  'heath care',
  'cyber security',
  'fintech',
  'bio medical',
  'hardware',
  'automations',
  'agriculture',
  'open innovation',
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      teamName,
      teamSize,
      ideaTitle,
      domain,
      description,
      members,
    } = body;

    // 1. Validation
    if (!teamName || typeof teamName !== 'string' || !teamName.trim()) {
      return NextResponse.json({ error: 'Team name is required.' }, { status: 400 });
    }

    const parsedTeamSize = Number(teamSize);
    if (![2, 3, 4].includes(parsedTeamSize)) {
      return NextResponse.json({ error: 'Team size must be 2, 3, or 4 members.' }, { status: 400 });
    }

    if (!ideaTitle || typeof ideaTitle !== 'string' || !ideaTitle.trim()) {
      return NextResponse.json({ error: 'Idea title is required.' }, { status: 400 });
    }

    if (!domain || !VALID_DOMAINS.includes(domain.toLowerCase())) {
      return NextResponse.json({ error: 'Please select a valid domain from the list.' }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json({ error: 'Idea description is required.' }, { status: 400 });
    }

    if (!Array.isArray(members) || members.length !== parsedTeamSize) {
      return NextResponse.json({
        error: `Please provide details for all ${parsedTeamSize} team members.`,
      }, { status: 400 });
    }

    // Validate each member
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const memberLabel = i === 0 ? 'Leader' : `Member ${i + 1}`;

      if (!m.name || !m.name.trim()) {
        return NextResponse.json({ error: `${memberLabel} name is required.` }, { status: 400 });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!m.email || !emailRegex.test(m.email.trim())) {
        return NextResponse.json({ error: `Please enter a valid email for ${memberLabel}.` }, { status: 400 });
      }

      // Check 10-digit phone
      const phoneDigits = (m.phone || '').toString().replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        return NextResponse.json({ error: `Phone number for ${memberLabel} must be exactly 10 digits.` }, { status: 400 });
      }

      if (!m.college_name || !m.college_name.trim()) {
        return NextResponse.json({ error: `College name is required for ${memberLabel}.` }, { status: 400 });
      }

      if (!m.dept || !m.dept.trim()) {
        return NextResponse.json({ error: `Department is required for ${memberLabel}.` }, { status: 400 });
      }

      if (!m.year_of_study || !m.year_of_study.trim()) {
        return NextResponse.json({ error: `Year of study is required for ${memberLabel}.` }, { status: 400 });
      }
    }

    // Generate unique Team ID
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const teamId = `HP-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

    // 2. Create Razorpay order (149 INR = 14900 paise)
    const amountInINR = 149;
    const amountInPaise = amountInINR * 100;
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: teamId,
      notes: {
        teamId,
        teamName: teamName.trim(),
        leaderName: members[0].name.trim(),
        leaderEmail: members[0].email.trim(),
        leaderPhone: members[0].phone.trim(),
        domain: domain.trim(),
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // 3. Save draft registration and members in DB
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [regResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO altst_events_1_registrations 
        (team_id, team_name, team_size, idea_title, domain, description, amount, currency, payment_status, razorpay_order_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
        [
          teamId,
          teamName.trim(),
          parsedTeamSize,
          ideaTitle.trim(),
          domain.trim(),
          description.trim(),
          amountInINR,
          'INR',
          order.id,
        ]
      );

      const registrationId = regResult.insertId;

      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const isLeader = i === 0 ? 1 : 0;
        const cleanPhone = m.phone.toString().replace(/\D/g, '');

        await connection.query(
          `INSERT INTO altst_events_1_members 
          (registration_id, team_id, member_number, is_leader, name, email, phone, college_name, dept, year_of_study)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            registrationId,
            teamId,
            i + 1,
            isLeader,
            m.name.trim(),
            m.email.trim().toLowerCase(),
            cleanPhone,
            m.college_name.trim(),
            m.dept.trim(),
            m.year_of_study.trim(),
          ]
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        teamId,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_Sq847FjnOyrls1',
      });
    } catch (dbErr) {
      await connection.rollback();
      throw dbErr;
    } finally {
      connection.release();
    }
  } catch (err: unknown) {
    console.error('Error initiating registration:', err);
    const message = err instanceof Error ? err.message : 'Failed to initiate registration';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
