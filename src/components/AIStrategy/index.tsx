import React, { useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

interface AIStrategyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIStrategy({ isOpen, onClose }: AIStrategyProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/defiInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: inputText }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.result, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
    
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1E90FF] flex flex-col z-50">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4">
        <button onClick={onClose} className="text-white text-xl">
          ← Back
        </button>
        <button onClick={onClose} className="text-white text-xl">
          ✖
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-4">
        {/* Bear Icon */}
        <div className="w-16 h-16 bg-pink-300 rounded-full mb-4 flex items-center justify-center">
          <span className="text-2xl">🐻</span>
        </div>

        {messages.length === 0 ? (
          <>
            {/* Title */}
            <h1 className="text-center text-white mb-6">
              Ask me anything about this strategy, or tap on a question below to get started.
            </h1>

            {/* Question Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <button className="bg-blue-400 p-3 rounded-lg text-sm text-white">
                How does Morpho's lending work?
              </button>
              <button className="bg-blue-400 p-3 rounded-lg text-sm text-white">
                What makes the Gauntlet WETH Prime Vault different?
              </button>
              <button className="bg-blue-400 p-3 rounded-lg text-sm text-white">
                How is the 3.72% APY calculated?
              </button>
              <button className="bg-blue-400 p-3 rounded-lg text-sm text-white">
                What risks should I be aware of?
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 w-full overflow-y-auto pb-20">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-400 text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center w-full my-4">
                <div className="bg-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Input */}
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-800 rounded-full flex items-center p-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask anything.."
              className="bg-transparent flex-1 text-white px-4 outline-none"
            />
            <button 
              onClick={handleSubmit}
              className="bg-blue-500 rounded-full p-2 text-white"
              disabled={isLoading}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}