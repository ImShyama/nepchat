import React, { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { ContactList } from './components/ContactList';
import { ChatWindow } from './components/ChatWindow';
import { EmptyState } from './components/EmptyState';
import { Header } from './components/Header';
import { useAuth } from './hooks/useAuth';
import { Contact } from './types';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isMobileContactsView, setIsMobileContactsView] = useState(true);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsMobileContactsView(false);
  };

  const handleBackToContacts = () => {
    setIsMobileContactsView(true);
    setSelectedContact(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          <ContactList 
            selectedContactId={selectedContact?.id || null}
            onSelectContact={handleSelectContact}
          />
          {selectedContact ? (
            <ChatWindow contact={selectedContact} />
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full flex">
          {isMobileContactsView ? (
            <ContactList 
              selectedContactId={selectedContact?.id || null}
              onSelectContact={handleSelectContact}
            />
          ) : selectedContact ? (
            <ChatWindow 
              contact={selectedContact} 
              onBack={handleBackToContacts}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;