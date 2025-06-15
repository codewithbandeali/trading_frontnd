import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Send, Trash2, RotateCcw, Save, Upload, Folder } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: {
    name: string;
    content: string;
    type: string;
  }[];
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })) : [];
  });
  
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(() => {
    const savedHistories = localStorage.getItem('chatHistories');
    return savedHistories ? JSON.parse(savedHistories).map((history: any) => ({
      ...history,
      createdAt: new Date(history.createdAt),
      messages: history.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    })) : [];
  });

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true
  });

  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + ' ' + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }, [chatHistories]);

  const startListening = async () => {
    try {
      if (!browserSupportsSpeechRecognition) {
        throw new Error('Browser does not support speech recognition');
      }
      
      if (!isMicrophoneAvailable) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
      
      await SpeechRecognition.startListening({ continuous: true });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use voice input');
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const attachments = await Promise.all(
      Array.from(files).map(async (file) => {
        return new Promise<{ name: string; content: string; type: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              content: e.target?.result as string,
              type: file.type,
            });
          };
          if (file.type.startsWith('text/')) {
            reader.readAsText(file);
          } else {
            reader.readAsDataURL(file);
          }
        });
      })
    );

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Uploaded ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`,
      timestamp: new Date(),
      attachments
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I have received your files and analyzed them. What would you like to know about them?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    resetTranscript();
    setIsProcessing(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated AI response. Replace this with actual OpenAI API integration.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleSaveCurrentChat = () => {
    if (messages.length === 0) return;

    const newHistory: ChatHistory = {
      id: Date.now().toString(),
      title: `Chat ${new Date().toLocaleDateString()}`,
      messages: messages,
      createdAt: new Date()
    };

    setChatHistories(prev => [...prev, newHistory]);
    handleClearChat();
  };

  const handleLoadChat = (history: ChatHistory) => {
    setMessages(history.messages);
    setShowHistory(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput('');
    resetTranscript();
  };

  const handleRegenerateResponse = () => {
    if (messages.length === 0) return;
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setMessages(messages.filter(m => m.id !== messages[messages.length - 1].id));
      setIsProcessing(true);
      setTimeout(() => {
        const newAiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'This is a regenerated AI response.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newAiMessage]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-hidden">
      {/* Chat History Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-64 w-64 bg-gray-50 border-r transform transition-transform duration-300 z-10",
        showHistory ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Chat History</h3>
          <div className="space-y-2">
            {chatHistories.map((history) => (
              <button
                key={history.id}
                onClick={() => handleLoadChat(history)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                <p className="font-medium truncate">{history.title}</p>
                <p className="text-sm text-gray-500">
                  {history.createdAt.toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">AI Assistant</h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Folder className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveCurrentChat}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Save chat"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={handleRegenerateResponse}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Regenerate response"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'max-w-[80%] rounded-lg p-4',
                message.role === 'user'
                  ? 'ml-auto bg-blue-600 text-white'
                  : 'bg-white text-gray-900'
              )}
            >
              <p>{message.content}</p>
              {message.attachments && (
                <div className="mt-2 space-y-1">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="text-sm opacity-90">
                      📎 {attachment.name}
                    </div>
                  ))}
                </div>
              )}
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
          {isProcessing && (
            <div className="bg-white text-gray-900 max-w-[80%] rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              title="Upload files"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              {browserSupportsSpeechRecognition && (
                <button
                  onClick={() => listening ? stopListening() : startListening()}
                  className={clsx(
                    'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full',
                    listening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={clsx(
                'p-2 rounded-lg',
                input.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {listening && (
            <div className="mt-2 text-sm text-gray-500">
              Listening... {transcript}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}