import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="flex items-center justify-center bg-[var(--background)]">
      <div className="relative w-48 h-16">
        <Image
          src="/logo-light.png"
          alt="Logo claro"
          fill
          className="block dark:hidden object-contain"
        />
        <Image
          src="/logo-dark.png"
          alt="Logo escuro"
          fill
          className="hidden dark:block object-contain"
        />
      </div>
    </header>
  );
};

export default Header;