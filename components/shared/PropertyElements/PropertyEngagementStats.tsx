"use client";

import { Eye, Heart, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types';

interface PropertyEngagementStatsProps {
  property: Property;
  className?: string;
}

export default function PropertyEngagementStats({ property, className = '' }: PropertyEngagementStatsProps) {
  const views = property.Views ?? 0;
  const likes = property.Likes ?? 0;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-white/70 text-sm">
          <Eye className="w-4 h-4" />
          Viewed {views} times today
        </div>
        <div className="flex items-center gap-1 text-white/70 text-sm">
          <Heart className="w-4 h-4" />
          Saved {likes} times
        </div>
      </div>
      
      <Badge className="bg-orange-500 text-white border-0">
        <Users className="w-3 h-3 mr-1" />
        High Interest
      </Badge>
    </div>
  );
}
