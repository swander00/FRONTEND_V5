'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Mail, Lock, User, Phone, Search, Calendar } from 'lucide-react';

export type FormFieldType = 'text' | 'email' | 'password' | 'tel' | 'search' | 'date';

interface FormFieldProps {
  type: FormFieldType;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const fieldIcons = {
  email: <Mail className="h-4 w-4" />,
  password: <Lock className="h-4 w-4" />,
  text: <User className="h-4 w-4" />,
  tel: <Phone className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />
};

export const FormField: React.FC<FormFieldProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  className,
  icon,
  showPasswordToggle = type === 'password'
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const displayIcon = icon || fieldIcons[type];
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
        className="text-sm font-medium flex items-center gap-1"
      >
        {displayIcon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'h-10 transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            isFocused && !error && 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
          )}
        />
        
        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

// Specialized form field components
export const EmailField: React.FC<{
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}> = ({ 
  label = 'Email Address', 
  placeholder = 'john.doe@example.com',
  ...props 
}) => (
  <FormField
    type="email"
    label={label}
    placeholder={placeholder}
    {...props}
  />
);

export const PasswordField: React.FC<{
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}> = ({ 
  label = 'Password', 
  placeholder = 'Enter your password',
  ...props 
}) => (
  <FormField
    type="password"
    label={label}
    placeholder={placeholder}
    {...props}
  />
);

export const TextField: React.FC<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}> = (props) => (
  <FormField
    type="text"
    {...props}
  />
);

export const PhoneField: React.FC<{
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}> = ({ 
  label = 'Phone Number', 
  placeholder = '(555) 123-4567',
  ...props 
}) => (
  <FormField
    type="tel"
    label={label}
    placeholder={placeholder}
    {...props}
  />
);

export const SearchField: React.FC<{
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}> = ({ 
  label = 'Search', 
  placeholder = 'Search properties...',
  ...props 
}) => (
  <FormField
    type="search"
    label={label}
    placeholder={placeholder}
    {...props}
  />
);

export default FormField;
