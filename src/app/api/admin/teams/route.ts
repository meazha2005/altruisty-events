import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
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
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  email_sent: number;
  created_at: string;
}

interface MemberRow extends RowDataPacket {
  id: number;
  registration_id: number;
  team_id: string;
  member_number: number;
  is_leader: number;
  name: string;
  email: string;
  phone: string;
  college_name: string;
  dept: string;
  year_of_study: string;
}

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const domainFilter = searchParams.get('domain')?.trim() || '';
    const statusFilter = searchParams.get('status')?.trim() || '';

    // Fetch all registrations
    const [registrations] = await pool.query<RegistrationRow[]>(
      `SELECT * FROM altst_events_1_registrations ORDER BY created_at DESC`
    );

    // Fetch all members
    const [allMembers] = await pool.query<MemberRow[]>(
      `SELECT * FROM altst_events_1_members ORDER BY member_number ASC`
    );

    // Group members by team_id
    const membersByTeam = new Map<string, MemberRow[]>();
    for (const member of allMembers) {
      if (!membersByTeam.has(member.team_id)) {
        membersByTeam.set(member.team_id, []);
      }
      membersByTeam.get(member.team_id)!.push(member);
    }

    // Combine teams with members
    let combined = registrations.map((team) => {
      const members = membersByTeam.get(team.team_id) || [];
      const leader = members.find((m) => m.is_leader === 1) || members[0];
      return {
        ...team,
        leaderName: leader ? leader.name : 'Unknown',
        leaderEmail: leader ? leader.email : 'Unknown',
        leaderPhone: leader ? leader.phone : 'Unknown',
        members,
      };
    });

    // Calculate overall stats before filter
    const totalTeams = registrations.length;
    const paidTeams = registrations.filter((r) => r.payment_status === 'PAID');
    const totalPaid = paidTeams.length;
    const totalRevenue = paidTeams.reduce((sum, r) => sum + (r.amount || 99), 0);
    const totalParticipants = paidTeams.reduce((sum, r) => sum + (r.team_size || 0), 0);

    const domainBreakdown: Record<string, number> = {};
    for (const r of paidTeams) {
      domainBreakdown[r.domain] = (domainBreakdown[r.domain] || 0) + 1;
    }

    // Apply filters
    if (statusFilter && statusFilter !== 'ALL') {
      combined = combined.filter((r) => r.payment_status === statusFilter);
    }

    if (domainFilter && domainFilter !== 'ALL') {
      combined = combined.filter((r) => r.domain.toLowerCase() === domainFilter.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      combined = combined.filter((r) => {
        const teamMatch =
          r.team_name.toLowerCase().includes(q) ||
          r.team_id.toLowerCase().includes(q) ||
          r.idea_title.toLowerCase().includes(q) ||
          (r.razorpay_payment_id && r.razorpay_payment_id.toLowerCase().includes(q));

        const memberMatch = r.members.some(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.phone.toLowerCase().includes(q) ||
            m.college_name.toLowerCase().includes(q) ||
            m.dept.toLowerCase().includes(q)
        );

        return teamMatch || memberMatch;
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalTeams,
        totalPaid,
        totalRevenue,
        totalParticipants,
        domainBreakdown,
      },
      teams: combined,
    });
  } catch (err: unknown) {
    console.error('Error fetching admin teams:', err);
    return NextResponse.json({ error: 'Failed to retrieve teams data.' }, { status: 500 });
  }
}
