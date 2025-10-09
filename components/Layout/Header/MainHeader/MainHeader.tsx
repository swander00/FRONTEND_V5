'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import { Navigation } from './Navigation';
import { ActionButtons } from './ActionButtons';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

export default function MainHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white shadow-sm">
      <div className="grid grid-cols-3 items-center h-16 px-4 sm:px-6 lg:px-8">
        <Logo />
        
        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex justify-center">
          <Navigation />
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center justify-end space-x-4">
          <ActionButtons />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex justify-end col-span-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex flex-col space-y-4">
                  <Navigation />
                </div>
                <div className="flex flex-col space-y-4 pt-4 border-t">
                  <ActionButtons />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}