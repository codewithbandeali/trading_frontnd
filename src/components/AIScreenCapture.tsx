import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Send, Loader2, X, MessageCircle } from 'lucide-react';
import  API  from '../services/api';

interface AIScreenCaptureProps {
  symbol?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIScreenCapture({ symbol }: AIScreenCaptureProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const floatingRef = useRef<HTMLDivElement>(null);

  // Set initial position to bottom-left
  useEffect(() => {
    setPosition({ x: 20, y: window.innerHeight - 100 });
  }, []);

  const handleAnalyzeScreen = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {


    
      const { data } = await API.post('ask/', { prompt });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'No response received',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error analyzing screen:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to analyze screen'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
      setPrompt('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyzeScreen();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({
      x: Math.max(0, Math.min(newX, window.innerWidth - 60)),
      y: Math.max(0, Math.min(newY, window.innerHeight - 60))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const toggleOpen = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={floatingRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {!isOpen ? (
        // Floating button (minimized)
        <button
          onClick={toggleOpen}
          onMouseDown={handleMouseDown}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          title="AI Screen Analysis"
        >
          <MessageCircle className="w-6 h-6" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {messages.length > 9 ? '9+' : messages.length}
            </span>
          )}
        </button>
      ) : (
        // Expanded panel
        <div className="bg-white rounded-xl p-6 shadow-2xl border w-96 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="flex items-center gap-2 cursor-move flex-1"
              onMouseDown={handleMouseDown}
            >
              <Camera className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">AI Screen Analysis</h3>
              {symbol && (
                <span className="text-sm text-gray-500">({symbol})</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation History */}
          {isExpanded && messages.length > 0 && (
            <div className="mb-4 max-h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.role === 'user'
                      ? 'ml-auto bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border'
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask AI to analyze your trading dashboard (e.g., 'What do you see in this chart?' or 'Analyze the current market trends')"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={isAnalyzing}
              />
              <button
                onClick={handleAnalyzeScreen}
                disabled={!prompt.trim() || isAnalyzing}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 h-fit ${
                  prompt.trim() && !isAnalyzing
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Capture & Analyze
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-gray-500">
              <p>💡 The AI will capture your entire screen and analyze your trading dashboard.</p>
              <p>Try asking: "What patterns do you see?" or "Should I buy or sell based on this chart?"</p>
            </div>
          </div>

          {/* Latest Response (when not expanded) */}
          {!isExpanded && messages.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Latest AI Response:</div>
              <div className="text-sm text-gray-900">
                {messages[messages.length - 1].content}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}