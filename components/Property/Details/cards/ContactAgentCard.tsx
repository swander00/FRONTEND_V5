// components/Property/Details/cards/ContactAgentCard.tsx
'use client';

import { Phone, Mail, MessageCircle, Calendar, Star, Award } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/types';

interface ContactAgentCardProps {
  property: Property;
}

export default function ContactAgentCard({ property }: ContactAgentCardProps) {
  // TODO: Replace with actual agent data from API
  const agent = {
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    company: "PropertyHub Realty",
    phone: "(555) 123-4567",
    email: "sarah.johnson@propertyhub.com",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Luxury Homes", "Investment Properties", "First-Time Buyers"],
    yearsExperience: 8,
    propertiesSold: 245
  };

  const handleCall = () => {
    window.open(`tel:${agent.phone}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${agent.email}?subject=Inquiry about Property ${property.MLSNumber}`);
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log('Open messaging dialog');
  };

  const handleSchedule = () => {
    // TODO: Implement scheduling functionality
    console.log('Open scheduling dialog');
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden lg:sticky lg:top-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-base sm:text-lg font-bold text-white">Contact Agent</h2>
        <p className="text-green-100 text-xs sm:text-sm mt-1">Get expert assistance with this property</p>
      </div>

      {/* Agent Profile */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <div className="relative flex-shrink-0">
            <Image
              src={agent.avatar}
              alt={agent.name}
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{agent.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{agent.title}</p>
            <p className="text-xs text-gray-500 truncate">{agent.company}</p>
          </div>
        </div>

        {/* Agent Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mr-1 fill-yellow-500" />
              <span className="text-base sm:text-lg font-bold text-gray-900">{agent.rating}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600">{agent.reviewCount} Reviews</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1" />
              <span className="text-base sm:text-lg font-bold text-gray-900">{agent.propertiesSold}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600">Properties Sold</p>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {agent.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-medium rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Actions */}
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={handleCall}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-sm sm:text-base transition-colors duration-200"
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Call Now
          </button>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={handleEmail}
              className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-200"
            >
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Email</span>
              <span className="sm:hidden">Email</span>
            </button>
            <button
              onClick={handleMessage}
              className="flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-200"
            >
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Message</span>
              <span className="sm:hidden">Message</span>
            </button>
          </div>
          
          <button
            onClick={handleSchedule}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-sm sm:text-base transition-colors duration-200 border border-gray-200"
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Schedule Viewing</span>
            <span className="sm:hidden">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}