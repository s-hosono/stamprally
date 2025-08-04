import type { ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  const className = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    disabled && 'button--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
