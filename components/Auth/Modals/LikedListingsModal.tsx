'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, MapPin, Bed, Bath, Square, DollarSign, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { useLikedListings } from '@/hooks/useUserData';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'sonner';
import Image from 'next/image';

interface LikedListingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function LikedListingsModal({ open, onClose }: LikedListingsModalProps) {
  const { likedListings, loading, error, unlikeListing, refresh } = useLikedListings();
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Refresh the list whenever the modal opens
  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  const handleUnlike = async (listingKey: string, listingId: string) => {
    try {
      setRemovingId(listingId);
      const success = await unlikeListing(listingKey);
      
      if (success) {
        toast.success('Removed from liked listings');
        // Refresh the list to get updated data
        await refresh();
      } else {
        toast.error('Failed to remove from liked listings');
      }
    } catch (error) {
      console.error('Error removing liked listing:', error);
      toast.error('An error occurred while removing the listing');
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewListing = (listingKey: string) => {
    // Navigate to property details page
    window.open(`/property/${listingKey}`, '_blank');
  };

  if (loading && likedListings.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Liked Listings
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
            <Heart className="h-5 w-5 text-red-500" />
            Liked Listings ({likedListings.length})
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

        {likedListings.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Liked Listings Yet</h3>
            <p className="text-gray-600 mb-4">
              Start exploring properties and like the ones you're interested in.
            </p>
            <Button onClick={onClose} variant="outline">
              Start Browsing
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {likedListings.map((listing) => (
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

                      {/* Liked Date */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Liked on {new Date(listing.likedAt).toLocaleDateString()}</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnlike(listing.property.listingKey, listing.id)}
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
