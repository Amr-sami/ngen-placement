'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  firstName,
  lastName,
  companyMail,
  companyName,
  numberOfStudents,
  message,
}: {
  firstName: string;
  lastName: string;
  companyMail: string;
  companyName: string;
  numberOfStudents: string;
  message: string;
}) => {
  await resend.emails.send({
    to: 'amr.hassan.emam@gmail.com',
    from: 'NgenSchools <onboarding@resend.dev>',
    subject: 'New Contact Us for submission',
    html: `
    <div>Full Name:${firstName} ${lastName}</div>
    <div>Business Email: ${companyMail}</div>
    <div>Company: ${companyName}</div>
    <div>Number Of Students: ${numberOfStudents}</div>
    <div>Message/Note: ${message}</div>
    `,
  });
};
