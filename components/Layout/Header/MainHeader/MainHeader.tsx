import Logo from './Logo';
import { Navigation } from './Navigation';
import { ActionButtons } from './ActionButtons';

export default function MainHeader() {
  return (
    <div className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Logo />
        <Navigation />
        <ActionButtons />
      </div>
    </div>
  );
}