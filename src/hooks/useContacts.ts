import { useState, useEffect } from 'react';
import { Contact } from '../types';

// Mock contacts data for demo
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: true,
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '5',
    name: 'Eva Davis',
    email: 'eva@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isOnline: true,
  },
];

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would fetch from Google Contacts API
      const storedContacts = localStorage.getItem('contacts');
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        localStorage.setItem('contacts', JSON.stringify(mockContacts));
        setContacts(mockContacts);
      }
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Contacts fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchContacts = (query: string) => {
    if (!query.trim()) return contacts;
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    contacts,
    isLoading,
    error,
    searchContacts,
    refetch: fetchContacts
  };
};