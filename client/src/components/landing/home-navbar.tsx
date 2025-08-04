"use client";

import Link from 'next/link';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from '@/components/ui/resizable-navbar';
import { useState } from 'react';

const HomeNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', link: '#' },
    { name: 'About', link: '#about' },
    { name: 'Features', link: '#features' },
    { name: 'Contact', link: '#contact' },
  ];

  return (
    <Navbar className="top-4">
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center space-x-2">
          <NavbarButton as={Link} href="/login" variant="secondary">Login</NavbarButton>
          <NavbarButton variant="gradient">Get Started</NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="block px-2 py-1 text-neutral-600 dark:text-neutral-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="flex flex-col space-y-2 pt-4">
            <NavbarButton as={Link} href="/login" variant="secondary" className="w-full">
              Login
            </NavbarButton>
            <NavbarButton variant="gradient" className="w-full">
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default HomeNavbar;