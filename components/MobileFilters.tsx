'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Search, MapPin, Home, DollarSign, Bed, Bath, ChevronDown, ChevronUp, Calendar, Building2, Ruler, Car, Wrench, Clock, DoorOpen, Check } from 'lucide-react';
import { useFilters } from './Search';

const propertyTypes = [
  'Detached',
  'Semi-Detached',
  'Townhouse (Row)',
  'Link House',
  'Rural / Farm',
  'Condo Apartment',
  'Condo Townhouse',
  'Detached Condo',
  'Semi-Detached Condo',
  'Specialty Condos',
  'Duplex',
  'Triplex',
  'Multiplex',
  'Cottage',
  'Mobile / Manufactured Home',
  'Vacant Land',
  'Vacant Land Condo',
  'Parking / Locker',
  'Individual Units (Room / Upper)',
  'Timeshare',
];
const cities = ['Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill', 'Oakville', 'Burlington'];
const houseStyles = ['2-Storey', 'Bungalow', 'Backsplit', 'Sidesplit', 'Raised Bungalow', 'Bungalow-Loft', '3-Storey'];
const basementFeatures = ['Finished', 'Unfinished', 'Walk-Out', 'Separate Entrance', 'Apartment'];

const transactionStatuses = [
  { value: 'buy', label: 'For Sale' },
  { value: 'lease', label: 'For Lease' },
  { value: 'sold', label: 'Sold' },
  { value: 'leased', label: 'Leased' },
  { value: 'removed', label: 'Removed' },
];

const datePresets = [
  { value: '7-days', label: '7 Days' },
  { value: '30-days', label: '30 Days' },
  { value: '60-days', label: '60 Days' },
  { value: '90-days', label: '90 Days' },
];

const sqftRanges = [
  { value: 'any', label: 'Any Size' },
  { value: '0-1000', label: 'Under 1,000 ft²' },
  { value: '1000-1500', label: '1,000 - 1,500 ft²' },
  { value: '1500-2000', label: '1,500 - 2,000 ft²' },
  { value: '2000-2500', label: '2,000 - 2,500 ft²' },
  { value: '2500-3000', label: '2,500 - 3,000 ft²' },
  { value: '3000-3500', label: '3,000 - 3,500 ft²' },
  { value: '3500-4000', label: '3,500 - 4,000 ft²' },
  { value: '4000-5000', label: '4,000 - 5,000 ft²' },
  { value: '5000+', label: 'Over 5,000 ft²' },
];

interface CityCarouselProps {
  cities: string[];
  selectedCities: string[];
  onToggleCity: (city: string) => void;
  onSelectAll: () => void;
}

function CityCarousel({ cities, selectedCities, onToggleCity, onSelectAll }: CityCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  
  // Create extended array with duplicates for infinite loop
  const allCitiesWithAll = ['All Cities', ...cities];
  const extendedCities = [...allCitiesWithAll, ...allCitiesWithAll, ...allCitiesWithAll];
  
  const itemWidth = 130; // Approximate width of each chip
  const totalItems = allCitiesWithAll.length;
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Start in the middle set
    container.scrollLeft = itemWidth * totalItems;
  }, []);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isDragging) return;
    
    const animate = () => {
      if (Math.abs(velocity) > 0.1) {
        container.scrollLeft += velocity;
        setVelocity(velocity * 0.95); // Deceleration
        
        // Handle infinite loop
        handleInfiniteScroll();
        
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (Math.abs(velocity) > 0.1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [velocity, isDragging]);
  
  const handleInfiniteScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollPos = container.scrollLeft;
    const sectionWidth = itemWidth * totalItems;
    
    // If scrolled past the second set, jump back to first set
    if (scrollPos >= sectionWidth * 2) {
      container.scrollLeft = scrollPos - sectionWidth;
    }
    // If scrolled before the first set, jump to second set
    else if (scrollPos < sectionWidth * 0.5) {
      container.scrollLeft = scrollPos + sectionWidth;
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    setVelocity(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    setVelocity(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;
    
    setVelocity(container.scrollLeft - newScrollLeft);
    container.scrollLeft = newScrollLeft;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;
    
    setVelocity(container.scrollLeft - newScrollLeft);
    container.scrollLeft = newScrollLeft;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleCityClick = (city: string) => {
    if (city === 'All Cities') {
      onSelectAll();
    } else {
      onToggleCity(city);
    }
  };
  
  const isCitySelected = (city: string) => {
    if (city === 'All Cities') {
      return selectedCities.length === 0;
    }
    return selectedCities.includes(city);
  };
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#475569', 
        marginBottom: '12px',
        padding: '0 12px'
      }}>
        <MapPin size={18} /> City
        {selectedCities.length > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '12px',
            fontWeight: '700',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '4px 10px',
            borderRadius: '12px',
          }}>
            {selectedCities.length} selected
          </span>
        )}
      </label>
      
      {/* Carousel Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(to right, rgba(248,250,252,0.9) 0%, transparent 10%, transparent 90%, rgba(248,250,252,0.9) 100%)',
        padding: '8px 0',
        borderRadius: '16px',
      }}>
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging ? 'grabbing' : 'grab',
            padding: '4px 16px',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
          }}
        >
          {extendedCities.map((city, index) => {
            const isSelected = isCitySelected(city);
            return (
              <button
                key={`${city}-${index}`}
                onClick={() => handleCityClick(city)}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  padding: '12px 24px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'white',
                  color: isSelected ? 'white' : '#475569',
                  border: isSelected ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected 
                    ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.05)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  pointerEvents: isDragging ? 'none' : 'auto',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !isDragging) {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {city}
              </button>
            );
          })}
        </div>
        
        {/* Hide scrollbar */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
      
      {/* Swipe hint */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        marginTop: '8px',
        fontWeight: '500',
      }}>
        ← Swipe to explore more cities →
      </div>
    </div>
  );
}

interface PropertyTypeCarouselProps {
  propertyTypes: string[];
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  onSelectAll: () => void;
}

function PropertyTypeCarousel({ propertyTypes, selectedTypes, onToggleType, onSelectAll }: PropertyTypeCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  
  // Create extended array with duplicates for infinite loop
  const allTypesWithAll = ['All Property Types', ...propertyTypes];
  const extendedTypes = [...allTypesWithAll, ...allTypesWithAll, ...allTypesWithAll];
  
  const itemWidth = 160; // Approximate width of each chip
  const totalItems = allTypesWithAll.length;
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Start in the middle set
    container.scrollLeft = itemWidth * totalItems;
  }, []);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isDragging) return;
    
    const animate = () => {
      if (Math.abs(velocity) > 0.1) {
        container.scrollLeft += velocity;
        setVelocity(velocity * 0.95); // Deceleration
        
        // Handle infinite loop
        handleInfiniteScroll();
        
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (Math.abs(velocity) > 0.1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [velocity, isDragging]);
  
  const handleInfiniteScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollPos = container.scrollLeft;
    const sectionWidth = itemWidth * totalItems;
    
    // If scrolled past the second set, jump back to first set
    if (scrollPos >= sectionWidth * 2) {
      container.scrollLeft = scrollPos - sectionWidth;
    }
    // If scrolled before the first set, jump to second set
    else if (scrollPos < sectionWidth * 0.5) {
      container.scrollLeft = scrollPos + sectionWidth;
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    setVelocity(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    setVelocity(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;
    
    setVelocity(container.scrollLeft - newScrollLeft);
    container.scrollLeft = newScrollLeft;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;
    
    setVelocity(container.scrollLeft - newScrollLeft);
    container.scrollLeft = newScrollLeft;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const handleTypeClick = (type: string) => {
    if (type === 'All Property Types') {
      onSelectAll();
    } else {
      onToggleType(type);
    }
  };
  
  const isTypeSelected = (type: string) => {
    if (type === 'All Property Types') {
      return selectedTypes.length === 0;
    }
    return selectedTypes.includes(type);
  };
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#475569', 
        marginBottom: '12px',
        padding: '0 12px'
      }}>
        <Home size={18} /> Property Type
        {selectedTypes.length > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '12px',
            fontWeight: '700',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '4px 10px',
            borderRadius: '12px',
          }}>
            {selectedTypes.length} selected
          </span>
        )}
      </label>
      
      {/* Carousel Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(to right, rgba(248,250,252,0.9) 0%, transparent 10%, transparent 90%, rgba(248,250,252,0.9) 100%)',
        padding: '8px 0',
        borderRadius: '16px',
      }}>
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging ? 'grabbing' : 'grab',
            padding: '4px 16px',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
          }}
        >
          {extendedTypes.map((type, index) => {
            const isSelected = isTypeSelected(type);
            return (
              <button
                key={`${type}-${index}`}
                onClick={() => handleTypeClick(type)}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  padding: '12px 24px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'white',
                  color: isSelected ? 'white' : '#475569',
                  border: isSelected ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected 
                    ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.05)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  pointerEvents: isDragging ? 'none' : 'auto',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !isDragging) {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
        
        {/* Hide scrollbar */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
      
      {/* Swipe hint */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        marginTop: '8px',
        fontWeight: '500',
      }}>
        ← Swipe to explore more types →
      </div>
    </div>
  );
}

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFiltersModal({ isOpen, onClose }: MobileFiltersModalProps) {
  const { filters: contextFilters, updateFilter: updateContextFilter, clearAllFilters: clearContextFilters } = useFilters();
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [sqftDropdownOpen, setSqftDropdownOpen] = useState(false);
  const [priceRangeExpanded, setPriceRangeExpanded] = useState(false);
  
  const [filters, setFilters] = useState({
    transactionStatus: contextFilters.status || 'buy',
    dateRange: 'all-time',
    customDateStart: '',
    cities: contextFilters.city || [] as string[],
    propertyTypes: contextFilters.propertyType || [] as string[],
    priceMin: contextFilters.priceRange?.min?.toString() || '',
    priceMax: contextFilters.priceRange?.max?.toString() || '',
    bedroomsMin: contextFilters.bedrooms?.min?.toString() || '',
    bedroomsMax: contextFilters.bedrooms?.max?.toString() || '',
    bedroomsExpanded: false,
    bathroomsMin: contextFilters.bathrooms?.min?.toString() || '',
    bathroomsMax: contextFilters.bathrooms?.max?.toString() || '',
    bathroomsExpanded: false,
    // Advanced
    propertyClass: ['Freehold', 'Condo'] as string[],
    sqftRange: 'any',
    houseStyles: [] as string[],
    lotFrontageMin: '',
    lotFrontageMax: '',
    maintenanceFeeMax: '',
    daysOnMarket: '',
    garageParking: '',
    totalParking: '',
    basementFeatures: [] as string[],
    basementKitchen: false,
    openHouse: false,
  });

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const current = filters[key as keyof typeof filters] as string[] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const handleClearAll = () => {
    setFilters({
      transactionStatus: 'buy',
      dateRange: 'all-time',
      customDateStart: '',
      cities: [] as string[],
      propertyTypes: [] as string[],
      priceMin: '',
      priceMax: '',
      bedroomsMin: '',
      bedroomsMax: '',
      bedroomsExpanded: false,
      bathroomsMin: '',
      bathroomsMax: '',
      bathroomsExpanded: false,
      propertyClass: ['Freehold', 'Condo'] as string[],
      sqftRange: 'any',
      houseStyles: [] as string[],
      lotFrontageMin: '',
      lotFrontageMax: '',
      maintenanceFeeMax: '',
      daysOnMarket: '',
      garageParking: '',
      totalParking: '',
      basementFeatures: [] as string[],
      basementKitchen: false,
      openHouse: false,
    });
    clearContextFilters();
  };

  const handleApply = () => {
    // Update context filters with the selected values
    updateContextFilter('status', filters.transactionStatus);
    updateContextFilter('city', filters.cities);
    updateContextFilter('propertyType', filters.propertyTypes);
    
    if (filters.priceMin || filters.priceMax) {
      updateContextFilter('priceRange', {
        min: parseInt(filters.priceMin) || 0,
        max: parseInt(filters.priceMax) || 10000000,
      });
    }
    
    if (filters.bedroomsMin || filters.bedroomsMax) {
      updateContextFilter('bedrooms', {
        min: parseInt(filters.bedroomsMin) || 0,
        max: parseInt(filters.bedroomsMax) || 10,
      });
    }
    
    if (filters.bathroomsMin || filters.bathroomsMax) {
      updateContextFilter('bathrooms', {
        min: parseInt(filters.bathroomsMin) || 0,
        max: parseInt(filters.bathroomsMax) || 10,
      });
    }

    console.log('Filters applied:', filters);
    onClose();
  };

  const handlePropertyClassToggle = (selectedClass: string) => {
    const current = filters.propertyClass;
    
    if (selectedClass === 'Commercial') {
      // If Commercial is clicked, it becomes the only selection
      if (current.includes('Commercial')) {
        // Deselecting Commercial, revert to default
        updateFilter('propertyClass', ['Freehold', 'Condo']);
      } else {
        // Selecting Commercial, clear others
        updateFilter('propertyClass', ['Commercial']);
      }
    } else {
      // Clicking Freehold or Condo
      if (current.includes('Commercial')) {
        // If Commercial is selected, replace it with the clicked item
        updateFilter('propertyClass', [selectedClass]);
      } else {
        // Normal toggle for Freehold/Condo
        if (current.includes(selectedClass)) {
          // Deselecting - remove it but keep the other
          const updated = current.filter(c => c !== selectedClass);
          // Ensure at least one is selected (prevent both from being deselected)
          if (updated.length === 0) {
            updateFilter('propertyClass', [selectedClass]);
          } else {
            updateFilter('propertyClass', updated);
          }
        } else {
          // Selecting - add it
          updateFilter('propertyClass', [...current, selectedClass]);
        }
      }
    }
  };

  const selectStatus = (status: string) => {
    updateFilter('transactionStatus', status);
    setStatusDropdownOpen(false);
  };

  const selectDateRange = (range: string) => {
    updateFilter('dateRange', range);
    if (range !== 'custom') {
      setDateDropdownOpen(false);
    }
  };

  const getStatusLabel = () => {
    const status = transactionStatuses.find(s => s.value === filters.transactionStatus);
    return status ? status.label : 'For Sale';
  };

  const getDateLabel = () => {
    if (filters.dateRange === 'custom' && filters.customDateStart) {
      return 'Custom Range';
    }
    if (filters.dateRange === 'all-time') {
      return 'All Time';
    }
    const preset = datePresets.find(p => p.value === filters.dateRange);
    return preset ? preset.label : 'All Time';
  };

  const getSqftLabel = () => {
    const range = sqftRanges.find(r => r.value === filters.sqftRange);
    return range ? range.label : 'Any Size';
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)',
        position: 'relative',
      }}>
        {/* Sticky Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #e2e8f0',
          background: 'white',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Search size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1e293b' }}>Filters</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleClearAll} style={{
              padding: '10px 16px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#64748b',
              cursor: 'pointer',
            }}>
              Clear All
            </button>
            <button onClick={onClose} style={{
              width: '40px',
              height: '40px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <X size={20} color="#64748b" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* ALL FILTERS */}
          <div style={{
            padding: '12px',
            marginBottom: '20px',
          }}>

            {/* Property Class */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#475569', 
                marginBottom: '12px' 
              }}>
                <Building2 size={18} /> Property Class
                {filters.propertyClass.length > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'white',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                  }}>
                    {filters.propertyClass.length} selected
                  </span>
                )}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['Freehold', 'Condo', 'Commercial'].map(propertyClass => {
                  const isSelected = filters.propertyClass.includes(propertyClass);
                  return (
                    <button 
                      key={propertyClass} 
                      onClick={() => handlePropertyClassToggle(propertyClass)} 
                      style={{
                        padding: '12px 20px',
                        background: isSelected 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          : 'white',
                        color: isSelected ? 'white' : '#475569',
                        border: isSelected ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isSelected 
                          ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
                          : '0 2px 4px rgba(0, 0, 0, 0.05)',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        textAlign: 'center',
                        minHeight: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                        }
                      }}
                    >
                      {propertyClass}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transaction Status & Date Range - Two Button Pill Group */}
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                Status & Time Period
              </label>
              <div style={{
                display: 'flex',
                background: '#f8fafc',
                borderRadius: '14px',
                padding: '4px',
                border: '2px solid #e2e8f0',
              }}>
                {/* Status Button */}
                <button
                  onClick={() => {
                    setStatusDropdownOpen(!statusDropdownOpen);
                    setDateDropdownOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRight: '2px solid #e2e8f0',
                    borderRadius: '10px 0 0 10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: statusDropdownOpen ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  <span>{getStatusLabel()}</span>
                  <ChevronDown size={16} />
                </button>

                {/* Date Range Button */}
                <button
                  onClick={() => {
                    setDateDropdownOpen(!dateDropdownOpen);
                    setStatusDropdownOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    background: filters.dateRange !== 'all-time'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : dateDropdownOpen ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '0 10px 10px 0',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: filters.dateRange !== 'all-time' ? 'white' : '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: dateDropdownOpen ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  <Calendar size={16} />
                  <span>{getDateLabel()}</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Status Dropdown Modal */}
              {statusDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '50%',
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 100,
                  padding: '8px',
                  animation: 'slideDown 0.2s ease-out',
                }}>
                  {transactionStatuses.map(status => (
                    <button
                      key={status.value}
                      onClick={() => selectStatus(status.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: filters.transactionStatus === status.value ? '#f0f4ff' : 'transparent',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: filters.transactionStatus === status.value ? '#667eea' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (filters.transactionStatus !== status.value) {
                          e.currentTarget.style.background = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (filters.transactionStatus !== status.value) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <span>{status.label}</span>
                      {filters.transactionStatus === status.value && <Check size={18} color="#667eea" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Date Range Dropdown Modal */}
              {dateDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '50%',
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 100,
                  padding: '8px',
                  animation: 'slideDown 0.2s ease-out',
                }}>
                  {/* All Time Option */}
                  <button
                    onClick={() => selectDateRange('all-time')}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: filters.dateRange === 'all-time' ? '#f0f4ff' : 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: filters.dateRange === 'all-time' ? '#667eea' : '#475569',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      marginBottom: '4px',
                    }}
                  >
                    <span>All Time</span>
                    {filters.dateRange === 'all-time' && <Check size={18} color="#667eea" />}
                  </button>

                  {/* Preset Options */}
                  {datePresets.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => selectDateRange(preset.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: filters.dateRange === preset.value ? '#f0f4ff' : 'transparent',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: filters.dateRange === preset.value ? '#667eea' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                        marginBottom: '4px',
                      }}
                      onMouseEnter={(e) => {
                        if (filters.dateRange !== preset.value) {
                          e.currentTarget.style.background = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (filters.dateRange !== preset.value) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <span>{preset.label}</span>
                      {filters.dateRange === preset.value && <Check size={18} color="#667eea" />}
                    </button>
                  ))}

                  {/* Custom Date Range - Single "Since" Picker */}
                  <div style={{
                    borderTop: '1px solid #e2e8f0',
                    marginTop: '8px',
                    paddingTop: '12px',
                  }}>
                    <div style={{
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '12px',
                    }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                        {filters.transactionStatus === 'buy' && 'Listed Since'}
                        {filters.transactionStatus === 'lease' && 'Listed Since'}
                        {filters.transactionStatus === 'sold' && 'Sold Since'}
                        {filters.transactionStatus === 'leased' && 'Leased Since'}
                        {filters.transactionStatus === 'removed' && 'Removed Since'}
                      </label>
                      <input
                        type="date"
                        value={filters.customDateStart}
                        onChange={(e) => {
                          updateFilter('customDateStart', e.target.value);
                          updateFilter('dateRange', 'custom');
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: '#1e293b',
                          marginBottom: '8px',
                        }}
                      />
                      <button
                        onClick={() => setDateDropdownOpen(false)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* City Filter - Circular Carousel */}
            <div style={{ margin: '0 -12px' }}>
              <CityCarousel 
                cities={cities}
                selectedCities={filters.cities}
                onToggleCity={(city) => toggleArrayFilter('cities', city)}
                onSelectAll={() => updateFilter('cities', [])}
              />
            </div>

            {/* Property Type - Swipable Carousel */}
            <div style={{ margin: '0 -12px' }}>
              <PropertyTypeCarousel 
                propertyTypes={propertyTypes}
                selectedTypes={filters.propertyTypes}
                onToggleType={(type) => toggleArrayFilter('propertyTypes', type)}
                onSelectAll={() => updateFilter('propertyTypes', [])}
              />
            </div>

            {/* Price Range - Redesigned with Slider */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#475569', 
                marginBottom: '12px' 
              }}>
                <DollarSign size={18} /> 
                {filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' 
                  ? 'Monthly Rent' 
                  : 'Price Range'}
              </label>
              
              {/* Price Range Display */}
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                      Min
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {filters.priceMin ? `$${parseInt(filters.priceMin).toLocaleString()}` : 'Any'}
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', opacity: 0.7, padding: '0 12px' }}>
                    →
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                      Max
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {filters.priceMax ? `$${parseInt(filters.priceMax).toLocaleString()}` : 'Any'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Range Slider */}
              <div style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', height: '40px' }}>
                  {/* Slider Track */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    top: '17px',
                  }} />
                  
                  {/* Active Track */}
                  <div style={{
                    position: 'absolute',
                    height: '6px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '3px',
                    top: '17px',
                    left: `${(parseInt(filters.priceMin || '0') / (filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? 10000 : 5000000)) * 100}%`,
                    right: `${100 - (parseInt(filters.priceMax || (filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '10000' : '5000000')) / (filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? 10000 : 5000000)) * 100}%`,
                  }} />

                  {/* Max Range Input - Placed First */}
                  <input
                    type="range"
                    className="range-slider range-max"
                    min="0"
                    max={filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '10000' : '5000000'}
                    step={filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '100' : '50000'}
                    value={filters.priceMax || (filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '10000' : '5000000')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const minVal = parseInt(filters.priceMin || '0');
                      if (parseInt(value) >= minVal) {
                        const maxValue = filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '10000' : '5000000';
                        updateFilter('priceMax', value === maxValue ? '' : value);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '40px',
                      background: 'transparent',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 4,
                      cursor: 'pointer',
                    }}
                  />

                  {/* Min Range Input - Placed Second */}
                  <input
                    type="range"
                    className="range-slider range-min"
                    min="0"
                    max={filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '10000' : '5000000'}
                    step={filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '100' : '50000'}
                    value={filters.priceMin || '0'}
                    onChange={(e) => {
                      const value = e.target.value;
                      const maxVal = parseInt(filters.priceMax || (filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? '10000' : '5000000'));
                      if (parseInt(value) <= maxVal) {
                        updateFilter('priceMin', value === '0' ? '' : value);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '40px',
                      background: 'transparent',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 5,
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              {/* Expand/Collapse Button for Custom Range */}
              <button
                onClick={() => setPriceRangeExpanded(!priceRangeExpanded)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: priceRangeExpanded ? '#f0f4ff' : '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#667eea',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  marginBottom: priceRangeExpanded ? '12px' : '0',
                }}
              >
                <span>Manual Entry</span>
                {priceRangeExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Custom Range Inputs - Collapsible */}
              {priceRangeExpanded && (
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    animation: 'slideDown 0.3s ease-out',
                  }}
                >
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#64748b', 
                      marginBottom: '6px' 
                    }}>
                      Min
                    </label>
                    <input 
                      type="number" 
                      placeholder="$ Min" 
                      value={filters.priceMin} 
                      onChange={(e) => updateFilter('priceMin', e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '16px 12px',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1e293b',
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#64748b', 
                      marginBottom: '6px' 
                    }}>
                      Max
                    </label>
                    <input 
                      type="number" 
                      placeholder="$ Max" 
                      value={filters.priceMax} 
                      onChange={(e) => updateFilter('priceMax', e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '16px 12px',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1e293b',
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
            
            <style>{`
              .range-slider {
                pointer-events: none;
              }
              
              .range-slider::-webkit-slider-thumb {
                pointer-events: auto;
                appearance: none;
                -webkit-appearance: none;
                width: 24px;
                height: 24px;
                background: white;
                border: 3px solid #667eea;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                transition: all 0.2s ease;
              }
              
              .range-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
              }
              
              .range-slider::-webkit-slider-thumb:active {
                transform: scale(1.1);
                background: #667eea;
              }
              
              .range-slider::-moz-range-thumb {
                pointer-events: auto;
                width: 24px;
                height: 24px;
                background: white;
                border: 3px solid #667eea;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                transition: all 0.2s ease;
              }
              
              .range-slider::-moz-range-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
              }
              
              .range-slider::-moz-range-thumb:active {
                transform: scale(1.1);
                background: #667eea;
              }
            `}</style>

            {/* Bedrooms - Redesigned with Slider */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#475569', 
                marginBottom: '12px' 
              }}>
                <Bed size={18} /> Bedrooms
              </label>
              
              {/* Bedrooms Range Display */}
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                      Min
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {filters.bedroomsMin ? filters.bedroomsMin : 'Any'}
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', opacity: 0.7, padding: '0 12px' }}>
                    →
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                      Max
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {filters.bedroomsMax ? filters.bedroomsMax : 'Any'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Range Slider */}
              <div style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', height: '40px' }}>
                  {/* Slider Track */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    top: '17px',
                  }} />
                  
                  {/* Active Track */}
                  <div style={{
                    position: 'absolute',
                    height: '6px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '3px',
                    top: '17px',
                    left: `${(parseInt(filters.bedroomsMin || '0') / 10) * 100}%`,
                    right: `${100 - (parseInt(filters.bedroomsMax || '10') / 10) * 100}%`,
                  }} />

                  {/* Max Range Input - Placed First */}
                  <input
                    type="range"
                    className="range-slider range-max"
                    min="0"
                    max="10"
                    step="1"
                    value={filters.bedroomsMax || '10'}
                    onChange={(e) => {
                      const value = e.target.value;
                      const minVal = parseInt(filters.bedroomsMin || '0');
                      if (parseInt(value) >= minVal) {
                        updateFilter('bedroomsMax', value === '10' ? '' : value);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '40px',
                      background: 'transparent',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 4,
                      cursor: 'pointer',
                    }}
                  />

                  {/* Min Range Input - Placed Second */}
                  <input
                    type="range"
                    className="range-slider range-min"
                    min="0"
                    max="10"
                    step="1"
                    value={filters.bedroomsMin || '0'}
                    onChange={(e) => {
                      const value = e.target.value;
                      const maxVal = parseInt(filters.bedroomsMax || '10');
                      if (parseInt(value) <= maxVal) {
                        updateFilter('bedroomsMin', value === '0' ? '' : value);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '40px',
                      background: 'transparent',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 5,
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              {/* Expand/Collapse Button for Custom Range */}
              <button
                onClick={() => updateFilter('bedroomsExpanded', !filters.bedroomsExpanded)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: filters.bedroomsExpanded ? '#f0f4ff' : '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#667eea',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  marginBottom: filters.bedroomsExpanded ? '12px' : '0',
                }}
              >
                <span>Manual Entry</span>
                {filters.bedroomsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Custom Range Inputs - Collapsible */}
              {filters.bedroomsExpanded && (
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    animation: 'slideDown 0.3s ease-out',
                  }}
                >
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#64748b', 
                      marginBottom: '6px' 
                    }}>
                      Min
                    </label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.bedroomsMin} 
                      onChange={(e) => updateFilter('bedroomsMin', e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '16px 12px',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1e293b',
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#64748b', 
                      marginBottom: '6px' 
                    }}>
                      Max
                    </label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.bedroomsMax} 
                      onChange={(e) => updateFilter('bedroomsMax', e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '16px 12px',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1e293b',
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bathrooms - Redesigned with Slider */}
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#475569', 
                marginBottom: '12px' 
              }}>
                <Bath size={18} /> Bathrooms
              </label>
              
              {/* Bathrooms Range Display */}
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                      Min
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {filters.bathroomsMin ? filters.bathroomsMin : 'Any'}
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', opacity: 0.7, padding: '0 12px' }}>
                    →
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                      Max
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {filters.bathroomsMax ? filters.bathroomsMax : 'Any'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dual Range Slider */}
              <div style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', height: '40px' }}>
                  {/* Slider Track */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    top: '17px',
                  }} />
                  
                  {/* Active Track */}
                  <div style={{
                    position: 'absolute',
                    height: '6px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '3px',
                    top: '17px',
                    left: `${(parseInt(filters.bathroomsMin || '0') / 10) * 100}%`,
                    right: `${100 - (parseInt(filters.bathroomsMax || '10') / 10) * 100}%`,
                  }} />

                  {/* Max Range Input - Placed First */}
                  <input
                    type="range"
                    className="range-slider range-max"
                    min="0"
                    max="10"
                    step="1"
                    value={filters.bathroomsMax || '10'}
                    onChange={(e) => {
                      const value = e.target.value;
                      const minVal = parseInt(filters.bathroomsMin || '0');
                      if (parseInt(value) >= minVal) {
                        updateFilter('bathroomsMax', value === '10' ? '' : value);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '40px',
                      background: 'transparent',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 4,
                      cursor: 'pointer',
                    }}
                  />

                  {/* Min Range Input - Placed Second */}
                  <input
                    type="range"
                    className="range-slider range-min"
                    min="0"
                    max="10"
                    step="1"
                    value={filters.bathroomsMin || '0'}
                    onChange={(e) => {
                      const value = e.target.value;
                      const maxVal = parseInt(filters.bathroomsMax || '10');
                      if (parseInt(value) <= maxVal) {
                        updateFilter('bathroomsMin', value === '0' ? '' : value);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '40px',
                      background: 'transparent',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 5,
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              {/* Expand/Collapse Button for Custom Range */}
              <button
                onClick={() => updateFilter('bathroomsExpanded', !filters.bathroomsExpanded)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: filters.bathroomsExpanded ? '#f0f4ff' : '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#667eea',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  marginBottom: filters.bathroomsExpanded ? '12px' : '0',
                }}
              >
                <span>Manual Entry</span>
                {filters.bathroomsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Custom Range Inputs - Collapsible */}
              {filters.bathroomsExpanded && (
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    animation: 'slideDown 0.3s ease-out',
                  }}
                >
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#64748b', 
                      marginBottom: '6px' 
                    }}>
                      Min
                    </label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.bathroomsMin} 
                      onChange={(e) => updateFilter('bathroomsMin', e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '16px 12px',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1e293b',
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#64748b', 
                      marginBottom: '6px' 
                    }}>
                      Max
                    </label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.bathroomsMax} 
                      onChange={(e) => updateFilter('bathroomsMax', e.target.value)} 
                      style={{
                        width: '100%',
                        padding: '16px 12px',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1e293b',
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Square Footage */}
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    marginBottom: '12px' 
                  }}>
                    <Ruler size={18} /> Square Footage
                  </label>

                  {/* Dropdown Button */}
                  <button
                    onClick={() => {
                      setSqftDropdownOpen(!sqftDropdownOpen);
                    }}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: filters.sqftRange !== 'any'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'white',
                      color: filters.sqftRange !== 'any' ? 'white' : '#475569',
                      border: filters.sqftRange !== 'any' ? 'none' : '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: filters.sqftRange !== 'any'
                        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                        : sqftDropdownOpen ? '0 2px 8px rgba(0,0,0,0.08)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <span>{getSqftLabel()}</span>
                    <ChevronDown size={18} />
                  </button>

                  {/* Dropdown Menu */}
                  {sqftDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '8px',
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 100,
                      padding: '8px',
                      animation: 'slideDown 0.2s ease-out',
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}>
                      {sqftRanges.map(range => (
                        <button
                          key={range.value}
                          onClick={() => {
                            updateFilter('sqftRange', range.value);
                            setSqftDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: filters.sqftRange === range.value ? '#f0f4ff' : 'transparent',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: filters.sqftRange === range.value ? '#667eea' : '#475569',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (filters.sqftRange !== range.value) {
                              e.currentTarget.style.background = '#f8fafc';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (filters.sqftRange !== range.value) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <span>{range.label}</span>
                          {filters.sqftRange === range.value && <Check size={18} color="#667eea" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* House Style */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    marginBottom: '12px' 
                  }}>
                    <Building2 size={18} /> House Style
                    {filters.houseStyles.length > 0 && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                      }}>
                        {filters.houseStyles.length} selected
                      </span>
                    )}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {houseStyles.map(style => {
                      const isSelected = filters.houseStyles.includes(style);
                      return (
                        <button 
                          key={style} 
                          onClick={() => toggleArrayFilter('houseStyles', style)} 
                          style={{
                            padding: '12px 20px',
                            background: isSelected 
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                              : 'white',
                            color: isSelected ? 'white' : '#475569',
                            border: isSelected ? 'none' : '2px solid #e2e8f0',
                            borderRadius: '24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isSelected 
                              ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
                              : '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                            }
                          }}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lot Dimensions */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    marginBottom: '12px' 
                  }}>
                    <Ruler size={18} /> Lot Frontage
                  </label>
                  
                  {/* Display Card */}
                  <div style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: 'white',
                    }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                          Min
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700' }}>
                          {filters.lotFrontageMin ? `${filters.lotFrontageMin} ft` : 'Any'}
                        </div>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', opacity: 0.7, padding: '0 12px' }}>
                        →
                      </div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                          Max
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700' }}>
                          {filters.lotFrontageMax ? `${filters.lotFrontageMax} ft` : 'Any'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#64748b', 
                        marginBottom: '6px' 
                      }}>
                        Min
                      </label>
                      <input 
                        type="number" 
                        placeholder="Min ft" 
                        value={filters.lotFrontageMin} 
                        onChange={(e) => updateFilter('lotFrontageMin', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '16px 12px',
                          background: 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1e293b',
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#64748b', 
                        marginBottom: '6px' 
                      }}>
                        Max
                      </label>
                      <input 
                        type="number" 
                        placeholder="Max ft" 
                        value={filters.lotFrontageMax} 
                        onChange={(e) => updateFilter('lotFrontageMax', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '16px 12px',
                          background: 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1e293b',
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Maintenance Fee */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    marginBottom: '12px' 
                  }}>
                    <Wrench size={18} /> Max Maintenance Fee
                  </label>
                  
                  {/* Display Card */}
                  <div style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}>
                    <div style={{
                      textAlign: 'center',
                      color: 'white',
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                        Max Monthly Fee
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {filters.maintenanceFeeMax ? `$${parseInt(filters.maintenanceFeeMax).toLocaleString()}` : 'Any'}
                      </div>
                    </div>
                  </div>

                  <input 
                    type="number" 
                    placeholder="Max monthly fee" 
                    value={filters.maintenanceFeeMax} 
                    onChange={(e) => updateFilter('maintenanceFeeMax', e.target.value)} 
                    style={{
                      width: '100%',
                      padding: '16px 12px',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1e293b',
                    }} 
                  />
                </div>

                {/* Days on Market */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    marginBottom: '12px' 
                  }}>
                    <Clock size={18} /> Max Days on Market
                  </label>
                  
                  {/* Display Card */}
                  <div style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}>
                    <div style={{
                      textAlign: 'center',
                      color: 'white',
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                        Max Days
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        {filters.daysOnMarket ? `${filters.daysOnMarket} days` : 'Any'}
                      </div>
                    </div>
                  </div>

                  <input 
                    type="number" 
                    placeholder="Days" 
                    value={filters.daysOnMarket} 
                    onChange={(e) => updateFilter('daysOnMarket', e.target.value)} 
                    style={{
                      width: '100%',
                      padding: '16px 12px',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1e293b',
                    }} 
                  />
                </div>

                {/* Parking */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    marginBottom: '12px' 
                  }}>
                    <Car size={18} /> Parking
                  </label>
                  
                  {/* Display Card */}
                  <div style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: 'white',
                    }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                          Garage
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700' }}>
                          {filters.garageParking ? `${filters.garageParking}+` : 'Any'}
                        </div>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', opacity: 0.7, padding: '0 12px' }}>
                        |
                      </div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9, marginBottom: '4px' }}>
                          Total
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700' }}>
                          {filters.totalParking ? `${filters.totalParking}+` : 'Any'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#64748b', 
                        marginBottom: '6px' 
                      }}>
                        Garage Min
                      </label>
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={filters.garageParking} 
                        onChange={(e) => updateFilter('garageParking', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '16px 12px',
                          background: 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1e293b',
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#64748b', 
                        marginBottom: '6px' 
                      }}>
                        Total Min
                      </label>
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={filters.totalParking} 
                        onChange={(e) => updateFilter('totalParking', e.target.value)} 
                        style={{
                          width: '100%',
                          padding: '16px 12px',
                          background: 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1e293b',
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Basement Features */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    marginBottom: '12px' 
                  }}>
                    <DoorOpen size={18} /> Basement Features
                    {filters.basementFeatures.length > 0 && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                      }}>
                        {filters.basementFeatures.length} selected
                      </span>
                    )}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {basementFeatures.map(feature => {
                      const isSelected = filters.basementFeatures.includes(feature);
                      return (
                        <button 
                          key={feature} 
                          onClick={() => toggleArrayFilter('basementFeatures', feature)} 
                          style={{
                            padding: '12px 20px',
                            background: isSelected 
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                              : 'white',
                            color: isSelected ? 'white' : '#475569',
                            border: isSelected ? 'none' : '2px solid #e2e8f0',
                            borderRadius: '24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isSelected 
                              ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
                              : '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                            }
                          }}
                        >
                          {feature}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggle Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => updateFilter('basementKitchen', !filters.basementKitchen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: filters.basementKitchen
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'white',
                      color: filters.basementKitchen ? 'white' : '#475569',
                      border: filters.basementKitchen ? 'none' : '2px solid #e2e8f0',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: filters.basementKitchen
                        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wrench size={18} /> Basement Kitchen
                    </span>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      background: filters.basementKitchen ? 'rgba(255, 255, 255, 0.3)' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {filters.basementKitchen && <Check size={16} color="white" />}
                    </div>
                  </button>
                  <button
                    onClick={() => updateFilter('openHouse', !filters.openHouse)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: filters.openHouse
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'white',
                      color: filters.openHouse ? 'white' : '#475569',
                      border: filters.openHouse ? 'none' : '2px solid #e2e8f0',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: filters.openHouse
                        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DoorOpen size={18} /> Open House Only
                    </span>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      background: filters.openHouse ? 'rgba(255, 255, 255, 0.3)' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {filters.openHouse && <Check size={16} color="white" />}
                    </div>
                  </button>
                </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #e2e8f0',
          background: 'white',
          display: 'flex',
          gap: '12px',
        }}>
          <button onClick={onClose} style={{
            flex: 1,
            padding: '16px',
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '700',
            color: '#64748b',
            cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleApply} style={{
            flex: 2,
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
          }}>
            Apply Filters
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
