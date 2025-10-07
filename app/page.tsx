import { Header } from '@/components/Layout';
import { PropertyListingsSection } from '@/components/Property';
import { Footer } from '@/components/Layout';
import { FiltersContainer, FilterProvider } from '@/components/Search';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FilterProvider>
        <FiltersContainer />
        <PropertyListingsSection />
      </FilterProvider>
      <Footer />
    </div>
  );
}