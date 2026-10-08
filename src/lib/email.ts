import nodemailer from 'nodemailer';

interface MemberInfo {
  name: string;
  email: string;
  phone: string;
  college_name: string;
  dept: string;
  year_of_study: string;
  is_leader: boolean;
}

interface TeamRegistrationEmailData {
  teamId: string;
  teamName: string;
  teamSize: number;
  ideaTitle: string;
  domain: string;
  description: string;
  paymentId: string;
  amount: number;
  members: MemberInfo[];
}

export async function sendTeamConfirmationEmail(data: TeamRegistrationEmailData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'founder@ztoitech.com',
      pass: process.env.SMTP_PASS || 'hdtamaqpmfwhyghg',
    },
  });

  const memberEmails = data.members
    .map((m) => m.email.trim())
    .filter((email) => email && email.includes('@'));

  if (memberEmails.length === 0) {
    throw new Error('No valid member emails found to send confirmation.');
  }

  const leader = data.members.find((m) => m.is_leader) || data.members[0];

  const membersListHtml = data.members
    .map(
      (m, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; color: #0f172a; font-size: 14px; font-weight: ${m.is_leader ? '600' : '400'};">
          ${m.is_leader ? '👑 ' : ''}${m.name} ${m.is_leader ? '<span style="background: #0284c7; color: #ffffff; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">Leader</span>' : `<span style="color: #64748b; font-size: 12px;">(Member ${idx + 1})</span>`}
        </td>
        <td style="padding: 10px 12px; color: #475569; font-size: 13px;">${m.email}</td>
        <td style="padding: 10px 12px; color: #475569; font-size: 13px;">${m.phone}</td>
        <td style="padding: 10px 12px; color: #475569; font-size: 13px;">${m.college_name} (${m.dept} - ${m.year_of_study})</td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HackPick Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" width="100%" style="max-width: 640px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b192c 0%, #0c2b5e 60%, #0284c7 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #00b4d8;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px;">
                ALTRUISTY INNOVATION PRESENTS
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 1px;">
                HACK<span style="color: #38bdf8;">PICK</span> 2026
              </h1>
              <div style="margin-top: 4px; font-size: 13px; color: #e0f2fe; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                National Level Hackathon • Ideate. Build. Present.
              </div>
              <div style="display: inline-block; margin-top: 16px; background: #22c55e; color: #ffffff; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;">
                ✓ REGISTRATION CONFIRMED • ₹${data.amount || 149}
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Dear <strong>${leader.name}</strong> & Team <strong>${data.teamName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Congratulations! Your team registration for <strong>HACKPICK 2026</strong> has been successfully received and verified. You have officially taken the first step toward the HackPick Grand Finale!
              </p>

              <!-- Team Pass Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #dcfce7; background: #e0f2fe;">
                    <div style="font-size: 11px; color: #0369a1; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Team Registration ID</div>
                    <div style="font-size: 22px; font-weight: 800; color: #0b192c; letter-spacing: 1.5px; margin-top: 4px; font-family: monospace;">
                      ${data.teamId}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; width: 40%;">Team Name:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${data.teamName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Domain:</td>
                        <td style="padding: 5px 0; color: #0284c7; font-size: 14px; font-weight: 700; text-transform: capitalize;">${data.domain}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Idea Title:</td>
                        <td style="padding: 5px 0; color: #0f172a; font-size: 14px;">${data.ideaTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Payment Status:</td>
                        <td style="padding: 5px 0; color: #16a34a; font-size: 14px; font-weight: 700;">PAID (₹${data.amount || 149})</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Razorpay Payment ID:</td>
                        <td style="padding: 5px 0; color: #334155; font-size: 13px; font-family: monospace;">${data.paymentId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Roadmap / Timeline Box -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">
                  🗓️ Event Roadmap & Stages
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; color: #475569;">
                  <tr>
                    <td style="padding: 4px 0;"><strong>Registration Closes:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">October 20, 2026</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;"><strong>Round 1 Results:</strong></td>
                    <td style="padding: 4px 0; color: #0284c7; font-weight: 600;">November 2, 2026 (Top 100 advance)</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;"><strong>Round 2 Online PPT:</strong></td>
                    <td style="padding: 4px 0; color: #0f172a;">Weekend in November 2026 (Online)</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;"><strong>Round 3 Grand Finale:</strong></td>
                    <td style="padding: 4px 0; color: #16a34a; font-weight: 700;">December 5, 2026 (Offline - Top 25)</td>
                  </tr>
                </table>
              </div>

              <!-- Members Table -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Registered Team Members (${data.members.length})
                </div>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow-x: auto;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; min-width: 500px;">
                    <thead>
                      <tr style="background: #f1f5f9; text-align: left;">
                        <th style="padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase;">Name</th>
                        <th style="padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase;">Email</th>
                        <th style="padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase;">Phone</th>
                        <th style="padding: 10px 12px; font-size: 12px; color: #475569; text-transform: uppercase;">College & Dept</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${membersListHtml}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Prizes Summary -->
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 700; color: #854d0e; margin-bottom: 6px;">
                  🏆 Prizes & Recognition at Stake:
                </div>
                <div style="font-size: 13px; color: #713f12; line-height: 1.6;">
                  • 🥇 <strong>1st Prize:</strong> ₹10,000 Cash Prize + Internship with Stipend<br/>
                  • 🥈 <strong>2nd Prize:</strong> ₹8,000 Cash Prize + Internship with Stipend<br/>
                  • 🥉 <strong>3rd Prize:</strong> ₹6,000 Cash Prize + Internship with Stipend<br/>
                  • ⭐ <strong>Best Performing Team:</strong> Internship with Stipend + Certificate
                </div>
              </div>

              <!-- Contact & Support -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; text-align: center; font-size: 13px; color: #64748b; line-height: 1.6;">
                <p style="margin: 0 0 4px 0;"><strong>Need Assistance or Have Questions?</strong></p>
                <p style="margin: 0;">
                  📞 Phone: <a href="tel:8667839838" style="color: #0284c7; text-decoration: none; font-weight: 600;">8667839838</a> &nbsp;|&nbsp; 
                  ✉️ Email: <a href="mailto:altruistybusiess@gmail.com" style="color: #0284c7; text-decoration: none; font-weight: 600;">altruistybusiess@gmail.com</a>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #0b192c; font-weight: 700;">
                Altruisty Innovation • HACKPICK 2026
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Keep your Team ID safe for all future announcements and submissions.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Altruisty Innovation" <founder@ztoitech.com>',
    to: memberEmails.join(', '),
    subject: `Registration Confirmed: ${data.teamName} [${data.teamId}] - HACKPICK National Hackathon`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId, recipientCount: memberEmails.length };
}
