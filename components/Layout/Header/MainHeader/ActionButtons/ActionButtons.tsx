'use client';

import { useAuth } from '@/components/Auth';
import { GetStartedButton } from './GetStartedButton';
import CallButton from './CallButton';
import AppButton from './AppButton';
import { UserMenu } from './UserMenu';

export default function ActionButtons() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex items-center space-x-3">
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <GetStartedButton />
      )}
      <CallButton />
      <AppButton />
    </div>
  );
}