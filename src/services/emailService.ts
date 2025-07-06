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

export async function sendBaggageEmail(to: string, baggageNumber: string = 'Unknown') {
  const trackingUrl = `https://tracking.garuda.imaniprima.co.id/tracking-detail/${baggageNumber}`;
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@imaniprima.com',
    to,
    subject: 'Informasi Nomor Bagasi dan Pelacakan Garuda Indonesia',
    text:
      `Yth. Penumpang Garuda Indonesia,\n\n` +
      `Berikut kami informasikan nomor bagasi Anda: ${baggageNumber}.\n` +
      `Silakan simpan nomor ini untuk keperluan pelacakan status bagasi selama perjalanan Anda.\n\n` +
      `Untuk memantau status bagasi secara real-time, silakan kunjungi tautan berikut:\n${trackingUrl}\n\n` +
      `Terima kasih telah mempercayakan perjalanan Anda bersama Garuda Indonesia.\n\n` +
      `Hormat kami,\nTim Garuda Indonesia`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Gagal mengirim email bagasi:', err);
  }
}
