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
    const mailOptions = {
        from: emailFrom,
        to,
        subject: 'Your CollegeBazaar verification code',
        text: `Your verification code is ${otp}. It will expire in 5 minutes.`,
        html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`
    };

    return transporter.sendMail(mailOptions);
};
