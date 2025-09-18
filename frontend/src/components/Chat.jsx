import React, { useState, useEffect, useRef } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import { IoMdSend } from 'react-icons/io';
import { IoMdAttach } from 'react-icons/io';

const Chat = ({ selectedUser }) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const {
    messages,
    typingUsers,
    isConnected,
    sendTextMessage,
    sendTypingIndicator,
    sendTypingStopped,
    markMessageAsRead
  } = useWebSocketContext();

  // Автоскролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Обработка ввода текста с индикатором печати
  const handleTextChange = (e) => {
    const text = e.target.value;
    setMessageText(text);
    
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator();
    }
    
    // Сброс таймера печати
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStopped();
    }, 2000);
  };

  // Отправка сообщения
  const handleSendMessage = () => {
    if (messageText.trim() && selectedUser) {
      sendTextMessage(messageText.trim(), selectedUser.id);
      setMessageText('');
      
      // Остановить индикатор печати
      if (isTyping) {
        setIsTyping(false);
        sendTypingStopped();
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  };

  // Отправка по Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Фильтрация сообщений для текущего чата
  const chatMessages = messages.filter(msg => 
    (msg.sender === selectedUser?.id && msg.receiver === 'me') ||
    (msg.sender === 'me' && msg.receiver === selectedUser?.id)
  );

  // Проверка, печатает ли выбранный пользователь
  const isUserTyping = selectedUser && typingUsers.has(selectedUser.id);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Заголовок чата */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {selectedUser?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedUser?.username || 'Unknown User'}
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-500">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Начните разговор с {selectedUser?.username || 'пользователем'}</p>
          </div>
        ) : (
          chatMessages.map((message, index) => (
            <div
              key={message.id || message.random_id || index}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'me'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {message.type === 'text' ? (
                  <p className="text-sm">{message.text}</p>
                ) : message.type === 'file' ? (
                  <div className="flex items-center space-x-2">
                    <IoMdAttach className="w-4 h-4" />
                    <span className="text-sm">{message.file?.name || 'File'}</span>
                  </div>
                ) : null}
                <p className={`text-xs mt-1 ${
                  message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        
        {/* Индикатор печати */}
        {isUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <IoMdAttach className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder="Введите сообщение..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <IoMdSend className="w-5 h-5" />
          </button>
        </div>
        
        {/* Статус соединения */}
        {!isConnected && (
          <div className="mt-2 text-center">
            <span className="text-sm text-red-500">
              Соединение потеряно. Переподключение...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
