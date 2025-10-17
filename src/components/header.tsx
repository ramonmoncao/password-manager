import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="flex items-center justify-center" style={{ color: "var(--background)" }}>
      {/* Imagem diferente para claro e escuro */}
      <div className="relative w-48 h-16">
        {/* Imagem para modo claro */}
        <Image
          src="/logo-light.png"
          alt="Logo claro"
          fill
          className="block dark:hidden object-contain"
        />
        {/* Imagem para modo escuro */}
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