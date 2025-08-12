'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock, User, MessageSquare, Archive, Trash2, Reply, Copy } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function ContactManagementClient() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load real messages from the database
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Error loading messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      // Update in the database
      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        // Update local state after successful database update
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, status: status as ContactMessage['status'], updated_at: new Date().toISOString() } : msg
        ));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: status as ContactMessage['status'], updated_at: new Date().toISOString() });
        }
      } else {
        console.error('Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        // Delete from the database
        const response = await fetch(`/api/admin/contact?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Update local state after successful database deletion
          setMessages(messages.filter(msg => msg.id !== id));
          if (selectedMessage?.id === id) {
            setSelectedMessage(null);
          }
        } else {
          console.error('Failed to delete message');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-700';
      case 'read': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
      case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200 border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Mail className="w-4 h-4" />;
      case 'read': return <Clock className="w-4 h-4" />;
      case 'replied': return <Reply className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Contact Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and respond to contact form submissions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-64"
              />
              <MessageSquare className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {messages.filter(m => m.status === 'unread').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {messages.filter(m => m.status === 'read').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Reply className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900/30 rounded-lg flex items-center justify-center">
                <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {messages.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Messages ({filteredMessages.length})
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>No messages found</p>
                  {searchTerm && <p className="text-sm mt-1">Try adjusting your search or filters</p>}
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {message.name}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(message.status)}`}>
                        {getStatusIcon(message.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            {selectedMessage ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{selectedMessage.email}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4" />
                      Received: {new Date(selectedMessage.created_at).toLocaleString()}
                      {selectedMessage.updated_at !== selectedMessage.created_at && (
                        <span className="text-gray-400">• Updated: {new Date(selectedMessage.updated_at).toLocaleString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Message Content
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Reply className="w-4 h-4" />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => copyToClipboard(selectedMessage.email)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Email
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedMessage.message)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Message
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-medium mb-2">No Message Selected</h3>
                <p>Select a message from the list to view details and take action</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 