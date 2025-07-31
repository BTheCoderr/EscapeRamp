'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Ticket, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Phone,
  Video,
  Send,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'migration' | 'technical' | 'billing' | 'general';
  created_at: string;
  updated_at: string;
  user_email: string;
  assigned_to?: string;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  ticket_id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface MigrationStatus {
  id: string;
  status: 'not-started' | 'in-progress' | 'review' | 'testing' | 'completed';
  progress: number;
  current_step: string;
  estimated_completion: string;
  last_updated: string;
}

export function SupportPortal() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - replace with real API calls
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      title: 'QuickBooks data export issue',
      description: 'Having trouble exporting customer data from QuickBooks Desktop Pro',
      status: 'open',
      priority: 'high',
      category: 'migration',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T14:20:00Z',
      user_email: 'user@example.com',
      messages: [
        {
          id: '1',
          ticket_id: '1',
          sender: 'user',
          message: 'I\'m trying to export my customer list but getting an error. Can you help?',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          ticket_id: '1',
          sender: 'support',
          message: 'Hi! I can help you with that. What specific error message are you seeing?',
          timestamp: '2024-01-15T11:15:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Migration timeline question',
      description: 'Need clarification on estimated completion date',
      status: 'in-progress',
      priority: 'medium',
      category: 'migration',
      created_at: '2024-01-14T09:00:00Z',
      updated_at: '2024-01-15T16:45:00Z',
      user_email: 'user@example.com',
      assigned_to: 'Thomas',
      messages: [
        {
          id: '3',
          ticket_id: '2',
          sender: 'user',
          message: 'When can I expect my migration to be complete?',
          timestamp: '2024-01-14T09:00:00Z'
        }
      ]
    }
  ]);

  const [migrationStatus] = useState<MigrationStatus>({
    id: '1',
    status: 'in-progress',
    progress: 65,
    current_step: 'Data validation and cleanup',
    estimated_completion: '2024-01-25',
    last_updated: '2024-01-15T16:30:00Z'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;

    const message: SupportMessage = {
      id: Date.now().toString(),
      ticket_id: selectedTicket.id,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { ...ticket, messages: [...ticket.messages, message] }
        : ticket
    ));

    setNewMessage('');
  };

  const createNewTicket = () => {
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      title: 'New Support Request',
      description: 'Please describe your issue here...',
      status: 'open',
      priority: 'medium',
      category: 'general',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_email: 'user@example.com',
      messages: []
    };

    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setActiveTab('tickets');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Portal</h1>
          <p className="text-gray-600">Get help with your migration and technical support</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('tel:+1-800-ESCAPE', '_blank')}>
            <Phone className="w-4 h-4 mr-2" />
            Call Support
          </Button>
          <Button variant="outline" onClick={() => window.open('https://meet.google.com/escape-ramp', '_blank')}>
            <Video className="w-4 h-4 mr-2" />
            Video Call
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Help Tickets
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Live Chat
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Migration Status
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <Button onClick={createNewTicket} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Tickets ({filteredTickets.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm truncate">{ticket.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(ticket.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Ticket Details */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedTicket.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Created {new Date(selectedTicket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(selectedTicket.status)}>
                          {selectedTicket.status}
                        </Badge>
                        <Badge className={getPriorityColor(selectedTicket.priority)}>
                          {selectedTicket.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Messages</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedTicket.messages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs p-3 rounded-lg ${
                                message.sender === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-gray-500">
                      <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a ticket to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Chat Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Start a Live Chat</h3>
                <p className="text-gray-600 mb-6">
                  Connect with our support team in real-time for immediate assistance
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.open('https://chat.escape-ramp.com', '_blank')}>
                    Start Chat
                  </Button>
                  <Button variant="outline" onClick={() => window.open('mailto:support@escape-ramp.com')}>
                    Email Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Migration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span className="font-medium">{migrationStatus.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(migrationStatus.status)}>
                        {migrationStatus.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Step:</span>
                      <span className="font-medium">{migrationStatus.current_step}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Completion:</span>
                      <span className="font-medium">{migrationStatus.estimated_completion}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Progress Bar</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${migrationStatus.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Last updated: {new Date(migrationStatus.last_updated).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Migration Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Initial Assessment</p>
                      <p className="text-sm text-gray-600">Completed on Jan 10, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-gray-600">Completed on Jan 12, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">Data Validation & Cleanup</p>
                      <p className="text-sm text-gray-600">In progress - 65% complete</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-500">Migration Testing</p>
                      <p className="text-sm text-gray-500">Scheduled for Jan 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-500">Final Migration</p>
                      <p className="text-sm text-gray-500">Scheduled for Jan 25, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Migration Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Step-by-step guide to prepare your QuickBooks data for migration
                </p>
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Watch our video tutorials for common migration tasks
                </p>
                <Button variant="outline" className="w-full">
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Frequently asked questions and troubleshooting tips
                </p>
                <Button variant="outline" className="w-full">
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 