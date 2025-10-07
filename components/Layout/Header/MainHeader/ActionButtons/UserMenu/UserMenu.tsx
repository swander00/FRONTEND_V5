'use client';

import { useState } from 'react';
import { useAuth } from '@/components/Auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, Heart, Bookmark, Search } from 'lucide-react';
import { UserProfileModal, UserSettingsModal, LikedListingsModal, SavedListingsModal, SavedSearchesModal } from '@/components/Auth';

export function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLikedListingsModalOpen, setIsLikedListingsModalOpen] = useState(false);
  const [isSavedListingsModalOpen, setIsSavedListingsModalOpen] = useState(false);
  const [isSavedSearchesModalOpen, setIsSavedSearchesModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Simulate sign out delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use the signOut function from AuthProvider
      signOut();
      
      // Mark as signed out in localStorage
      localStorage.setItem('mock-auth-user', 'signed-out');
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
              <AvatarFallback>
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsLikedListingsModalOpen(true)}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Liked Listings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSavedListingsModalOpen(true)}>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Saved Listings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSavedSearchesModalOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            <span>Saved Searches</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
      <UserProfileModal 
        open={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
      <UserSettingsModal 
        open={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />
      <LikedListingsModal 
        open={isLikedListingsModalOpen} 
        onClose={() => setIsLikedListingsModalOpen(false)} 
      />
      <SavedListingsModal 
        open={isSavedListingsModalOpen} 
        onClose={() => setIsSavedListingsModalOpen(false)} 
      />
      <SavedSearchesModal 
        open={isSavedSearchesModalOpen} 
        onClose={() => setIsSavedSearchesModalOpen(false)} 
      />
    </>
  );
} 