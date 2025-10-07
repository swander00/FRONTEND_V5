import { Container } from '@/components/ui/Layout';

function FooterBottom() {
  return (
    <div className="border-t border-gray-800 py-6">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 RealEstate. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

export { FooterBottom };
export default FooterBottom;