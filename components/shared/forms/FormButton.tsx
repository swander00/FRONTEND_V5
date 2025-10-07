'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Check, X, ArrowRight, Save, Send } from 'lucide-react';

export type FormButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type FormButtonSize = 'sm' | 'md' | 'lg';
export type FormButtonState = 'default' | 'loading' | 'success' | 'error';

interface FormButtonProps {
  children: React.ReactNode;
  variant?: FormButtonVariant;
  size?: FormButtonSize;
  state?: FormButtonState;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  ghost: 'hover:bg-gray-100 text-gray-700',
  destructive: 'bg-red-600 hover:bg-red-700 text-white'
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
};

const stateStyles = {
  default: '',
  loading: 'cursor-not-allowed opacity-75',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  error: 'bg-red-600 hover:bg-red-700 text-white'
};

const stateIcons = {
  loading: <Loader2 className="h-4 w-4 animate-spin" />,
  success: <Check className="h-4 w-4" />,
  error: <X className="h-4 w-4" />,
  default: null
};

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  state = 'default',
  disabled = false,
  onClick,
  type = 'button',
  className,
  icon,
  iconPosition = 'left',
  fullWidth = false
}) => {
  const displayIcon = icon || stateIcons[state];
  
  return (
    <Button
      type={type}
      variant="ghost"
      onClick={onClick}
      disabled={disabled || state === 'loading'}
      className={cn(
        'flex items-center gap-2 font-semibold transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        stateStyles[state],
        fullWidth && 'w-full',
        className
      )}
    >
      {displayIcon && iconPosition === 'left' && (
        <span className="flex-shrink-0">
          {displayIcon}
        </span>
      )}
      <span>{children}</span>
      {displayIcon && iconPosition === 'right' && (
        <span className="flex-shrink-0">
          {displayIcon}
        </span>
      )}
    </Button>
  );
};

// Specialized form button components
export const SubmitButton: React.FC<{
  children?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}> = ({ 
  children = 'Submit', 
  loading = false, 
  success = false, 
  error = false, 
  disabled = false,
  onClick,
  className,
  fullWidth = false
}) => (
  <FormButton
    variant="primary"
    state={loading ? 'loading' : success ? 'success' : error ? 'error' : 'default'}
    disabled={disabled}
    onClick={onClick}
    className={className}
    fullWidth={fullWidth}
    icon={loading ? undefined : success ? <Check className="h-4 w-4" /> : error ? <X className="h-4 w-4" /> : <Send className="h-4 w-4" />}
  >
    {children}
  </FormButton>
);

export const CancelButton: React.FC<{
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}> = ({ 
  children = 'Cancel', 
  disabled = false,
  onClick,
  className,
  fullWidth = false
}) => (
  <FormButton
    variant="outline"
    disabled={disabled}
    onClick={onClick}
    className={className}
    fullWidth={fullWidth}
    icon={<X className="h-4 w-4" />}
  >
    {children}
  </FormButton>
);

export const SaveButton: React.FC<{
  children?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}> = ({ 
  children = 'Save', 
  loading = false, 
  success = false, 
  error = false, 
  disabled = false,
  onClick,
  className,
  fullWidth = false
}) => (
  <FormButton
    variant="secondary"
    state={loading ? 'loading' : success ? 'success' : error ? 'error' : 'default'}
    disabled={disabled}
    onClick={onClick}
    className={className}
    fullWidth={fullWidth}
    icon={loading ? undefined : success ? <Check className="h-4 w-4" /> : error ? <X className="h-4 w-4" /> : <Save className="h-4 w-4" />}
  >
    {children}
  </FormButton>
);

export const NextButton: React.FC<{
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}> = ({ 
  children = 'Next', 
  disabled = false,
  onClick,
  className,
  fullWidth = false
}) => (
  <FormButton
    variant="primary"
    disabled={disabled}
    onClick={onClick}
    className={className}
    fullWidth={fullWidth}
    icon={<ArrowRight className="h-4 w-4" />}
    iconPosition="right"
  >
    {children}
  </FormButton>
);

export default FormButton;
