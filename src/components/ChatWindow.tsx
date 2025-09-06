import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { Contact, Message } from '../types';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import clsx from 'clsx';

interface ChatWindowProps {
  contact: Contact;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ contact, onBack }) => {
  const { user } = useAuth();
  const { sendMessage, getMessagesForContact, markMessagesAsRead } = useMessages(user?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = getMessagesForContact(contact.id);

  useEffect(() => {
    markMessagesAsRead(contact.id);
    scrollToBottom();
  }, [contact.id, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(contact.id, newMessage.trim());
    setNewMessage('');
  };

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const getStatusIcon = (message: Message) => {
    if (message.senderId !== user?.id) return null;
    
    switch (message.status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span className="text-blue-600">✓✓</span>;
      default:
        return null;
    }
  };

  const getLastSeenText = () => {
    if (contact.isOnline) return 'Online';
    if (contact.lastSeen) {
      return `Last seen ${formatDistanceToNow(contact.lastSeen, { addSuffix: true })}`;
    }
    return 'Last seen recently';
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="relative">
              <img
                src={contact.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
              <p className="text-sm text-gray-500">{getLastSeenText()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Start a conversation with {contact.name}</p>
              <p className="text-sm text-gray-400">Send your first message below</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === user?.id;
              const showTimestamp = index === 0 || 
                (messages[index - 1] && 
                 new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000); // 5 minutes

              return (
                <div key={message.id}>
                  {showTimestamp && (
                    <div className="flex justify-center mb-4">
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                        {formatMessageTime(new Date(message.timestamp))}
                      </span>
                    </div>
                  )}
                  
                  <div className={clsx(
                    'flex',
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  )}>
                    <div className={clsx(
                      'max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm',
                      isOwnMessage 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <div className={clsx(
                        'flex items-center justify-end space-x-1 mt-1',
                        isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                      )}>
                        <span className="text-xs">
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </span>
                        <span className="text-xs">
                          {getStatusIcon(message)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">{contact.name} is typing...</span>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${contact.name}...`}
              className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Smile className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={clsx(
              'p-2 rounded-lg transition-all',
              newMessage.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};