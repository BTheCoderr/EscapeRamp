'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Clock, 
  User, 
  FileText, 
  Edit, 
  Trash2, 
  Plus, 
  Eye,
  Filter,
  Search,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  category: 'migration' | 'file' | 'analysis' | 'user' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface AuditFilter {
  category: string;
  severity: string;
  dateRange: string;
  user: string;
  search: string;
}

export function AuditTrail() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [filters, setFilters] = useState<AuditFilter>({
    category: 'all',
    severity: 'all',
    dateRange: '7d',
    user: 'all',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const { currentMigration } = useAppStore();

  useEffect(() => {
    fetchAuditTrail();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [auditEvents, filters]);

  const fetchAuditTrail = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/audit-trail');
      if (response.ok) {
        const data = await response.json();
        setAuditEvents(data.events);
      } else {
        // Use mock data for demo
        setMockAuditData();
      }
    } catch (error) {
      console.error('Failed to fetch audit trail:', error);
      setMockAuditData();
    } finally {
      setLoading(false);
    }
  };

  const setMockAuditData = () => {
    const mockEvents: AuditEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: 'John Smith',
        action: 'Migration Started',
        entity: 'Migration',
        entityId: 'mig-001',
        details: 'Started migration from QuickBooks Desktop Pro to QuickBooks Online',
        category: 'migration',
        severity: 'medium',
        metadata: {
          sourceSoftware: 'QuickBooks Desktop Pro',
          targetSoftware: 'QuickBooks Online',
          urgency: 'high'
        }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: 'System',
        action: 'File Uploaded',
        entity: 'File',
        entityId: 'file-001',
        details: 'Uploaded company.qbb (2.4 MB)',
        category: 'file',
        severity: 'low',
        metadata: {
          filename: 'company.qbb',
          fileSize: 2516582,
          fileType: '.qbb'
        }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: 'AI Assistant',
        action: 'Analysis Completed',
        entity: 'Analysis',
        entityId: 'analysis-001',
        details: 'AI analysis of intake form completed successfully',
        category: 'analysis',
        severity: 'low',
        metadata: {
          analysisType: 'intake_summary',
          confidence: 0.94,
          processingTime: 2.3
        }
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user: 'Sarah Johnson',
        action: 'Configuration Updated',
        entity: 'Migration',
        entityId: 'mig-001',
        details: 'Updated data preservation requirements',
        category: 'migration',
        severity: 'medium',
        metadata: {
          changes: ['Added custom fields', 'Updated chart of accounts'],
          previousValue: 'Basic requirements',
          newValue: 'Enhanced requirements'
        }
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        user: 'System',
        action: 'Error Detected',
        entity: 'Migration',
        entityId: 'mig-001',
        details: 'Failed to process inventory items due to data corruption',
        category: 'system',
        severity: 'high',
        metadata: {
          errorCode: 'INV_001',
          affectedRecords: 45,
          suggestedAction: 'Review and clean inventory data'
        }
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        user: 'John Smith',
        action: 'Migration Completed',
        entity: 'Migration',
        entityId: 'mig-001',
        details: 'Successfully completed migration with 98% data accuracy',
        category: 'migration',
        severity: 'low',
        metadata: {
          totalRecords: 1250,
          successfulRecords: 1225,
          failedRecords: 25,
          accuracy: 0.98
        }
      }
    ];
    setAuditEvents(mockEvents);
  };

  const applyFilters = () => {
    let filtered = [...auditEvents];

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(event => event.severity === filters.severity);
    }

    // Date range filter
    const now = new Date();
    const dateRanges = {
      '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    };

    if (filters.dateRange !== 'all' && dateRanges[filters.dateRange as keyof typeof dateRanges]) {
      const cutoffDate = dateRanges[filters.dateRange as keyof typeof dateRanges];
      filtered = filtered.filter(event => new Date(event.timestamp) >= cutoffDate);
    }

    // User filter
    if (filters.user !== 'all') {
      filtered = filtered.filter(event => event.user === filters.user);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event =>
        event.action.toLowerCase().includes(searchLower) ||
        event.details.toLowerCase().includes(searchLower) ||
        event.entity.toLowerCase().includes(searchLower) ||
        event.user.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'migration':
        return <FileText className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'analysis':
        return <Eye className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'system':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Started')) return <Plus className="w-4 h-4" />;
    if (action.includes('Updated')) return <Edit className="w-4 h-4" />;
    if (action.includes('Completed')) return <CheckCircle className="w-4 h-4" />;
    if (action.includes('Error') || action.includes('Failed')) return <XCircle className="w-4 h-4" />;
    if (action.includes('Deleted')) return <Trash2 className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600">Complete history of all migration activities and changes</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="migration">Migration</option>
              <option value="file">File</option>
              <option value="analysis">Analysis</option>
              <option value="user">User</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <select
              value={filters.user}
              onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="John Smith">John Smith</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="AI Assistant">AI Assistant</option>
              <option value="System">System</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audit Events */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Event Icon */}
                <div className="flex items-center space-x-2">
                  {getActionIcon(event.action)}
                  {getCategoryIcon(event.category)}
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{event.action}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{event.details}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{event.user}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{event.entity}: {event.entityId}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.timestamp)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                View Details
              </button>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Action</h3>
                  <p className="text-gray-600">{selectedEvent.action}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Details</h3>
                  <p className="text-gray-600">{selectedEvent.details}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">User</h3>
                    <p className="text-gray-600">{selectedEvent.user}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Timestamp</h3>
                    <p className="text-gray-600">{formatDate(selectedEvent.timestamp)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Entity</h3>
                    <p className="text-gray-600">{selectedEvent.entity}: {selectedEvent.entityId}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Severity</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(selectedEvent.severity)}`}>
                      {selectedEvent.severity}
                    </span>
                  </div>
                </div>

                {selectedEvent.metadata && (
                  <div>
                    <h3 className="font-medium text-gray-900">Additional Data</h3>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 