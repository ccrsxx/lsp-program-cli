import { createTransport } from 'nodemailer';
import { generateApplicationError } from './error.js';
import { EMAIL_ADDRESS, EMAIL_PASSWORD, FRONTEND_URL } from './env.js';
import type nodemailer from 'nodemailer';

export async function sendEmail(options: nodemailer.SendMailOptions) {
  const client = createTransport({
    service: 'Gmail',
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD
    }
  });

  try {
    await client.sendMail(options);
  } catch (err) {
    throw generateApplicationError(err, 'Error while sending email', 500);
  }
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetPasswordUrl = `${FRONTEND_URL}/password-reset/${token}`;

  await sendEmail({
    to: email,
    from: 'SoraPOS <noreply@gmail.com>',
    subject: 'Permintaan Reset Password',
    html: `
      <h1>Permintaan Reset Password</h1>
      <p>Klik <a href="${resetPasswordUrl}">link ini</a> untuk mereset password anda</p>
      <p>Link ini akan kadaluarsa dalam 1 jam</p>
      <p>Jika anda tidak meminta pesan ini, silahkan abaikan pesan ini</p>
    `
  });
}

export async function sendOtpEmail(email: string, otp: string) {
  await sendEmail({
    to: email,
    from: 'SoraPOS <noreply@gmail.com>',
    subject: 'Permintaan Verfikasi OTP',
    html: `
      <h1>Verifikasi OTP</h1>
      <h2>Terimakasih Telah Memilih SoraPOS !, Untuk memastikan keamanan akun anda, kami membutuhkan verifikasi identitas anda dengan menggunakan OTP berikut ini</p>
      <h3>OTP anda: ${otp}</h3>
      <p>Otp ini berlaku selama 5 menit, pastikan anda melakukan verifikasi sebelum melewati batas waktu</p>
      <p>Jika anda tidak meminta OTP ini, silahkan abaikan pesan ini</p>
    `
  });
}
