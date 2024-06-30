// Import type and necessary modules
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Define props interface for RootLayout
interface RootLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean; // Optional prop to show or hide the navbar
}

// Define RootLayout component
export default function RootLayout({ children, showNavbar = true }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Conditionally render Navbar based on showNavbar prop */}
        {showNavbar && <Navbar />}
        <div>{children}</div>
      </body>
    </html>
  );
}
