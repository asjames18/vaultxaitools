import { Metadata } from 'next';
import ContactManagementClient from './ContactManagementClient';

export const metadata: Metadata = {
  title: 'Contact Management - Admin Dashboard',
  description: 'Manage contact form submissions and messages',
};

export default function ContactManagementPage() {
  return <ContactManagementClient />;
} 