import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = 'Melanated In Tech <team@melanatedintech.com>';
export const TEAM_EMAIL = 'team@melanatedintech.com';
