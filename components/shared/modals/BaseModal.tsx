'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  footer?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'sm:max-w-[425px]',
  md: 'sm:max-w-[500px]',
  lg: 'sm:max-w-[700px]',
  xl: 'sm:max-w-[900px]',
  '2xl': 'sm:max-w-[1800px]',
  full: 'max-w-none w-screen h-screen max-h-screen m-0 rounded-none'
};

export const BaseModal: React.FC<BaseModalProps> = ({ 
  open, 
  onClose, 
  title, 
  description, 
  children, 
  size = 'md',
  className,
  showCloseButton = true,
  showBackButton = false,
  onBack,
  footer,
  loading = false,
  disabled = false
}) => {
  const handleClose = () => {
    if (!disabled && !loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          sizeClasses[size],
          loading && 'pointer-events-none',
          className
        )}
        showCloseButton={false}
      >
        {/* Header - Only render if title is provided or showCloseButton is true */}
        {(title || showCloseButton) && (
          <DialogHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {showBackButton && onBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    disabled={disabled || loading}
                    className="p-2 h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  {title && (
                    <DialogTitle className="text-2xl font-bold">
                      {title}
                    </DialogTitle>
                  )}
                  {description && (
                    <DialogDescription className="text-gray-600 mt-1">
                      {description}
                    </DialogDescription>
                  )}
                </div>
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  disabled={disabled || loading}
                  className="p-2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>
        )}

        {/* Content */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          loading && "opacity-50 pointer-events-none"
        )}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            {footer}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Specialized modal components for common use cases
export const AuthModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}> = ({ open, onClose, title, description, children, loading, disabled }) => (
  <BaseModal
    open={open}
    onClose={onClose}
    title={title}
    description={description}
    size="sm"
    loading={loading}
    disabled={disabled}
  >
    {children}
  </BaseModal>
);

export const PropertyDetailsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  showCloseButton?: boolean;
}> = ({ open, onClose, title, description, children, loading, disabled, showCloseButton = true }) => (
  <BaseModal
    open={open}
    onClose={onClose}
    title={title}
    description={description}
    size="2xl"
    loading={loading}
    disabled={disabled}
    showCloseButton={showCloseButton}
  >
    {children}
  </BaseModal>
);

export const SettingsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}> = ({ open, onClose, title, description, children, loading, disabled }) => (
  <BaseModal
    open={open}
    onClose={onClose}
    title={title}
    description={description}
    size="lg"
    loading={loading}
    disabled={disabled}
  >
    {children}
  </BaseModal>
);

export default BaseModal;
