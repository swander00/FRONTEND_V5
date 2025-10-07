'use client';

import { useState, useMemo } from 'react';
import { Sparkles, FileText, Bot } from 'lucide-react';
import { Property } from '@/types';

interface DescriptionCardProps {
  property: Property;
}

type TabType = 'about' | 'ai';

export default function DescriptionCard({ property }: DescriptionCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  // Memoize description to avoid recalculation
  const description = useMemo(() => {
    return property.Description?.trim() || null;
  }, [property.Description]);

  const hasDescription = description !== null;

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
      {/* Header Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Property Description
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Detailed property overview and features
            </p>
          </div>
        </div>
        <div className="w-20 h-px bg-gradient-to-r from-blue-400 to-indigo-500" />
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pb-4">
        <div className="flex bg-gradient-to-r from-slate-100/80 to-slate-50/80 rounded-xl p-1.5 border border-slate-200/60">
          <TabButton
            active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
            icon={FileText}
            label="About This Property"
            colorScheme="blue"
          />
          <TabButton
            active={activeTab === 'ai'}
            onClick={() => setActiveTab('ai')}
            icon={Bot}
            label="AI Summary"
            colorScheme="purple"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6">
        {activeTab === 'about' ? (
          <DescriptionContent 
            description={description} 
            hasDescription={hasDescription} 
          />
        ) : (
          <AIContent 
            description={description} 
            hasDescription={hasDescription} 
          />
        )}
      </div>
    </div>
  );
}

// Extracted Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: typeof FileText;
  label: string;
  colorScheme: 'blue' | 'purple';
}

function TabButton({ active, onClick, icon: Icon, label, colorScheme }: TabButtonProps) {
  const styles = {
    blue: {
      active: 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md border border-blue-400/30',
      inactive: 'text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-200/60'
    },
    purple: {
      active: 'text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-md border border-purple-400/30',
      inactive: 'text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border border-transparent hover:border-purple-200/60'
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-lg ${
        active ? styles[colorScheme].active : styles[colorScheme].inactive
      }`}
      aria-pressed={active}
    >
      <div className="flex items-center justify-center gap-3">
        <Icon className={`h-4 w-4 transition-colors duration-300 ${
          active ? 'text-white' : 'text-slate-500'
        }`} />
        <span>{label}</span>
      </div>
    </button>
  );
}

// Extracted Description Content
interface ContentProps {
  description: string | null;
  hasDescription: boolean;
}

function DescriptionContent({ description, hasDescription }: ContentProps) {
  return (
    <div className="pl-5 border-l-2 border-slate-200">
      {hasDescription ? (
        <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
          {description}
        </p>
      ) : (
        <p className="text-slate-500 leading-relaxed text-sm italic">
          No description available for this property.
        </p>
      )}
    </div>
  );
}

// Extracted AI Content
function AIContent({ description, hasDescription }: ContentProps) {
  // TODO: Replace with actual AI-generated summary when API is ready
  // For now, show the same description with a disclaimer
  
  return (
    <div className="space-y-4">
      <div className="pl-5 border-l-2 border-slate-200">
        {hasDescription ? (
          <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
            {description}
          </p>
        ) : (
          <p className="text-slate-500 leading-relaxed text-sm italic">
            No description available for this property.
          </p>
        )}
      </div>
      
      {/* AI Insights Disclaimer */}
      <div className="pl-5 border-l-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-r-lg py-3">
        <div className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-semibold text-purple-800 mb-1">
              AI Summary Coming Soon
            </h5>
            <p className="text-sm text-purple-700 leading-relaxed">
              AI-powered property insights are currently in development. For now, the original property description is displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}