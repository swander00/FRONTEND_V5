'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Property } from '@/types';
import { PropertyCard } from '@/components/Property/Listings';
import { PropertyDetailsModalDesktop } from '@/components/Property/Details/PropertyDetailsModalDesktop';
import { PropertyDetailsModalMobile } from '@/components/Property/Details/PropertyDetailsModalMobile';
import { PropertyInfoPopup } from '@/components/Search/MapView/PropertyInfoPopup';
import { MobilePropertyInfoPopup } from '@/components/Search/MapView/MobilePropertyInfoPopup';
import { SavedListingsModal } from '@/components/Auth/Modals/SavedListingsModal';
import { PropertySaveButton } from '@/components/shared/buttons';
import { useSavedListings } from '@/hooks/useUserData';
import { useAuth } from '@/components/Auth';
import { CheckCircle, XCircle, AlertCircle, Bookmark } from 'lucide-react';

// Mock property for testing
const mockProperty: Property = {
  ListingKey: 'TEST-SYNC-001',
  MLSNumber: 'TEST001',
  ListPrice: 850000,
  StreetAddress: '123 Test Sync Street',
  City: 'Toronto',
  StateOrProvince: 'ON',
  PostalCode: 'M5V 3A8',
  UnparsedAddress: '123 Test Sync Street, Toronto, ON M5V 3A8',
  BedroomsTotal: 3,
  BathroomsTotalInteger: 2,
  LivingArea: 2000,
  PropertyType: 'Residential',
  PropertySubType: 'Detached',
  StandardStatus: 'Active',
  ListDate: new Date().toISOString(),
  PrimaryImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  ]
};

const mockProperty2: Property = {
  ...mockProperty,
  ListingKey: 'TEST-SYNC-002',
  MLSNumber: 'TEST002',
  StreetAddress: '456 Test Avenue',
  UnparsedAddress: '456 Test Avenue, Toronto, ON M5V 3A8',
  ListPrice: 950000,
};

export default function TestSavedSyncPage() {
  const { user } = useAuth();
  const { savedListings } = useSavedListings();
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'pass' | 'fail' | 'pending';
    message: string;
  }>>([
    { test: 'User Authentication', status: 'pending', message: 'Checking user login status...' },
    { test: 'Save from PropertyCard', status: 'pending', message: 'Click the save button on PropertyCard' },
    { test: 'Save from PropertyDetailsModal', status: 'pending', message: 'Click the save button in Details Modal' },
    { test: 'Save from PropertyInfoPopup', status: 'pending', message: 'Click the save button in Info Popup' },
    { test: 'Sync across components', status: 'pending', message: 'Verify all buttons update' },
    { test: 'SavedListingsModal shows property', status: 'pending', message: 'Check property appears in Saved modal' },
    { test: 'Unsave from SavedListingsModal', status: 'pending', message: 'Remove property from Saved modal' },
    { test: 'Buttons unsync correctly', status: 'pending', message: 'Verify all buttons revert to unsaved state' },
  ]);

  const updateTestResult = (testName: string, status: 'pass' | 'fail' | 'pending', message: string) => {
    setTestResults(prev => 
      prev.map(t => 
        t.test === testName ? { ...t, status, message } : t
      )
    );
  };

  const checkUserAuth = () => {
    if (user) {
      updateTestResult('User Authentication', 'pass', `Logged in as ${user.email}`);
    } else {
      updateTestResult('User Authentication', 'fail', 'User not logged in. Please log in to test.');
    }
  };

  const checkSync = () => {
    const isSaved = savedListings.some(l => l.listingKey === mockProperty.ListingKey);
    if (isSaved) {
      updateTestResult('Sync across components', 'pass', 'All save buttons are synchronized');
      updateTestResult('SavedListingsModal shows property', 'pass', 'Property appears in Saved Listings');
    } else {
      updateTestResult('Sync across components', 'fail', 'Buttons are not synchronized');
      updateTestResult('SavedListingsModal shows property', 'fail', 'Property not found in Saved Listings');
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Saved Properties Synchronization Test
        </h1>
        <p className="text-gray-600">
          Test and validate that saved properties synchronize across all components
        </p>
      </div>

      {/* User Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Status</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Logged In
              </Badge>
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button size="sm" onClick={checkUserAuth}>
                Verify Auth
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="destructive">Not Logged In</Badge>
              <span className="text-sm text-gray-600">
                Please log in to test saved properties functionality
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results Dashboard */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            Current status of synchronization tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {result.test}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    {result.message}
                  </div>
                </div>
                <Badge
                  variant={
                    result.status === 'pass'
                      ? 'default'
                      : result.status === 'fail'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {result.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={checkSync} size="sm">
              Check Sync Status
            </Button>
            <Button
              onClick={() => setSavedModalOpen(true)}
              size="sm"
              variant="outline"
            >
              Open Saved Listings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Listings Info */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            Current Saved Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700">
            <strong>Count:</strong> {savedListings.length} saved{' '}
            {savedListings.length === 1 ? 'property' : 'properties'}
          </div>
          {savedListings.length > 0 && (
            <div className="mt-3 space-y-2">
              {savedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="p-2 bg-white rounded border border-blue-200"
                >
                  <div className="font-medium text-sm">
                    {listing.property.address}
                  </div>
                  <div className="text-xs text-gray-500">
                    Listing Key: {listing.listingKey}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Test Components Grid */}
      <div className="space-y-8">
        {/* PropertyCard Test */}
        <Card>
          <CardHeader>
            <CardTitle>1. PropertyCard Component</CardTitle>
            <CardDescription>
              Test save button on the property card (should appear next to like button)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              <PropertyCard property={mockProperty} />
              <PropertyCard property={mockProperty2} />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Instructions:</strong> Click the save button (bookmark icon) on either card.
                The button should light up and the property should be added to saved listings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Standalone Save Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>2. Standalone Save Buttons</CardTitle>
            <CardDescription>
              Test isolated PropertySaveButton components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-col items-center gap-2">
                <PropertySaveButton
                  property={mockProperty}
                  variant="card"
                  size="md"
                />
                <span className="text-xs text-gray-500">Card variant</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <PropertySaveButton
                  property={mockProperty}
                  variant="header"
                  size="md"
                />
                <span className="text-xs text-white">Header variant</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <PropertySaveButton
                  property={mockProperty}
                  variant="popup"
                  size="sm"
                />
                <span className="text-xs text-gray-500">Popup variant</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <PropertySaveButton
                  property={mockProperty}
                  variant="minimal"
                  size="lg"
                  showLabel
                />
                <span className="text-xs text-gray-500">Minimal with label</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Instructions:</strong> Click any of these buttons. All buttons for the same
                property should update simultaneously.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PropertyDetailsModal Test */}
        <Card>
          <CardHeader>
            <CardTitle>3. Property Details Modals</CardTitle>
            <CardDescription>
              Test save button in desktop and mobile detail views
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={() => setDesktopModalOpen(true)}>
                Open Desktop Details Modal
              </Button>
              <Button onClick={() => setMobileModalOpen(true)} variant="outline">
                Open Mobile Details Modal
              </Button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Instructions:</strong> Open either modal and click the save button in the
                header. Check that other save buttons update.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PropertyInfoPopup Test */}
        <Card>
          <CardHeader>
            <CardTitle>4. Property Info Popups</CardTitle>
            <CardDescription>
              Test save button in map view popups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={() => setShowPopup(!showPopup)}>
                Toggle Desktop Popup
              </Button>
              <Button onClick={() => setShowMobilePopup(!showMobilePopup)} variant="outline">
                Toggle Mobile Popup
              </Button>
            </div>
            {showPopup && (
              <div className="mt-4 flex justify-center">
                <PropertyInfoPopup
                  property={mockProperty}
                  onClose={() => setShowPopup(false)}
                />
              </div>
            )}
            {showMobilePopup && (
              <div className="mt-4 flex justify-center">
                <MobilePropertyInfoPopup
                  property={mockProperty}
                  onClose={() => setShowMobilePopup(false)}
                />
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Instructions:</strong> Click the toggle buttons to show the popups, then
                click the save button. Verify synchronization.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SavedListingsModal Test */}
        <Card>
          <CardHeader>
            <CardTitle>5. Saved Listings Modal</CardTitle>
            <CardDescription>
              Test removing properties from the saved listings modal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSavedModalOpen(true)}>
              Open Saved Listings Modal
            </Button>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Instructions:</strong> First save a property using any of the buttons
                above. Then open this modal and click "Remove" on a saved property. Verify that all
                save buttons across the app update to show the unsaved state.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Instructions */}
      <Card className="mt-8 bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Test Scenario 1: Save from any component</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
              <li>Click any save button on this page</li>
              <li>Verify the button changes to "saved" state (filled bookmark icon)</li>
              <li>Check that ALL other save buttons for the same property also update</li>
              <li>Open the Saved Listings Modal and confirm the property appears</li>
            </ol>
          </div>
          <Separator />
          <div>
            <strong>Test Scenario 2: Unsave from any component</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
              <li>Click a save button that's already in saved state</li>
              <li>Verify the button changes to "unsaved" state (empty bookmark icon)</li>
              <li>Check that ALL other save buttons for the same property also update</li>
              <li>Open the Saved Listings Modal and confirm the property is gone</li>
            </ol>
          </div>
          <Separator />
          <div>
            <strong>Test Scenario 3: Remove from Saved Listings Modal</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
              <li>Save a property using any save button</li>
              <li>Open the Saved Listings Modal</li>
              <li>Click "Remove" on the saved property</li>
              <li>Close the modal and verify ALL save buttons show unsaved state</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PropertyDetailsModalDesktop
        isOpen={desktopModalOpen}
        property={mockProperty}
        onClose={() => setDesktopModalOpen(false)}
      />

      <PropertyDetailsModalMobile
        isOpen={mobileModalOpen}
        property={mockProperty}
        onClose={() => setMobileModalOpen(false)}
      />

      <SavedListingsModal
        open={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
      />
    </div>
  );
}

