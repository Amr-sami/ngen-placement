'use server';

import { Resend } from 'resend';

// Lazy so Next.js static analysis at build time (no env vars) can evaluate
// this module. Resend's constructor throws on an undefined API key.
let _resend: Resend | null = null;
function getResend(): Resend {
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  const safeFirstName = escapeHtml(firstName);
  const safeLastName = escapeHtml(lastName);
  const safeCompanyMail = escapeHtml(companyMail);
  const safeCompanyName = escapeHtml(companyName);
  const safeNumberOfStudents = escapeHtml(numberOfStudents);
  const safeMessage = escapeHtml(message);

  await getResend().emails.send({
    to: 'Info@ngenschools.com',
    from: 'NgenSchools <onboarding@resend.dev>',
    subject: 'New Contact Us for submission From Ngen Schools',
    html: `
    <div>Full Name: ${safeFirstName} ${safeLastName}</div>
    <div>Business Email: ${safeCompanyMail}</div>
    <div>Company: ${safeCompanyName}</div>
    <div>Number Of Students: ${safeNumberOfStudents}</div>
    <div>Message/Note: ${safeMessage}</div>
    `,
  });
};
