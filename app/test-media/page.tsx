'use client';

import React, { useState } from 'react';
import { useMainPhoto, usePropertyPhotos, useMediaCount } from '@/hooks/usePropertyMedia';
import { PropertyGallery } from '@/components/Property';
import { MediaCountBadge } from '@/components/Property';
import { ImageWithFallback } from '@/components/ui/Data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestMediaPage() {
  const [listingKey, setListingKey] = useState('TEST123');
  const [testListingKey, setTestListingKey] = useState('TEST123');

  const { mainPhoto, loading: mainPhotoLoading, error: mainPhotoError } = useMainPhoto(testListingKey);
  const { photos, loading: photosLoading, error: photosError } = usePropertyPhotos(testListingKey);
  const { count, loading: countLoading, error: countError } = useMediaCount(testListingKey);

  const handleTest = () => {
    setTestListingKey(listingKey);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Media System Test Page</h1>
        <p className="text-gray-600">Test the TRREB RESO Media Integration</p>
      </div>

      {/* Test Input */}
      <Card>
        <CardHeader>
          <CardTitle>Test with Listing Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={listingKey}
              onChange={(e) => setListingKey(e.target.value)}
              placeholder="Enter listing key (e.g., TEST123)"
              className="flex-1"
            />
            <Button onClick={handleTest}>Test</Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Current testing with: <code className="bg-gray-100 px-1 rounded">{testListingKey}</code>
          </p>
        </CardContent>
      </Card>

      {/* Main Photo Test */}
      <Card>
        <CardHeader>
          <CardTitle>Main Photo Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Status:</span>
              {mainPhotoLoading && <span className="text-blue-600">Loading...</span>}
              {mainPhotoError && <span className="text-red-600">Error: {mainPhotoError}</span>}
              {!mainPhotoLoading && !mainPhotoError && (
                <span className="text-green-600">
                  {mainPhoto ? 'Photo found' : 'No photo available'}
                </span>
              )}
            </div>
            
            <div className="max-w-md">
              <ImageWithFallback
                src={mainPhoto}
                alt="Main property photo"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Count Test */}
      <Card>
        <CardHeader>
          <CardTitle>Media Count Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Status:</span>
              {countLoading && <span className="text-blue-600">Loading...</span>}
              {countError && <span className="text-red-600">Error: {countError}</span>}
              {!countLoading && !countError && (
                <span className="text-green-600">Count: {count}</span>
              )}
            </div>
            
            <div>
              <MediaCountBadge count={count} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Gallery Test */}
      <Card>
        <CardHeader>
          <CardTitle>Property Gallery Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Status:</span>
              {photosLoading && <span className="text-blue-600">Loading...</span>}
              {photosError && <span className="text-red-600">Error: {photosError}</span>}
              {!photosLoading && !photosError && (
                <span className="text-green-600">
                  {photos.length} photos found
                </span>
              )}
            </div>
            
            <PropertyGallery status="Active" propertyType="Condo Apartment" />
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints Info */}
      <Card>
        <CardHeader>
          <CardTitle>Available API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><code>GET /api/properties/{testListingKey}/media</code> - All media</div>
            <div><code>GET /api/properties/{testListingKey}/media/main</code> - Main photo only</div>
            <div><code>GET /api/properties/{testListingKey}/media/public</code> - Public media only</div>
            <div><code>GET /api/properties/{testListingKey}/media/count</code> - Media count</div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Get Main Photo in Component:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { useMainPhoto } from '@/hooks/usePropertyMedia';

const { mainPhoto, loading, error } = useMainPhoto(listingKey);`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Get All Photos:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { usePropertyPhotos } from '@/hooks/usePropertyMedia';

const { photos, loading, error } = usePropertyPhotos(listingKey);`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">3. Get Media Count:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { useMediaCount } from '@/hooks/usePropertyMedia';

const { count, loading, error } = useMediaCount(listingKey);`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
