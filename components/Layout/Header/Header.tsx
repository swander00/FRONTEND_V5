import TopBanner from './TopBanner';
import { MainHeader } from './MainHeader';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <TopBanner />
      <MainHeader />
    </header>
  );
}
