import TopBanner from './TopBanner';
import MainHeader from './MainHeader';

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <TopBanner />
      <MainHeader />
    </header>
  );
}