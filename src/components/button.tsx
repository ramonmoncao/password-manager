import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  color?: string; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled,
  color = "var(--color-primary-2)",
  className = "", 
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={{ backgroundColor: color }}
      className={`cursor-pointer w-full text-white p-3 rounded-md font-extrabold hover:opacity-90 transition-all disabled:opacity-50 ${className}`
  }>
      {isLoading ? "Carregando..." : children}
    </button>
  );
};

export default Button;
