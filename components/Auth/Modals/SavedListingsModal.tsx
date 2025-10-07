'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bookmark, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  Edit3, 
  Save, 
  X,
  Tag
} from 'lucide-react';
import { useSavedListings } from '@/hooks/useUserData';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'sonner';
import Image from 'next/image';

interface SavedListingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SavedListingsModal({ open, onClose }: SavedListingsModalProps) {
  const { savedListings, loading, error, updateListing, unsaveListing, refresh } = useSavedListings();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    notes: '',
    tags: ''
  });

  // Refresh listings when modal opens
  useEffect(() => {
    if (open) {
      console.log('🟣 SavedListingsModal opened, refreshing...');
      refresh();
    }
  }, [open, refresh]);

  // Debug: Log saved listings when they change
  useEffect(() => {
    console.log('🟣 SavedListingsModal: savedListings updated', {
      count: savedListings.length,
      listings: savedListings.map(l => ({
        id: l.id,
        listingKey: l.listingKey,
        address: l.property.address
      }))
    });
  }, [savedListings]);

  const handleEdit = (listing: any) => {
    setEditingId(listing.id);
    setEditForm({
      notes: listing.notes || '',
      tags: listing.tags ? listing.tags.join(', ') : ''
    });
  };

  const handleSaveEdit = async (listingId: string, listingKey: string) => {
    try {
      const tags = editForm.tags 
        ? editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      const success = await updateListing(listingKey, {
        notes: editForm.notes,
        tags
      });
      
      if (success) {
        toast.success('Saved listing updated');
        setEditingId(null);
        await refresh();
      } else {
        toast.error('Failed to update saved listing');
      }
    } catch (error) {
      console.error('Error updating saved listing:', error);
      toast.error('An error occurred while updating the listing');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ notes: '', tags: '' });
  };

  const handleUnsave = async (listingKey: string, listingId: string) => {
    try {
      setRemovingId(listingId);
      const success = await unsaveListing(listingKey);
      
      if (success) {
        toast.success('Removed from saved listings');
        await refresh();
      } else {
        toast.error('Failed to remove from saved listings');
      }
    } catch (error) {
      console.error('Error removing saved listing:', error);
      toast.error('An error occurred while removing the listing');
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewListing = (listingKey: string) => {
    // Navigate to property details page
    window.open(`/property/${listingKey}`, '_blank');
  };

  if (loading && savedListings.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-blue-500" />
              Saved Listings
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
            <Bookmark className="h-5 w-5 text-blue-500" />
            Saved Listings ({savedListings.length})
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

        {savedListings.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Listings Yet</h3>
            <p className="text-gray-600 mb-4">
              Save properties you&apos;re interested in to keep track of them.
            </p>
            <Button onClick={onClose} variant="outline">
              Start Browsing
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Property Image */}
                    <div className="relative w-48 h-48 flex-shrink-0">
                      {listing.property.primaryImageUrl ? (
                        <Image
                          src={listing.property.primaryImageUrl}
                          alt={listing.property.address}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 left-2 bg-white/90 text-gray-800"
                      >
                        {listing.property.status}
                      </Badge>
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {listing.property.address}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{listing.property.propertyType}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(listing.property.price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {listing.property.squareFootage} sq ft
                          </div>
                        </div>
                      </div>

                      {/* Property Features */}
                      <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{listing.property.bedrooms} bed{listing.property.bedrooms !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{listing.property.bathrooms} bath{listing.property.bathrooms !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          <span>{listing.property.squareFootage} sq ft</span>
                        </div>
                      </div>

                      {/* Notes and Tags */}
                      {editingId === listing.id ? (
                        <div className="space-y-4 mb-4">
                          <div>
                            <Label htmlFor={`notes-${listing.id}`} className="text-sm font-medium">
                              Notes
                            </Label>
                            <Textarea
                              id={`notes-${listing.id}`}
                              value={editForm.notes}
                              onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Add your notes about this property..."
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`tags-${listing.id}`} className="text-sm font-medium">
                              Tags (comma-separated)
                            </Label>
                            <Input
                              id={`tags-${listing.id}`}
                              value={editForm.tags}
                              onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                              placeholder="e.g., work-commute, downtown, family"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(listing.id, listing.property.listingKey)}
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
                        <div className="space-y-3 mb-4">
                          {listing.notes && (
                            <div>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                <strong>Notes:</strong> {listing.notes}
                              </p>
                            </div>
                          )}
                          {listing.tags && listing.tags.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Tags:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {listing.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Saved Date */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Saved on {new Date(listing.savedAt).toLocaleDateString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewListing(listing.property.listingKey)}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Details
                        </Button>
                        {editingId === listing.id ? null : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(listing)}
                            className="flex items-center gap-2"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnsave(listing.property.listingKey, listing.id)}
                          disabled={removingId === listing.id}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          {removingId === listing.id ? 'Removing...' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
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
