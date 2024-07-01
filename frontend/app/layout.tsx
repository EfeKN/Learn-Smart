// Import type and necessary modules
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LearnSmart',
  description:
    'Learn Smart is a platform aimed at helping students learn more effectively.',
};

// Define props interface for RootLayout
interface RootLayoutProps {
  children: React.ReactNode;
}

// Define RootLayout component
export default function RootLayout({ children} : RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>{children}</div>
      </body>
    </html>
  );
}
