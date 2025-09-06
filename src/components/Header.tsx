import React from 'react';
import { LogOut, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ChatConnect</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={signOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};