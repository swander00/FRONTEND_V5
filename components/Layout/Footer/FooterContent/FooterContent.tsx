import { Container } from '@/components/ui/Layout';
import CompanyInfo from './CompanyInfo';
import QuickLinks from './QuickLinks';
import ContactDetails from './ContactDetails';

export default function FooterContent() {
  return (
    <div className="py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CompanyInfo />
          <QuickLinks />
          <ContactDetails />
        </div>
      </Container>
    </div>
  );
}