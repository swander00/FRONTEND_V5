'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  // Navigation & UI
  Home, 
  Search, 
  Menu, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  
  // Property & Real Estate
  MapPin, 
  Calendar, 
  Camera, 
  Heart, 
  Share2, 
  ExternalLink,
  Play,
  Star,
  Building2,
  Bed,
  Bath,
  Square,
  Car,
  Clock,
  
  // User & Auth
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  Settings,
  LogOut,
  
  // Actions & Status
  Check, 
  Plus, 
  Minus, 
  Edit, 
  Trash2, 
  Save, 
  Send,
  Download,
  Upload,
  RefreshCw,
  
  // Social & Communication
  MessageCircle,
  Bell,
  Users,
  
  // Technical
  Wifi,
  Battery,
  Signal,
  Zap,
  Shield,
  
  // Weather & Environment
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  
  // Business & Finance
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  
  // Media & Content
  Image,
  Video,
  FileText,
  File,
  Folder,
  
  // Navigation & Location
  Navigation,
  Compass,
  Globe,
  Map,
  
  // Utilities
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  
  // Lucide React icons
  LucideIcon
} from 'lucide-react';

export type IconName = 
  // Navigation & UI
  | 'home' | 'search' | 'menu' | 'x' | 'arrow-left' | 'arrow-right' 
  | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
  | 'maximize' | 'minimize'
  
  // Property & Real Estate
  | 'map-pin' | 'calendar' | 'camera' | 'heart' | 'share' | 'external-link'
  | 'play' | 'star' | 'building' | 'bed' | 'bath' | 'square' | 'car' | 'clock'
  
  // User & Auth
  | 'user' | 'mail' | 'phone' | 'lock' | 'eye' | 'eye-off' | 'settings' | 'log-out'
  
  // Actions & Status
  | 'check' | 'plus' | 'minus' | 'edit' | 'trash' | 'save' | 'send'
  | 'download' | 'upload' | 'refresh'
  
  // Social & Communication
  | 'message' | 'bell' | 'users'
  
  // Technical
  | 'wifi' | 'battery' | 'signal' | 'zap' | 'shield'
  
  // Weather & Environment
  | 'sun' | 'cloud' | 'cloud-rain' | 'snow'
  
  // Business & Finance
  | 'dollar' | 'credit-card' | 'trending-up' | 'trending-down'
  
  // Media & Content
  | 'image' | 'video' | 'file-text' | 'file' | 'folder'
  
  // Navigation & Location
  | 'navigation' | 'compass' | 'globe' | 'map'
  
  // Utilities
  | 'info' | 'alert' | 'check-circle' | 'x-circle' | 'help';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  animated?: boolean;
  spin?: boolean;
  pulse?: boolean;
  bounce?: boolean;
}

const iconMap: Record<IconName, LucideIcon> = {
  // Navigation & UI
  'home': Home,
  'search': Search,
  'menu': Menu,
  'x': X,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'maximize': Maximize2,
  'minimize': Minimize2,
  
  // Property & Real Estate
  'map-pin': MapPin,
  'calendar': Calendar,
  'camera': Camera,
  'heart': Heart,
  'share': Share2,
  'external-link': ExternalLink,
  'play': Play,
  'star': Star,
  'building': Building2,
  'bed': Bed,
  'bath': Bath,
  'square': Square,
  'car': Car,
  'clock': Clock,
  
  // User & Auth
  'user': User,
  'mail': Mail,
  'phone': Phone,
  'lock': Lock,
  'eye': Eye,
  'eye-off': EyeOff,
  'settings': Settings,
  'log-out': LogOut,
  
  // Actions & Status
  'check': Check,
  'plus': Plus,
  'minus': Minus,
  'edit': Edit,
  'trash': Trash2,
  'save': Save,
  'send': Send,
  'download': Download,
  'upload': Upload,
  'refresh': RefreshCw,
  
  // Social & Communication
  'message': MessageCircle,
  'bell': Bell,
  'users': Users,
  
  // Technical
  'wifi': Wifi,
  'battery': Battery,
  'signal': Signal,
  'zap': Zap,
  'shield': Shield,
  
  // Weather & Environment
  'sun': Sun,
  'cloud': Cloud,
  'cloud-rain': CloudRain,
  'snow': Snowflake,
  
  // Business & Finance
  'dollar': DollarSign,
  'credit-card': CreditCard,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  
  // Media & Content
  'image': Image,
  'video': Video,
  'file-text': FileText,
  'file': File,
  'folder': Folder,
  
  // Navigation & Location
  'navigation': Navigation,
  'compass': Compass,
  'globe': Globe,
  'map': Map,
  
  // Utilities
  'info': Info,
  'alert': AlertCircle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'help': HelpCircle
};

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10'
};

const animationClasses = {
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce'
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className,
  color,
  strokeWidth = 2,
  fill,
  animated = false,
  spin = false,
  pulse = false,
  bounce = false
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  const animationClass = animated || spin ? animationClasses.spin : 
                       pulse ? animationClasses.pulse : 
                       bounce ? animationClasses.bounce : '';
  
  return (
    <IconComponent
      className={cn(
        sizeClasses[size],
        animationClass,
        className
      )}
      color={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
  );
};

// Specialized icon components for common use cases
export const PropertyIcon: React.FC<{
  type: 'home' | 'building' | 'bed' | 'bath' | 'square' | 'car' | 'clock';
  size?: IconSize;
  className?: string;
  color?: string;
}> = ({ type, size = 'md', className, color }) => (
  <Icon
    name={type}
    size={size}
    className={className}
    color={color}
  />
);

export const ActionIcon: React.FC<{
  action: 'edit' | 'trash' | 'save' | 'send' | 'download' | 'upload' | 'refresh';
  size?: IconSize;
  className?: string;
  color?: string;
  animated?: boolean;
}> = ({ action, size = 'md', className, color, animated = false }) => (
  <Icon
    name={action}
    size={size}
    className={className}
    color={color}
    animated={animated}
  />
);

export const StatusIcon: React.FC<{
  status: 'check' | 'alert' | 'check-circle' | 'x-circle' | 'help' | 'info';
  size?: IconSize;
  className?: string;
  color?: string;
  animated?: boolean;
}> = ({ status, size = 'md', className, color, animated = false }) => (
  <Icon
    name={status}
    size={size}
    className={className}
    color={color}
    animated={animated}
  />
);

export const NavigationIcon: React.FC<{
  direction: 'arrow-left' | 'arrow-right' | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevron-down';
  size?: IconSize;
  className?: string;
  color?: string;
}> = ({ direction, size = 'md', className, color }) => (
  <Icon
    name={direction}
    size={size}
    className={className}
    color={color}
  />
);

export default Icon;
