import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBaggageEmail(to: string, baggageNumber: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@imaniprima.com',
    to,
    subject: 'Nomor Bagasi Anda',
    text: `Nomor bagasi Anda: ${baggageNumber}\nGunakan nomor ini untuk tracking status bagasi Anda selama perjalanan.`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Gagal mengirim email bagasi:', err);
  }
}
