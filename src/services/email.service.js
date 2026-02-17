const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, 
            to, subject, text, html, 
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// --- BASE CSS FOR DARK MODE & MOBILE ---
// This is injected into the <head> of all emails to ensure they look perfect everywhere.
const emailHeadStyles = `
  <style>
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .email-body { padding: 20px !important; }
    }
    @media (prefers-color-scheme: dark) {
      body, .bg-main { background-color: #0f172a !important; }
      .bg-card { background-color: #1e293b !important; }
      .text-main { color: #f1f5f9 !important; }
      .text-muted { color: #94a3b8 !important; }
      .bg-box { background-color: #334155 !important; border-color: #475569 !important; }
      .bg-success-box { background-color: #064e3b !important; border-color: #065f46 !important; }
      .bg-danger-box { background-color: #7f1d1d !important; border-color: #991b1b !important; }
    }
  </style>
`;

// 1. REGISTRATION EMAIL
async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Backend Ledger 🚀";
    const text = `Hello ${name},\n\nWelcome to Backend Ledger! Log in to your dashboard to get started.\n\nThe Backend Ledger Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ${emailHeadStyles}
    </head>
    <body class="bg-main" style="margin:0; padding:0; background-color:#f8fafc; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table class="email-container bg-card" width="100%" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin:0; font-size:26px; font-weight:800; color:#ffffff; letter-spacing: -0.5px;">Backend Ledger</h1>
                </td>
              </tr>

              <tr>
                <td class="email-body text-main" style="padding: 40px 40px; color:#334155;">
                  <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 700;">Welcome aboard, ${name}! 👋</h2>
                  <p class="text-muted" style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color:#475569;">
                    We're thrilled to have you with us. Our platform is designed to make your financial tracking and transfers secure, fast, and completely seamless.
                  </p>

                  <table class="bg-box" width="100%" cellpadding="24" cellspacing="0" style="background:#f1f5f9; border-radius:8px; margin: 0 0 32px;">
                    <tr>
                      <td>
                        <h3 class="text-main" style="margin:0 0 16px; font-size:16px; font-weight:600;">🚀 Quick Start Guide:</h3>
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px; line-height:1.8;">
                          <tr>
                            <td width="28" valign="top" style="color:#4f46e5; font-weight:bold;">1.</td>
                            <td class="text-muted" style="padding-bottom:12px; color:#475569;"><strong>Complete your profile</strong> to secure your account.</td>
                          </tr>
                          <tr>
                            <td width="28" valign="top" style="color:#4f46e5; font-weight:bold;">2.</td>
                            <td class="text-muted" style="padding-bottom:12px; color:#475569;"><strong>Link a funding source</strong> to move money.</td>
                          </tr>
                          <tr>
                            <td width="28" valign="top" style="color:#4f46e5; font-weight:bold;">3.</td>
                            <td class="text-muted" style="color:#475569;"><strong>Make your first transfer</strong> via API or dashboard.</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <div style="text-align:center;">
                    <a href="https://yourdomain.com/dashboard" style="background-color:#4f46e5; color:#ffffff; text-decoration:none; padding:16px 32px; border-radius:8px; font-size:16px; font-weight:600; display:inline-block;">Go to My Dashboard</a>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td class="bg-card text-muted" style="padding: 30px 40px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                  © ${new Date().getFullYear()} Backend Ledger. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
    await sendEmail(userEmail, subject, text, html);
}

// 2. TRANSACTION SUCCESS EMAIL
async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Successful ✅ - Backend Ledger";
    const last4 = toAccount.toString().slice(-4)
    const text = `Hello ${name},\n\nYour transfer of $${amount} to account ending in ${last4} was successful.\n\nThe Backend Ledger Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ${emailHeadStyles}
    </head>
    <body class="bg-main" style="margin:0; padding:0; background-color:#f8fafc; font-family: system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table class="email-container bg-card" width="100%" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%); padding: 30px; text-align: center;">
                  <h1 style="margin:0; font-size:22px; font-weight:800; color:#ffffff;">Backend Ledger</h1>
                </td>
              </tr>

              <tr>
                <td class="email-body text-main" style="padding: 40px 40px; color:#334155;">
                  <div style="text-align:center; margin-bottom: 24px;">
                    <div style="background-color: #d1fae5; color: #059669; width: 64px; height: 64px; border-radius: 50%; display: inline-block; line-height: 64px; font-size: 32px;">✓</div>
                  </div>
                  <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; text-align:center;">Transfer Successful</h2>
                  <p class="text-muted" style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color:#475569; text-align:center;">
                    Hello ${name}, your transaction has been processed and completed successfully.
                  </p>

                  <table class="bg-success-box" width="100%" cellpadding="24" cellspacing="0" style="background:#f0fdf4; border: 1px solid #bbf7d0; border-radius:8px; margin: 0 0 32px;">
                    <tr>
                      <td align="center" style="border-bottom: 1px solid #d1fae5; padding-bottom: 24px;">
                        <p style="margin: 0 0 8px; font-size: 14px; color: #059669; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Amount Sent</p>
                        <p style="margin: 0; font-size: 42px; font-weight: 800; color: #047857;">$${amount}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 24px;">
                        <table width="100%" style="font-size: 15px;">
                          <tr>
                            <td class="text-muted" style="padding-bottom: 12px; color: #475569;">Destination</td>
                            <td class="text-main" align="right" style="padding-bottom: 12px; font-weight: 600;">${toAccount}</td>
                          </tr>
                          <tr>
                            <td class="text-muted" style="padding-bottom: 12px; color: #475569;">Date</td>
                            <td class="text-main" align="right" style="padding-bottom: 12px; font-weight: 600;">${new Date().toLocaleDateString()}</td>
                          </tr>
                          <tr>
                            <td class="text-muted" style="color: #475569;">Reference ID</td>
                            <td class="text-main" align="right" style="font-weight: 600; color:#4f46e5;">#TRX-${Math.floor(Math.random() * 1000000)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p class="text-muted" style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
                    If you didn't authorize this, please <a href="#" style="color:#4f46e5; text-decoration:none;">contact support</a> immediately.
                  </p>
                </td>
              </tr>
              
              <tr>
                <td class="bg-card text-muted" style="padding: 30px 40px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                  © ${new Date().getFullYear()} Backend Ledger. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
    await sendEmail(userEmail, subject, text, html);
}

// 3. TRANSACTION FAILURE EMAIL
async function sendTransactionFailureEmail(userEmail, name, amount) {
    const subject = "Action Required: Transaction Failed ❌";
    const text = `Hello ${name},\n\nWe were unable to process your recent transfer of $${amount}.\nPlease check your account.\n\nThe Backend Ledger Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      ${emailHeadStyles}
    </head>
    <body class="bg-main" style="margin:0; padding:0; background-color:#f8fafc; font-family: system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table class="email-container bg-card" width="100%" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%); padding: 30px; text-align: center;">
                  <h1 style="margin:0; font-size:22px; font-weight:800; color:#ffffff;">Backend Ledger</h1>
                </td>
              </tr>

              <tr>
                <td class="email-body text-main" style="padding: 40px 40px; color:#334155;">
                  <div style="text-align:center; margin-bottom: 24px;">
                    <div style="background-color: #fee2e2; color: #e11d48; width: 64px; height: 64px; border-radius: 50%; display: inline-block; line-height: 64px; font-size: 32px;">✕</div>
                  </div>
                  <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; text-align:center;">Transfer Failed</h2>
                  <p class="text-muted" style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color:#475569; text-align:center;">
                    Hello ${name}, we encountered an issue and couldn't process your transaction.
                  </p>

                  <table class="bg-danger-box" width="100%" cellpadding="24" cellspacing="0" style="background:#fff1f2; border: 1px solid #fecdd3; border-radius:8px; margin: 0 0 32px;">
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 8px; font-size: 14px; color: #e11d48; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Attempted Amount</p>
                        <p style="margin: 0 0 16px; font-size: 42px; font-weight: 800; color: #be123c;">$${amount}</p>
                        <div style="background-color: #ffe4e6; border-radius: 6px; padding: 12px; font-size: 14px; color: #9f1239; line-height: 1.5;">
                          <strong>Reason:</strong> Your bank declined the transaction or there were insufficient funds.
                        </div>
                      </td>
                    </tr>
                  </table>

                  <div style="text-align:center;">
                    <a href="https://yourdomain.com/settings/billing" style="background-color:#e11d48; color:#ffffff; text-decoration:none; padding:16px 32px; border-radius:8px; font-size:16px; font-weight:600; display:inline-block;">Review Payment Methods</a>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td class="bg-card text-muted" style="padding: 30px 40px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                  © ${new Date().getFullYear()} Backend Ledger. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
}