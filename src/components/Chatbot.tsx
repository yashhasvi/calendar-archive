import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface ChatbotProps {
  isDark: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Calendar Archive assistant. I can help you with information about our app, features, and how to use the calendar system. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const botResponses = {
    greeting: "Hello! I'm here to help you with Calendar Archive. What can I assist you with today?",
    features: "Calendar Archive offers: 📅 Interactive calendar view, 🌍 Global holiday database, 👤 Personal event management, 📊 Admin dashboard, 🔍 Advanced search & filtering, 📱 Export to PDF/ICS formats",
    admin: "Admin features include: User management, CSV upload for holidays, Analytics dashboard, System monitoring, and Notification broadcasting to users.",
    personal: "You can add personal events like birthdays, anniversaries, reminders, and meetings. These are private to your account and can be exported.",
    export: "You can export your personal calendar as PDF or ICS file. Go to your profile menu and click 'Export Calendar'.",
    search: "Use the search bar in the header to find events by name, date, country, or category. You can also filter by country in the sidebar.",
    default: "I can help you with information about Calendar Archive features, how to use the app, admin functions, personal events, exporting data, and searching. What specific topic interests you?"
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return botResponses.greeting;
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
      return botResponses.features;
    } else if (lowerMessage.includes('admin') || lowerMessage.includes('administrator')) {
      return botResponses.admin;
    } else if (lowerMessage.includes('personal') || lowerMessage.includes('my event') || lowerMessage.includes('add event')) {
      return botResponses.personal;
    } else if (lowerMessage.includes('export') || lowerMessage.includes('download') || lowerMessage.includes('pdf') || lowerMessage.includes('ics')) {
      return botResponses.export;
    } else if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('filter')) {
      return botResponses.search;
    } else {
      return botResponses.default;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white mx-auto" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white mx-auto" />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-80 h-96 rounded-2xl shadow-2xl border z-50 flex flex-col ${
          isDark 
            ? 'bg-gray-800/95 backdrop-blur-md border-gray-700/50' 
            : 'bg-white/95 backdrop-blur-md border-gray-200/50'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Calendar Assistant
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}>
                    {message.isBot ? (
                      <Bot className="h-3 w-3 text-white" />
                    ) : (
                      <User className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-sm ${
                    message.isBot
                      ? isDark 
                        ? 'bg-gray-700/50 text-gray-200' 
                        : 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Calendar Archive..."
                className={`flex-1 px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;