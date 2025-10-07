'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  Bed, 
  Bath, 
  Calendar, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Play,
  Bell,
  BellOff,
  Settings
} from 'lucide-react';
import { useSavedSearches } from '@/hooks/useUserData';
import { SavedSearch } from '@/types/userData';
import { toast } from 'sonner';

interface SavedSearchesModalProps {
  open: boolean;
  onClose: () => void;
}

export function SavedSearchesModal({ open, onClose }: SavedSearchesModalProps) {
  const { savedSearches, loading, error, updateSavedSearch, deleteSavedSearch, executeSavedSearch, refresh } = useSavedSearches();
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Auto-refresh when modal opens
  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    propertyTypes: [] as string[],
    priceMin: '',
    priceMax: '',
    bedroomsMin: '',
    bedroomsMax: '',
    bathroomsMin: '',
    bathroomsMax: '',
    status: '',
    isActive: true,
    emailNotifications: false,
    notificationFrequency: 'weekly' as 'daily' | 'weekly' | 'monthly'
  });

  const handleEdit = (search: SavedSearch) => {
    setEditingId(search.id);
    setEditForm({
      name: search.name,
      location: search.searchCriteria.location || '',
      propertyTypes: search.searchCriteria.propertyType || [],
      priceMin: search.searchCriteria.priceRange?.min?.toString() || '',
      priceMax: search.searchCriteria.priceRange?.max?.toString() || '',
      bedroomsMin: search.searchCriteria.bedrooms?.min?.toString() || '',
      bedroomsMax: search.searchCriteria.bedrooms?.max?.toString() || '',
      bathroomsMin: search.searchCriteria.bathrooms?.min?.toString() || '',
      bathroomsMax: search.searchCriteria.bathrooms?.max?.toString() || '',
      status: search.searchCriteria.status || '',
      isActive: search.isActive,
      emailNotifications: search.notificationSettings?.email || false,
      notificationFrequency: search.notificationSettings?.frequency || 'weekly'
    });
  };

  const handleSaveEdit = async (searchId: string) => {
    try {
      const updates: Partial<SavedSearch> = {
        name: editForm.name,
        searchCriteria: {
          location: editForm.location || undefined,
          propertyType: editForm.propertyTypes.length > 0 ? editForm.propertyTypes : undefined,
          priceRange: (editForm.priceMin || editForm.priceMax) ? {
            min: editForm.priceMin ? parseInt(editForm.priceMin) : 0,
            max: editForm.priceMax ? parseInt(editForm.priceMax) : 999999999
          } : undefined,
          bedrooms: (editForm.bedroomsMin || editForm.bedroomsMax) ? {
            min: editForm.bedroomsMin ? parseInt(editForm.bedroomsMin) : 0,
            max: editForm.bedroomsMax ? parseInt(editForm.bedroomsMax) : 10
          } : undefined,
          bathrooms: (editForm.bathroomsMin || editForm.bathroomsMax) ? {
            min: editForm.bathroomsMin ? parseInt(editForm.bathroomsMin) : 0,
            max: editForm.bathroomsMax ? parseInt(editForm.bathroomsMax) : 10
          } : undefined,
          status: editForm.status || undefined
        },
        isActive: editForm.isActive,
        notificationSettings: {
          email: editForm.emailNotifications,
          frequency: editForm.notificationFrequency
        }
      };
      
      const success = await updateSavedSearch(searchId, updates);
      
      if (success) {
        toast.success('Saved search updated');
        setEditingId(null);
        await refresh();
      } else {
        toast.error('Failed to update saved search');
      }
    } catch (error) {
      console.error('Error updating saved search:', error);
      toast.error('An error occurred while updating the search');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      location: '',
      propertyTypes: [],
      priceMin: '',
      priceMax: '',
      bedroomsMin: '',
      bedroomsMax: '',
      bathroomsMin: '',
      bathroomsMax: '',
      status: '',
      isActive: true,
      emailNotifications: false,
      notificationFrequency: 'weekly'
    });
  };

  const handleDelete = async (searchId: string) => {
    try {
      setRemovingId(searchId);
      const success = await deleteSavedSearch(searchId);
      
      if (success) {
        toast.success('Saved search deleted');
        await refresh();
      } else {
        toast.error('Failed to delete saved search');
      }
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast.error('An error occurred while deleting the search');
    } finally {
      setRemovingId(null);
    }
  };

  const handleRunSearch = async (searchId: string) => {
    try {
      const search = savedSearches.find(s => s.id === searchId);
      if (!search) {
        toast.error('Search not found');
        return;
      }

      // Update last run time
      await executeSavedSearch(searchId);
      
      // Build query parameters from search criteria
      const params = new URLSearchParams();
      
      if (search.searchCriteria.location) {
        params.append('location', search.searchCriteria.location);
      }
      if (search.searchCriteria.propertyType && search.searchCriteria.propertyType.length > 0) {
        search.searchCriteria.propertyType.forEach(type => {
          params.append('propertyType', type);
        });
      }
      if (search.searchCriteria.priceRange) {
        params.append('priceMin', search.searchCriteria.priceRange.min.toString());
        params.append('priceMax', search.searchCriteria.priceRange.max.toString());
      }
      if (search.searchCriteria.bedrooms) {
        params.append('bedroomsMin', search.searchCriteria.bedrooms.min.toString());
        params.append('bedroomsMax', search.searchCriteria.bedrooms.max.toString());
      }
      if (search.searchCriteria.bathrooms) {
        params.append('bathroomsMin', search.searchCriteria.bathrooms.min.toString());
        params.append('bathroomsMax', search.searchCriteria.bathrooms.max.toString());
      }
      if (search.searchCriteria.status) {
        params.append('status', search.searchCriteria.status);
      }
      if (search.searchCriteria.features && search.searchCriteria.features.length > 0) {
        search.searchCriteria.features.forEach(feature => {
          params.append('features', feature);
        });
      }
      
      // Navigate to search page with criteria
      const searchUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
      toast.success('Running saved search...');
      onClose();
      
      // Use window.location instead of router.push for full page reload to apply filters
      window.location.href = searchUrl;
    } catch (error) {
      console.error('Error running saved search:', error);
      toast.error('An error occurred while running the search');
    }
  };

  const formatSearchCriteria = (search: SavedSearch) => {
    const criteria = [];
    
    if (search.searchCriteria.location) {
      criteria.push(`Location: ${search.searchCriteria.location}`);
    }
    
    if (search.searchCriteria.propertyType && search.searchCriteria.propertyType.length > 0) {
      criteria.push(`Type: ${search.searchCriteria.propertyType.join(', ')}`);
    }
    
    if (search.searchCriteria.priceRange) {
      const { min, max } = search.searchCriteria.priceRange;
      criteria.push(`Price: $${min.toLocaleString()} - $${max.toLocaleString()}`);
    }
    
    if (search.searchCriteria.bedrooms) {
      const { min, max } = search.searchCriteria.bedrooms;
      criteria.push(`Bedrooms: ${min} - ${max}`);
    }
    
    if (search.searchCriteria.bathrooms) {
      const { min, max } = search.searchCriteria.bathrooms;
      criteria.push(`Bathrooms: ${min} - ${max}`);
    }
    
    if (search.searchCriteria.status) {
      criteria.push(`Status: ${search.searchCriteria.status}`);
    }
    
    return criteria;
  };

  if (loading && savedSearches.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-500" />
              Saved Searches
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-green-500" />
            Saved Searches ({savedSearches.length})
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refresh}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {savedSearches.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Searches Yet</h3>
            <p className="text-gray-600 mb-4">
              Save your search criteria to get notified about new properties that match your preferences.
            </p>
            <Button onClick={onClose} variant="outline">
              Start Searching
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <Card key={search.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {editingId === search.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`name-${search.id}`} className="text-sm font-medium">
                            Search Name
                          </Label>
                          <Input
                            id={`name-${search.id}`}
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`location-${search.id}`} className="text-sm font-medium">
                            Location
                          </Label>
                          <Input
                            id={`location-${search.id}`}
                            value={editForm.location}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., Toronto, Downtown"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`priceMin-${search.id}`} className="text-sm font-medium">
                            Min Price
                          </Label>
                          <Input
                            id={`priceMin-${search.id}`}
                            type="number"
                            value={editForm.priceMin}
                            onChange={(e) => setEditForm(prev => ({ ...prev, priceMin: e.target.value }))}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`priceMax-${search.id}`} className="text-sm font-medium">
                            Max Price
                          </Label>
                          <Input
                            id={`priceMax-${search.id}`}
                            type="number"
                            value={editForm.priceMax}
                            onChange={(e) => setEditForm(prev => ({ ...prev, priceMax: e.target.value }))}
                            placeholder="1000000"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`bedroomsMin-${search.id}`} className="text-sm font-medium">
                            Min Bedrooms
                          </Label>
                          <Input
                            id={`bedroomsMin-${search.id}`}
                            type="number"
                            value={editForm.bedroomsMin}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bedroomsMin: e.target.value }))}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`bedroomsMax-${search.id}`} className="text-sm font-medium">
                            Max Bedrooms
                          </Label>
                          <Input
                            id={`bedroomsMax-${search.id}`}
                            type="number"
                            value={editForm.bedroomsMax}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bedroomsMax: e.target.value }))}
                            placeholder="10"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`status-${search.id}`} className="text-sm font-medium">
                            Status
                          </Label>
                          <Select
                            value={editForm.status}
                            onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buy">Buy</SelectItem>
                              <SelectItem value="lease">Lease</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`frequency-${search.id}`} className="text-sm font-medium">
                            Notification Frequency
                          </Label>
                          <Select
                            value={editForm.notificationFrequency}
                            onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                              setEditForm(prev => ({ ...prev, notificationFrequency: value }))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`active-${search.id}`}
                            checked={editForm.isActive}
                            onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
                          />
                          <Label htmlFor={`active-${search.id}`} className="text-sm">
                            Active Search
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`notifications-${search.id}`}
                            checked={editForm.emailNotifications}
                            onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, emailNotifications: checked }))}
                          />
                          <Label htmlFor={`notifications-${search.id}`} className="text-sm">
                            Email Notifications
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(search.id)}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {search.name}
                            </h3>
                            {search.isAutoSaved && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                Auto-Saved
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Created {new Date(search.createdAt).toLocaleDateString()}</span>
                            </div>
                            {search.lastRunAt && (
                              <div className="flex items-center gap-1">
                                <Play className="h-4 w-4" />
                                <span>Last run {new Date(search.lastRunAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={search.isActive ? "default" : "secondary"}>
                            {search.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {search.notificationSettings?.email && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              Notifications
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Search Criteria */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Search Criteria:</h4>
                        <div className="flex flex-wrap gap-2">
                          {formatSearchCriteria(search).map((criterion, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {criterion}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Notification Settings */}
                      {search.notificationSettings && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Notification Settings</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {search.notificationSettings.email ? (
                              <span>Email notifications enabled ({search.notificationSettings.frequency})</span>
                            ) : (
                              <span>Email notifications disabled</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunSearch(search.id)}
                          className="flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Run Search
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(search)}
                          className="flex items-center gap-2"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(search.id)}
                          disabled={removingId === search.id}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          {removingId === search.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator className="my-6" />

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
