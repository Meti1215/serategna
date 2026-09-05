import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'Serategna.com | Find the Right Worker. Find the Right Opportunity.',
  description:
    'Ethiopia’s leading worker-finding and employment marketplace connecting skilled workers, employers, and student interns with verified trust and phone privacy.',
  keywords: [
    'Serategna',
    'Ethiopia jobs',
    'Ethiopian workers',
    'Find electrician Addis Ababa',
    'Internships Ethiopia',
    'Telebirr payment',
    'Employment marketplace Ethiopia',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
