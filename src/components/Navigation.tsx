'use client';

// import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  Settings, 
  Calculator,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  // const { currentMigration } = useAppStore();

  const tabs = [
    {
      id: 'intake',
      label: 'Intake Form',
      icon: FileText,
      description: 'Submit your migration requirements',
    },
    {
      id: 'upload',
      label: 'File Upload',
      icon: Upload,
      description: 'Upload your QuickBooks files',
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      description: 'Track migration status',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Advanced reporting & insights',
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: Clock,
      description: 'Complete activity history',
    },
    {
      id: 'cost',
      label: 'Cost Analysis',
      icon: Calculator,
      description: 'Compare pricing & ROI',
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Escape Ramp
              </h1>
              <p className="text-xs text-gray-500">QuickBooks Migration Tool</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${isActive
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Current Migration Status */}
          {currentMigration && (
            <div className="flex items-center">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Active Migration
                </p>
                <p className="text-xs text-gray-500">
                  {currentMigration.source_software} → {currentMigration.target_software}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 