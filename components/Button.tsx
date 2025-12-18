import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide active:scale-[0.98]";
  
  const variants = {
    primary: "bg-white text-black hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-transparent font-semibold",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600",
    outline: "bg-transparent text-white border border-zinc-700 hover:border-white/50 hover:bg-white/5",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};