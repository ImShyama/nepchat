import { useState, useEffect } from 'react';
import { Message, Chat } from '../types';

export const useMessages = (userId: string) => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [userId]);

  const loadMessages = () => {
    const storedMessages = localStorage.getItem('messages');
    const storedChats = localStorage.getItem('chats');
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  };

  const sendMessage = async (contactId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: userId,
      receiverId: contactId,
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };

    // Update messages
    const updatedMessages = {
      ...messages,
      [contactId]: [...(messages[contactId] || []), newMessage]
    };
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));

    // Update or create chat
    const existingChatIndex = chats.findIndex(chat => 
      chat.participants.includes(contactId) && chat.participants.includes(userId)
    );

    let updatedChats: Chat[];
    if (existingChatIndex >= 0) {
      updatedChats = [...chats];
      updatedChats[existingChatIndex] = {
        ...updatedChats[existingChatIndex],
        lastMessage: newMessage,
        updatedAt: new Date()
      };
    } else {
      const newChat: Chat = {
        id: Date.now().toString(),
        participants: [userId, contactId],
        lastMessage: newMessage,
        unreadCount: 0,
        updatedAt: new Date()
      };
      updatedChats = [newChat, ...chats];
    }

    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    // Simulate message delivery after a short delay
    setTimeout(() => {
      const deliveredMessages = {
        ...updatedMessages,
        [contactId]: updatedMessages[contactId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        )
      };
      setMessages(deliveredMessages);
      localStorage.setItem('messages', JSON.stringify(deliveredMessages));
    }, 1000);
  };

  const getMessagesForContact = (contactId: string): Message[] => {
    return messages[contactId] || [];
  };

  const markMessagesAsRead = (contactId: string) => {
    const contactMessages = messages[contactId] || [];
    const updatedMessages = {
      ...messages,
      [contactId]: contactMessages.map(msg => 
        msg.senderId !== userId ? { ...msg, status: 'read' as const } : msg
      )
    };
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  return {
    messages,
    chats: chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    isLoading,
    sendMessage,
    getMessagesForContact,
    markMessagesAsRead
  };
};