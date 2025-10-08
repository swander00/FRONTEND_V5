'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Search, MapPin, Home, DollarSign, Bed, Bath, ChevronDown, ChevronUp, Calendar, Building2, Ruler, Car, Wrench, Clock, DoorOpen, Check } from 'lucide-react';
import { useFilters } from './Search';

const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Semi-Detached', 'Detached', 'Duplex', 'Commercial', 'Land'];
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

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFiltersModal({ isOpen, onClose }: MobileFiltersModalProps) {
  const { filters: contextFilters, updateFilter: updateContextFilter, clearAllFilters: clearContextFilters } = useFilters();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  
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
    bathroomsMin: contextFilters.bathrooms?.min?.toString() || '',
    bathroomsMax: contextFilters.bathrooms?.max?.toString() || '',
    // Advanced
    propertyClass: ['Freehold', 'Condo'] as string[],
    sqftMin: '',
    sqftMax: '',
    houseStyles: [] as string[],
    lotFrontageMin: '',
    lotFrontageMax: '',
    lotDepthMin: '',
    lotDepthMax: '',
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
      bathroomsMin: '',
      bathroomsMax: '',
      propertyClass: ['Freehold', 'Condo'] as string[],
      sqftMin: '',
      sqftMax: '',
      houseStyles: [] as string[],
      lotFrontageMin: '',
      lotFrontageMax: '',
      lotDepthMin: '',
      lotDepthMax: '',
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
          {/* PRIMARY FILTERS */}
          <div style={{
            padding: '12px',
            marginBottom: '20px',
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: '700',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>Primary Filters</h3>

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

            {/* Property Type - Enhanced */}
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
                <Home size={18} /> Property Type
                {filters.propertyTypes.length > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'white',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                  }}>
                    {filters.propertyTypes.length} selected
                  </span>
                )}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {propertyTypes.map(type => {
                  const isSelected = filters.propertyTypes.includes(type);
                  return (
                    <button 
                      key={type} 
                      onClick={() => toggleArrayFilter('propertyTypes', type)} 
                      style={{
                        padding: '14px 8px',
                        background: isSelected 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          : 'white',
                        color: isSelected ? 'white' : '#475569',
                        border: isSelected ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected 
                          ? '0 4px 16px rgba(102, 126, 234, 0.4)' 
                          : '0 2px 6px rgba(0, 0, 0, 0.04)',
                        transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                        textAlign: 'center',
                        minHeight: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range - Enhanced with Presets */}
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
              
              {/* Quick Presets */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px', 
                marginBottom: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                {(filters.transactionStatus === 'lease' || filters.transactionStatus === 'leased' ? [
                  { label: 'Under $2K', min: '', max: '2000' },
                  { label: '$2K-$3K', min: '2000', max: '3000' },
                  { label: '$3K-$4K', min: '3000', max: '4000' },
                  { label: '$4K+', min: '4000', max: '' },
                ] : [
                  { label: 'Under $500K', min: '', max: '500000' },
                  { label: '$500K-$1M', min: '500000', max: '1000000' },
                  { label: '$1M-$2M', min: '1000000', max: '2000000' },
                  { label: '$2M+', min: '2000000', max: '' },
                ]).map(preset => {
                  const isActive = filters.priceMin === preset.min && filters.priceMax === preset.max;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        updateFilter('priceMin', preset.min);
                        updateFilter('priceMax', preset.max);
                      }}
                      style={{
                        padding: '10px 16px',
                        background: isActive ? '#667eea' : 'white',
                        color: isActive ? 'white' : '#64748b',
                        border: isActive ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isActive ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none',
                      }}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Range Inputs */}
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
            </div>

            {/* Bedrooms - Enhanced with Quick Select */}
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
              
              {/* Quick Select Chips */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px', 
                marginBottom: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                {['Any', '1+', '2+', '3+', '4+', '5+'].map(option => {
                  const minVal = option === 'Any' ? '' : option.replace('+', '');
                  const isActive = (option === 'Any' && !filters.bedroomsMin) || 
                                  (filters.bedroomsMin === minVal && !filters.bedroomsMax);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        if (option === 'Any') {
                          updateFilter('bedroomsMin', '');
                          updateFilter('bedroomsMax', '');
                        } else {
                          updateFilter('bedroomsMin', minVal);
                          updateFilter('bedroomsMax', '');
                        }
                      }}
                      style={{
                        padding: '12px 20px',
                        background: isActive ? '#667eea' : 'white',
                        color: isActive ? 'white' : '#64748b',
                        border: isActive ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isActive ? '0 2px 10px rgba(102, 126, 234, 0.3)' : 'none',
                        minWidth: '60px',
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Custom Range */}
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
            </div>

            {/* Bathrooms - Enhanced with Quick Select */}
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
              
              {/* Quick Select Chips */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px', 
                marginBottom: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '12px',
              }}>
                {['Any', '1+', '2+', '3+', '4+'].map(option => {
                  const minVal = option === 'Any' ? '' : option.replace('+', '');
                  const isActive = (option === 'Any' && !filters.bathroomsMin) || 
                                  (filters.bathroomsMin === minVal && !filters.bathroomsMax);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        if (option === 'Any') {
                          updateFilter('bathroomsMin', '');
                          updateFilter('bathroomsMax', '');
                        } else {
                          updateFilter('bathroomsMin', minVal);
                          updateFilter('bathroomsMax', '');
                        }
                      }}
                      style={{
                        padding: '12px 20px',
                        background: isActive ? '#667eea' : 'white',
                        color: isActive ? 'white' : '#64748b',
                        border: isActive ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isActive ? '0 2px 10px rgba(102, 126, 234, 0.3)' : 'none',
                        minWidth: '60px',
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Custom Range */}
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
            </div>
          </div>

          {/* ADVANCED FILTERS */}
          <div style={{
            padding: '24px',
          }}>
            <button onClick={() => setAdvancedOpen(!advancedOpen)} style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              marginBottom: advancedOpen ? '20px' : '0',
            }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Advanced Filters
              </span>
              {advancedOpen ? <ChevronUp size={20} color="#667eea" /> : <ChevronDown size={20} color="#667eea" />}
            </button>

            {advancedOpen && (
              <div style={{ animation: 'slideDown 0.3s ease-out' }}>
                {/* Square Footage */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    <Ruler size={16} /> Square Footage
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input type="number" placeholder="Min sq ft" value={filters.sqftMin} onChange={(e) => updateFilter('sqftMin', e.target.value)} style={{
                      padding: '14px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }} />
                    <input type="number" placeholder="Max sq ft" value={filters.sqftMax} onChange={(e) => updateFilter('sqftMax', e.target.value)} style={{
                      padding: '14px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }} />
                  </div>
                </div>

                {/* House Style */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    <Building2 size={16} /> House Style
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {houseStyles.map(style => (
                      <button key={style} onClick={() => toggleArrayFilter('houseStyles', style)} style={{
                        padding: '10px 16px',
                        background: filters.houseStyles.includes(style) ? '#667eea' : '#f8fafc',
                        color: filters.houseStyles.includes(style) ? 'white' : '#64748b',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lot Dimensions */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    Lot Frontage
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input type="number" placeholder="Min ft" value={filters.lotFrontageMin} onChange={(e) => updateFilter('lotFrontageMin', e.target.value)} style={{
                      padding: '14px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }} />
                    <input type="number" placeholder="Max ft" value={filters.lotFrontageMax} onChange={(e) => updateFilter('lotFrontageMax', e.target.value)} style={{
                      padding: '14px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }} />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    Lot Depth
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input type="number" placeholder="Min ft" value={filters.lotDepthMin} onChange={(e) => updateFilter('lotDepthMin', e.target.value)} style={{
                      padding: '14px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }} />
                    <input type="number" placeholder="Max ft" value={filters.lotDepthMax} onChange={(e) => updateFilter('lotDepthMax', e.target.value)} style={{
                      padding: '14px',
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '15px',
                    }} />
                  </div>
                </div>

                {/* Maintenance Fee */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    <Wrench size={16} /> Max Maintenance Fee
                  </label>
                  <input type="number" placeholder="Max monthly fee" value={filters.maintenanceFeeMax} onChange={(e) => updateFilter('maintenanceFeeMax', e.target.value)} style={{
                    width: '100%',
                    padding: '14px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                  }} />
                </div>

                {/* Days on Market */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    <Clock size={16} /> Max Days on Market
                  </label>
                  <input type="number" placeholder="Days" value={filters.daysOnMarket} onChange={(e) => updateFilter('daysOnMarket', e.target.value)} style={{
                    width: '100%',
                    padding: '14px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                  }} />
                </div>

                {/* Parking */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    <Car size={16} /> Parking
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Garage</label>
                      <input type="number" placeholder="Min" value={filters.garageParking} onChange={(e) => updateFilter('garageParking', e.target.value)} style={{
                        width: '100%',
                        padding: '14px',
                        background: '#f8fafc',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                      }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Total</label>
                      <input type="number" placeholder="Min" value={filters.totalParking} onChange={(e) => updateFilter('totalParking', e.target.value)} style={{
                        width: '100%',
                        padding: '14px',
                        background: '#f8fafc',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '15px',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Basement Features */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '10px' }}>
                    Basement Features
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {basementFeatures.map(feature => (
                      <button key={feature} onClick={() => toggleArrayFilter('basementFeatures', feature)} style={{
                        padding: '10px 16px',
                        background: filters.basementFeatures.includes(feature) ? '#667eea' : '#f8fafc',
                        color: filters.basementFeatures.includes(feature) ? 'white' : '#64748b',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}>
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '12px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Basement Kitchen</span>
                    <input type="checkbox" checked={filters.basementKitchen} onChange={(e) => updateFilter('basementKitchen', e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '12px', cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                      <DoorOpen size={16} /> Open House Only
                    </span>
                    <input type="checkbox" checked={filters.openHouse} onChange={(e) => updateFilter('openHouse', e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  </label>
                </div>
              </div>
            )}
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
