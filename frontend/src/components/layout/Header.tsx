'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
          Jack&apos;s Blog
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <div className="flex flex-col px-4 py-2 space-y-2">
              <NavLinks />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLinks() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/types', label: 'Categories' },
    { href: '/tags', label: 'Tags' },
    { href: '/archives', label: 'Archives' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-600 hover:text-blue-600 transition font-medium py-2 md:py-0"
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
