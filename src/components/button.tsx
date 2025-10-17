import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading = false, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className="w-full text-white p-3 rounded-md font-extrabold hover:opacity-90 transition-all disabled:opacity-50 bg-[var(--color-primary-2)]"
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
};

export default Button;
