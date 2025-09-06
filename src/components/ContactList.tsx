import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Mail } from 'lucide-react';
import { Contact } from '../types';
import { useContacts } from '../hooks/useContacts';
import { formatDistanceToNow } from 'date-fns';

interface ContactListProps {
  selectedContactId: string | null;
  onSelectContact: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  selectedContactId,
  onSelectContact
}) => {
  const { contacts, isLoading, searchContacts } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  React.useEffect(() => {
    const filtered = searchContacts(searchQuery);
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  const getLastSeenText = (contact: Contact) => {
    if (contact.isOnline) return 'Online';
    if (contact.lastSeen) {
      return `Last seen ${formatDistanceToNow(contact.lastSeen, { addSuffix: true })}`;
    }
    return 'Last seen recently';
  };

  if (isLoading) {
    return (
      <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1 space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">
              {searchQuery ? 'No contacts found' : 'No contacts available'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedContactId === contact.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={contact.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {getLastSeenText(contact)}
                  </p>
                </div>

                <div className="flex space-x-1">
                  {contact.email && (
                    <div className="p-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                  {contact.phone && (
                    <div className="p-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};