'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  floatingLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, floatingLabel = false, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    if (floatingLabel) {
      return (
        <div className="input-group">
          <input
            ref={ref}
            type={inputType}
            className={`input ${error ? 'border-error' : ''} ${className}`}
            placeholder=" "
            {...props}
          />
          {label && (
            <label className="input-floating-label">
              {label}
            </label>
          )}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {error && <p className="input-error">{error}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {label && <label className="input-label">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`input ${icon ? 'pl-12' : ''} ${error ? 'border-error' : ''} ${className}`}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
