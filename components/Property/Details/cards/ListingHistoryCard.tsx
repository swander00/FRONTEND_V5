'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, History } from 'lucide-react';
import { Property } from '@/types';

interface ListingHistoryCardProps {
  property: Property;
}

interface ListingHistoryEntry {
  dateListed: string | null;
  listPrice: number | null;
  soldPrice: number | null;
  listingEnd: string | null;
  status: string;
  mlsNumber: string;
}

const STATUS_CONFIG = {
  Active: { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    label: 'Active'
  },
  Expired: { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    label: 'Expired'
  },
  Withdrawn: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    label: 'Withdrawn'
  },
  Sold: { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    label: 'Sold'
  }
} as const;

type StatusType = keyof typeof STATUS_CONFIG;

export default function ListingHistoryCard({ property }: ListingHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const currentListing = useMemo<ListingHistoryEntry>(() => ({
    dateListed: property.ListDate || null,
    listPrice: property.ListPrice || null,
    soldPrice: property.ClosePrice || null,
    listingEnd: property.ListingEnd || null,
    status: property.MlsStatus || 'Active',
    mlsNumber: property.MLSNumber || 'N/A',
  }), [property]);

  const listingHistory = [currentListing];

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="p-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between hover:bg-orange-50/50 transition-all duration-300 group rounded-lg p-2 -m-2"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
              <History className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Listing History</h3>
              <p className="text-sm text-slate-500 font-medium">Property listing timeline and changes</p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-orange-500 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div className="w-20 h-px bg-gradient-to-r from-orange-400 to-amber-500 mt-4"></div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 bg-slate-50/50 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider">
              <div>Date Listed</div>
              <div>List Price</div>
              <div>Listing End</div>
              <div>Status</div>
              <div>Sold Price</div>
              <div>MLS#</div>
            </div>

            {listingHistory.map((entry, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 hover:bg-slate-50/30 transition-all duration-300 rounded-lg border-b border-slate-200/60 last:border-b-0">
                <div className="text-sm font-semibold text-slate-800">
                  {entry.dateListed ? formatDate(entry.dateListed) : 'N/A'}
                </div>
                
                <div className="text-sm font-semibold text-slate-800">
                  {entry.listPrice != null ? formatPrice(entry.listPrice) : 'N/A'}
                </div>
                
                <div className="text-sm font-semibold text-slate-800">
                  {entry.listingEnd && entry.listingEnd !== 'Active' ? formatDate(entry.listingEnd) : 'Active'}
                </div>
                
                <div>
                  {getStatusBadge(entry.status)}
                </div>
                
                <div className="text-sm font-semibold text-slate-800">
                  {entry.soldPrice != null ? formatPrice(entry.soldPrice) : 'N/A'}
                </div>
                
                <div className="text-sm font-semibold text-slate-800 font-mono">
                  {entry.mlsNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
}

function getStatusBadge(status: string) {
  const config = STATUS_CONFIG[status as StatusType] || STATUS_CONFIG.Active;
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text} border border-current/20`}>
      {config.label}
    </span>
  );
}