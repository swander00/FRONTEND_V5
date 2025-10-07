import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 leading-none',
  {
    variants: {
      variant: {
        // Original variants
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        
        // Property-specific badge variants with consistent sizing
        type: 'border-transparent bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg backdrop-blur-sm',
        status: 'border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg backdrop-blur-sm',
        community: 'border-transparent bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-800 border-amber-200/50',
        
        // Card variants for property cards
        'type-card': 'border-transparent bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg backdrop-blur-sm',
        'status-card': 'border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg backdrop-blur-sm',
        'community-card': 'border-transparent bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-800 border-amber-200/50',
        
        // Header variants for property details
        'type-header': 'bg-white/20 text-white border border-white/30 hover:border-white/40',
        'status-header': 'bg-white/20 text-white border border-white/30 hover:border-white/40',
        'community-header': 'bg-white/20 text-white border border-white/30 hover:border-white/40',
        
        // Gallery variants for image overlays
        'type-gallery': 'bg-white/95 backdrop-blur-sm text-gray-800 border border-white/20 shadow-lg',
        'status-gallery': 'bg-white/95 backdrop-blur-sm text-gray-800 border border-white/20 shadow-lg',
        'community-gallery': 'bg-white/95 backdrop-blur-sm text-gray-800 border border-white/20 shadow-lg',
        
        // Outlined variants
        'type-outlined': 'border border-indigo-300 text-indigo-700 bg-transparent',
        'status-outlined': 'border border-blue-300 text-blue-700 bg-transparent',
        'community-outlined': 'border border-amber-300 text-amber-700 bg-transparent',
        
        // Filled variants
        'type-filled': 'border-transparent bg-indigo-100 text-indigo-800',
        'status-filled': 'border-transparent bg-blue-100 text-blue-800',
        'community-filled': 'border-transparent bg-amber-100 text-amber-800',
        
        // Open house variant with lighter blue background
        'open-house': 'border-transparent bg-blue-100 text-blue-800 shadow-sm',
        'open-house-header': 'bg-white/20 text-white border border-white/30 hover:border-white/40',
      },
      size: {
        sm: 'px-2 py-1 text-xs leading-none',
        md: 'px-3 py-1.5 text-sm leading-none',
        lg: 'px-4 py-2 text-base leading-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
