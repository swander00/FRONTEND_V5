import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactDetails() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-blue-400" />
          <span className="text-gray-400">(555) 123-4567</span>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-blue-400" />
          <span className="text-gray-400">info@realestate.com</span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-400" />
          <span className="text-gray-400">123 Main Street, City, State 12345</span>
        </div>
      </div>
    </div>
  );
}