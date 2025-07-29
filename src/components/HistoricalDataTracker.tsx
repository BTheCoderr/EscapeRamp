'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  User, 
  ArrowUpDown,
  Download,
  Eye,
  History,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  vendor: string;
  status: 'completed' | 'pending' | 'cancelled';
  lastModified: string;
  modifiedBy: string;
  version: number;
  changes: Change[];
}

interface Change {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
  user: string;
}

interface AuditEvent {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  user: string;
  details: string;
  ipAddress: string;
}

export function HistoricalDataTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewMode, setViewMode] = useState<'transactions' | 'audit'>('transactions');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: '2024-01-15',
        description: 'Office Supplies Purchase',
        amount: 1250.00,
        type: 'expense',
        category: 'Office Supplies',
        vendor: 'ABC Supplies Co.',
        status: 'completed',
        lastModified: '2024-01-15T10:30:00Z',
        modifiedBy: 'John Doe',
        version: 3,
        changes: [
          {
            id: '1',
            field: 'amount',
            oldValue: '1200.00',
            newValue: '1250.00',
            timestamp: '2024-01-15T10:30:00Z',
            user: 'John Doe'
          },
          {
            id: '2',
            field: 'vendor',
            oldValue: 'ABC Supplies',
            newValue: 'ABC Supplies Co.',
            timestamp: '2024-01-15T09:15:00Z',
            user: 'Jane Smith'
          }
        ]
      },
      {
        id: '2',
        date: '2024-01-14',
        description: 'Client Payment - Project Alpha',
        amount: 5000.00,
        type: 'income',
        category: 'Consulting',
        vendor: 'TechCorp Inc.',
        status: 'completed',
        lastModified: '2024-01-14T16:45:00Z',
        modifiedBy: 'Jane Smith',
        version: 1,
        changes: []
      },
      {
        id: '3',
        date: '2024-01-13',
        description: 'Software License Renewal',
        amount: 299.99,
        type: 'expense',
        category: 'Software',
        vendor: 'Adobe Systems',
        status: 'pending',
        lastModified: '2024-01-13T14:20:00Z',
        modifiedBy: 'John Doe',
        version: 2,
        changes: [
          {
            id: '3',
            field: 'status',
            oldValue: 'completed',
            newValue: 'pending',
            timestamp: '2024-01-13T14:20:00Z',
            user: 'John Doe'
          }
        ]
      }
    ];

    const mockAuditEvents: AuditEvent[] = [
      {
        id: '1',
        action: 'UPDATE',
        entity: 'Transaction',
        entityId: '1',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'John Doe',
        details: 'Updated transaction amount from $1,200.00 to $1,250.00',
        ipAddress: '192.168.1.100'
      },
      {
        id: '2',
        action: 'CREATE',
        entity: 'Transaction',
        entityId: '2',
        timestamp: '2024-01-14T16:45:00Z',
        user: 'Jane Smith',
        details: 'Created new income transaction for $5,000.00',
        ipAddress: '192.168.1.101'
      },
      {
        id: '3',
        action: 'DELETE',
        entity: 'Transaction',
        entityId: '4',
        timestamp: '2024-01-13T11:15:00Z',
        user: 'Admin User',
        details: 'Deleted duplicate transaction',
        ipAddress: '192.168.1.102'
      }
    ];

    setTransactions(mockTransactions);
    setAuditEvents(mockAuditEvents);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && transaction.date === new Date().toISOString().split('T')[0]) ||
                       (dateFilter === 'week' && new Date(transaction.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === 'month' && new Date(transaction.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'expense':
        return <DollarSign className="w-4 h-4 text-red-500" />;
      case 'transfer':
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Description,Amount,Type,Category,Vendor,Status,Last Modified,Modified By\n" +
      filteredTransactions.map(t => 
        `${t.date},"${t.description}",${t.amount},${t.type},${t.category},"${t.vendor}",${t.status},${t.lastModified},${t.modifiedBy}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historical Data Tracker</h1>
          <p className="text-gray-600 mt-2">
            Complete audit trail and version history for all your financial transactions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <History className="w-4 h-4 mr-2" />
            View Full Audit Log
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setDateFilter('all');
              setTypeFilter('all');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'transactions' | 'audit')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Transaction List */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transactions found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <h3 className="font-medium">{transaction.description}</h3>
                          <p className="text-sm text-gray-600">
                            {transaction.vendor} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        {transaction.changes.length > 0 && (
                          <Badge variant="outline">
                            v{transaction.version} ({transaction.changes.length} changes)
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Modified by {transaction.modifiedBy} on {formatDate(transaction.lastModified)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          {/* Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete log of all system activities and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={event.action === 'CREATE' ? 'default' : event.action === 'UPDATE' ? 'secondary' : 'destructive'}>
                          {event.action}
                        </Badge>
                        <div>
                          <h3 className="font-medium">{event.entity} #{event.entityId}</h3>
                          <p className="text-sm text-gray-600">{event.details}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{formatDate(event.timestamp)}</p>
                        <p>by {event.user}</p>
                        <p className="text-xs">{event.ipAddress}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <Button variant="ghost" onClick={() => setSelectedTransaction(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p>{selectedTransaction.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className={`font-medium ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ${selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor</label>
                  <p>{selectedTransaction.vendor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p>{selectedTransaction.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Version</label>
                  <p>v{selectedTransaction.version}</p>
                </div>
              </div>

              {selectedTransaction.changes.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Change History</h3>
                  <div className="space-y-2">
                    {selectedTransaction.changes.map((change) => (
                      <div key={change.id} className="border rounded p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{change.field}</span>
                          <span className="text-sm text-gray-500">{formatDate(change.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-red-600 line-through">{change.oldValue}</span>
                          <span>→</span>
                          <span className="text-green-600">{change.newValue}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">by {change.user}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 