'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  MapPin, 
  Home, 
  DollarSign, 
  Bed, 
  Bath, 
  Tag
} from 'lucide-react';
import { FilterState } from '@/components/Search/Filters/FilterContext/FilterContext';
import { toast } from 'sonner';

interface SaveSearchDialogProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onSave: (
    name: string,
    notificationSettings: { email: boolean; frequency: 'daily' | 'weekly' | 'monthly' }
  ) => Promise<boolean>;
}

export function SaveSearchDialog({ open, onClose, filters, onSave }: SaveSearchDialogProps) {
  const [searchName, setSearchName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isSaving, setIsSaving] = useState(false);

  // Generate a default search name based on filters
  useEffect(() => {
    if (open && !searchName) {
      const defaultName = generateDefaultSearchName(filters);
      setSearchName(defaultName);
    }
  }, [open, filters]);

  const generateDefaultSearchName = (filters: FilterState): string => {
    const parts = [];
    
    if (filters.city.length > 0) {
      parts.push(filters.city[0]);
    }
    
    if (filters.propertyType.length > 0) {
      parts.push(filters.propertyType.join(', '));
    }
    
    if (filters.priceRange) {
      parts.push(`$${filters.priceRange.min.toLocaleString()}-$${filters.priceRange.max.toLocaleString()}`);
    }
    
    if (parts.length === 0) {
      parts.push('My Search');
    }
    
    return parts.join(' - ');
  };

  const handleSave = async () => {
    if (!searchName.trim()) {
      toast.error('Please enter a search name');
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSave(searchName.trim(), {
        email: emailNotifications,
        frequency: notificationFrequency
      });

      if (success) {
        toast.success('Search saved successfully');
        handleClose();
      } else {
        toast.error('Failed to save search');
      }
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('An error occurred while saving the search');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSearchName('');
    setEmailNotifications(false);
    setNotificationFrequency('weekly');
    onClose();
  };

  const countActiveFilters = (filters: FilterState): number => {
    let count = 0;
    if (filters.city.length > 0) count++;
    if (filters.propertyType.length > 0) count++;
    if (filters.priceRange) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.quickFilters.length > 0) count += filters.quickFilters.length;
    return count;
  };

  const formatSearchCriteria = (filters: FilterState): string[] => {
    const criteria = [];
    
    if (filters.status) {
      criteria.push(`Status: ${filters.status === 'buy' ? 'For Sale' : 'For Lease'}`);
    }
    
    if (filters.city.length > 0) {
      criteria.push(`Location: ${filters.city.join(', ')}`);
    }
    
    if (filters.propertyType.length > 0) {
      criteria.push(`Type: ${filters.propertyType.join(', ')}`);
    }
    
    if (filters.priceRange) {
      criteria.push(`Price: $${filters.priceRange.min.toLocaleString()} - $${filters.priceRange.max.toLocaleString()}`);
    }
    
    if (filters.bedrooms) {
      criteria.push(`Bedrooms: ${filters.bedrooms.min} - ${filters.bedrooms.max}`);
    }
    
    if (filters.bathrooms) {
      criteria.push(`Bathrooms: ${filters.bathrooms.min} - ${filters.bathrooms.max}`);
    }
    
    if (filters.quickFilters.length > 0) {
      criteria.push(`Features: ${filters.quickFilters.join(', ')}`);
    }
    
    return criteria;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-blue-600" />
            Save Search
          </DialogTitle>
          <DialogDescription>
            Save your current search criteria to get notified about new listings that match your preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Current Search Criteria ({countActiveFilters(filters)} filters)
            </h3>
            <div className="flex flex-wrap gap-2">
              {formatSearchCriteria(filters).map((criterion, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {criterion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Search Name */}
          <div className="space-y-2">
            <Label htmlFor="searchName" className="text-sm font-medium">
              Search Name *
            </Label>
            <Input
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., Downtown Condos Under $600k"
              className="w-full"
            />
          </div>

          {/* Notification Settings */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700">Notification Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-500">
                  Get notified when new properties match your search
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {emailNotifications && (
              <div className="space-y-2 ml-4">
                <Label htmlFor="frequency" className="text-sm font-medium">
                  Notification Frequency
                </Label>
                <Select
                  value={notificationFrequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setNotificationFrequency(value)}
                >
                  <SelectTrigger id="frequency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving || !searchName.trim()}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Search'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

