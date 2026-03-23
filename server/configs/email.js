import nodemailer from 'nodemailer';

const smtpHost = (process.env.SMTP_HOST || '').trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = (process.env.SMTP_USER || '').trim();
const smtpPass = (process.env.SMTP_PASS || '').trim();
const emailFrom = (process.env.EMAIL_FROM || '').trim();

if (!smtpHost || !smtpUser || !smtpPass || !emailFrom) {
  const missing = []
  if (!smtpHost) missing.push('SMTP_HOST')
  if (!smtpPort) missing.push('SMTP_PORT')
  if (!smtpUser) missing.push('SMTP_USER')
  if (!smtpPass) missing.push('SMTP_PASS')
  if (!emailFrom) missing.push('EMAIL_FROM')
  console.error('SMTP config missing:', missing.join(', '), '. Please set these variables in .env')
}

if (!smtpUser || !smtpPass) {
  throw new Error('SMTP user/password missing, cannot configure transporter')
}

const transporter = nodemailer.createTransport({
    host: smtpHost || 'smtp.gmail.com',
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
        user: smtpUser,
        pass: smtpPass,
        method: 'LOGIN'
    },
    requireTLS: true,
    tls: {
        rejectUnauthorized: false
    },
    debug: true
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP transporter verify error:', error.message);
  } else {
    console.log('SMTP transporter verified. Ready to send emails.');
  }
});

export const sendOTPEmail = async (to, otp) => {
    // const mailOptions = {
    //     from: emailFrom,
    //     to,
    //     subject: 'Your CollegeBazaar verification code',
    //     text: `Your verification code is ${otp}. It will expire in 5 minutes.`,
    //     html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`
    // };

    const mailOptions = {
    from: emailFrom,
    to,
    subject: 'Verify your email - CirQlex',
    text: `Your CirQlex verification code is ${otp}. It expires in 5 minutes.`,
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
            
            <h2 style="color: #333;">Verify Your Email</h2>
            
            <p style="color: #555; font-size: 15px;">
                Welcome to <strong>CirQlex</strong> 👋 <br/>
                Use the verification code below to complete your signup.
            </p>
            
            <div style="margin: 25px 0;">
                <span style="
                    display: inline-block;
                    font-size: 28px;
                    letter-spacing: 6px;
                    font-weight: bold;
                    color: #2c3e50;
                    background: #f1f3f5;
                    padding: 12px 20px;
                    border-radius: 8px;
                ">
                    ${otp}
                </span>
            </div>

            <p style="color: #777; font-size: 14px;">
                This code will expire in next <strong>5 minutes</strong>.
            </p>

            <p style="color: #999; font-size: 12px; margin-top: 20px;">
                If you didn’t request this, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

            <p style="font-size: 12px; color: #aaa;">
                © ${new Date().getFullYear()} CirQlex. All rights reserved.
            </p>
        </div>
    </div>
    `
};

    return transporter.sendMail(mailOptions);
};
