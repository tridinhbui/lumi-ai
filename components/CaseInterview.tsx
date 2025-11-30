import React, { useState, useEffect, useRef } from 'react';
import { startChat, sendMessageToGemini } from '../services/geminiService';
import { Message, MessageType, Sender, CaseStage } from '../types';
import MessageBubble from './MessageBubble';
import Dashboard from './Dashboard';
import { Loader2, Send, PlayCircle, Briefcase, RefreshCw, Menu, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CaseInterview: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState<CaseStage>('intro');
  const [showMobileDash, setShowMobileDash] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("Waiting for candidate input...");
  const [feedbackStatus, setFeedbackStatus] = useState<'neutral' | 'positive' | 'attention'>('neutral');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleStartCase = async () => {
    setHasStarted(true);
    setIsLoading(true);
    const fullResponse = await startChat();
    processBotResponse(fullResponse);
    setIsLoading(false);
  };

  const processBotResponse = (fullText: string) => {
    let cleanText = fullText;
    let feedback = "";
    
    if (fullText.includes('[FEEDBACK]:')) {
      const parts = fullText.split('[FEEDBACK]:');
      cleanText = parts[0].trim();
      feedback = parts[1].trim();
    }

    let type = MessageType.TEXT;
    
    if (cleanText.includes('[SHOW_EXHIBIT_1]')) {
      type = MessageType.EXHIBIT_1;
      cleanText = cleanText.replace('[SHOW_EXHIBIT_1]', '').trim();
      setCurrentStage('quant');
    } else if (cleanText.includes('[SHOW_EXHIBIT_2]')) {
      type = MessageType.EXHIBIT_2;
      cleanText = cleanText.replace('[SHOW_EXHIBIT_2]', '').trim();
      setCurrentStage('interpretation');
    } else if (cleanText.toLowerCase().includes('case closed') || cleanText.toLowerCase().includes('synthesis')) {
      setCurrentStage('synthesis');
    } else if (currentStage === 'intro' && messages.length > 1) {
       setCurrentStage('structure');
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.BOT,
      type,
      content: cleanText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);

    if (feedback) {
      setCurrentFeedback(feedback);
      
      const lowerFeedback = feedback.toLowerCase();
      if (lowerFeedback.includes('good') || lowerFeedback.includes('correct') || lowerFeedback.includes('excellent') || lowerFeedback.includes('strong')) {
        setFeedbackStatus('positive');
      } else if (lowerFeedback.includes('missed') || lowerFeedback.includes('wrong') || lowerFeedback.includes('error') || lowerFeedback.includes('check')) {
        setFeedbackStatus('attention');
      } else {
        setFeedbackStatus('neutral');
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      type: MessageType.TEXT,
      content: userMsg,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const response = await sendMessageToGemini(userMsg);
    processBotResponse(response);
    
    setIsLoading(false);
    
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* Global Header */}
      <header className="w-full bg-white border-b border-gray-200 z-30 h-16 flex-shrink-0">
        <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold tracking-tighter text-green-800 flex items-center">
              BCG
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight text-gray-900">Case Interview Simulator</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Interactive Assessment</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="hidden md:block text-sm text-gray-700">{user.name}</span>
              </div>
            )}
            <button
              onClick={() => navigate('/analytics')}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Lumi - Case Competition Assistant"
            >
              <BarChart3 size={16} />
              <span>Lumi</span>
            </button>
            <button 
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setShowMobileDash(!showMobileDash)}
            >
              <Menu size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
            <div className="hidden lg:block text-right">
              <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                <Briefcase size={12} className="mr-1.5" />
                Confidential
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Chat Area */}
        <main className="flex-1 flex flex-col relative w-full lg:w-1/2 bg-white/50 border-r border-gray-200">
          {!hasStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-4">
                <div className="w-16 h-16 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlayCircle size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">MediDrone Case</h2>
                <p className="text-gray-500 mb-8 text-base leading-relaxed">
                  You are interviewing for a Strategy Consultant role.
                  <br/>
                  The client is a medical logistics startup facing profitability issues.
                </p>
                <div className="space-y-4">
                  <div className="text-xs font-mono text-gray-400 mb-4 bg-gray-50 p-2 rounded">
                    CASE ID: 8821-MD • DIFFICULTY: INTERMEDIATE
                  </div>
                  <button 
                    onClick={handleStartCase}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center text-sm"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Begin Interview"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages List */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6"
                style={{ paddingBottom: '140px' }}
              >
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex w-full justify-start mb-6">
                    <div className="flex max-w-[85%] flex-row">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-800 text-white mr-3 flex items-center justify-center text-[10px] font-bold">
                        BCG
                      </div>
                      <div className="bg-white border border-gray-100 py-4 px-5 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                        <span className="flex space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Input Area */}
              <div className="w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 lg:p-6 absolute bottom-0 z-20">
                <div className="max-w-2xl mx-auto">
                  <form onSubmit={handleSendMessage} className="relative flex items-center shadow-sm rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-green-500/50 focus-within:border-green-500 transition-all">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type your structured response..."
                      className="flex-1 py-3 px-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm lg:text-base"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className={`p-2 mr-2 rounded-lg transition-colors ${
                        !inputText.trim() || isLoading 
                          ? 'text-gray-300' 
                          : 'text-green-700 hover:bg-green-50'
                      }`}
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Dashboard Sidebar */}
        <aside className="hidden lg:block w-1/2 h-full z-20 shadow-xl bg-white">
           <Dashboard 
             currentStage={currentStage} 
             currentFeedback={currentFeedback}
             feedbackStatus={feedbackStatus}
           />
        </aside>

        {/* Dashboard Overlay - Mobile */}
        {showMobileDash && (
           <div className="absolute inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileDash(false)}></div>
              <div className="absolute right-0 top-0 bottom-0 w-5/6 bg-white shadow-2xl overflow-y-auto">
                 <Dashboard 
                   currentStage={currentStage} 
                   currentFeedback={currentFeedback}
                   feedbackStatus={feedbackStatus}
                 />
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default CaseInterview;

