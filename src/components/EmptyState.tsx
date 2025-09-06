import React from 'react';
import { MessageCircle } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-10 h-10 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Select a contact to start chatting
        </h3>
        
        <p className="text-gray-500 mb-6">
          Choose a contact from your list to begin a conversation. Your messages will appear here in real-time.
        </p>
        
        <div className="space-y-2 text-sm text-gray-400">
          <p>💬 Real-time messaging</p>
          <p>📱 Works on all devices</p>
          <p>🔒 Secure Google authentication</p>
        </div>
      </div>
    </div>
  );
};