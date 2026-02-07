import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { solutionType, budget, timeline, name, email, company, phone, details } = req.body;

  // Basic validation
  if (!name || !email || !details) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content for the admin
    const mailOptions = {
      from: `"Portfolio Quote Bot" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `🚀 New Project Quote Request: ${solutionType}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">New Quote Request</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold; width: 150px;">Architecture:</td>
              <td style="padding: 10px;">${solutionType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Budget/Investment:</td>
              <td style="padding: 10px;">${budget}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold;">Target Timeline:</td>
              <td style="padding: 10px;">${timeline}</td>
            </tr>
          </table>

          <h3 style="color: #4f46e5; margin-top: 20px;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px; font-weight: bold;">Company:</td>
              <td style="padding: 10px;">${company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${phone || 'N/A'}</td>
            </tr>
          </table>

          <h3 style="color: #4f46e5; margin-top: 20px;">Technical Objectives / Details</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
            ${details}
          </div>

          <p style="font-size: 12px; color: #6b7280; margin-top: 30px; text-align: center;">
            This email was sent from your portfolio's auto-quote system.
          </p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Quote request sent successfully!' });
  } catch (error) {
    console.error('SMTP Error:', error);
    res.status(500).json({ error: 'Failed to send quote request. Please try again later.', details: error.message });
  }
}
