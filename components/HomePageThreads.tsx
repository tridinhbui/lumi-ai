import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, X, MessageSquare, ArrowRight } from 'lucide-react';
import { startCaseChat, sendCaseMessage } from '../services/caseCompetitionService';
import { 
  createThread, getThreads, 
  saveMessage, getMessages, updateThreadTimestamp 
} from '../services/supabaseService';
import MessageBubble from './MessageBubble';
import { Message, Sender, MessageType } from '../types';

interface Thread {
  id: string;
  name: string;
  messages: Message[];
  mode: 'case-competition' | 'general';
}

const HomePageThreads: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [caseThread, setCaseThread] = useState<Thread | null>(null);
  const [generalThread, setGeneralThread] = useState<Thread | null>(null);
  const [caseInput, setCaseInput] = useState('');
  const [generalInput, setGeneralInput] = useState('');
  const [caseLoading, setCaseLoading] = useState(false);
  const [generalLoading, setGeneralLoading] = useState(false);
  const [caseInitialized, setCaseInitialized] = useState(false);
  const [generalInitialized, setGeneralInitialized] = useState(false);
  
  const caseMessagesEndRef = useRef<HTMLDivElement>(null);
  const generalMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadThreads();
  }, [user]);

  useEffect(() => {
    if (caseThread && !caseInitialized) {
      loadThreadMessages(caseThread.id, 'case');
    }
  }, [caseThread]);

  useEffect(() => {
    if (generalThread && !generalInitialized) {
      loadThreadMessages(generalThread.id, 'general');
    }
  }, [generalThread]);

  useEffect(() => {
    scrollToBottom('case');
  }, [caseThread?.messages, caseLoading]);

  useEffect(() => {
    scrollToBottom('general');
  }, [generalThread?.messages, generalLoading]);

  const scrollToBottom = (type: 'case' | 'general') => {
    setTimeout(() => {
      const ref = type === 'case' ? caseMessagesEndRef : generalMessagesEndRef;
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const loadThreads = async () => {
    if (!user?.email) return;
    
    try {
      const dbThreads = await getThreads(user.email);
      
      let caseThreadData: Thread | null = null;
      let generalThreadData: Thread | null = null;
      
      // Find existing threads
      const existingCase = dbThreads.find(t => t.mode === 'case-competition');
      const existingGeneral = dbThreads.find(t => t.mode === 'general');
      
      if (existingCase) {
        caseThreadData = {
          id: existingCase.id,
          name: existingCase.name,
          messages: [],
          mode: 'case-competition',
        };
      } else {
        const threadId = await createThread(user.email, 'Case Competition', 'case-competition');
        caseThreadData = {
          id: threadId || Date.now().toString(),
          name: 'Case Competition',
          messages: [],
          mode: 'case-competition',
        };
      }
      
      if (existingGeneral) {
        generalThreadData = {
          id: existingGeneral.id,
          name: existingGeneral.name,
          messages: [],
          mode: 'general',
        };
      } else {
        const threadId = await createThread(user.email, 'General Assistant', 'general');
        generalThreadData = {
          id: threadId || (Date.now() + 1).toString(),
          name: 'General Assistant',
          messages: [],
          mode: 'general',
        };
      }
      
      setCaseThread(caseThreadData);
      setGeneralThread(generalThreadData);
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const loadThreadMessages = async (threadId: string, type: 'case' | 'general') => {
    try {
      const messages = await getMessages(threadId);
      
      if (messages.length === 0) {
        await initializeThread(threadId, type);
      } else {
        if (type === 'case') {
          setCaseThread(prev => prev ? { ...prev, messages } : null);
          setCaseInitialized(true);
        } else {
          setGeneralThread(prev => prev ? { ...prev, messages } : null);
          setGeneralInitialized(true);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      await initializeThread(threadId, type);
    }
  };

  const initializeThread = async (threadId: string, type: 'case' | 'general') => {
    const setIsLoading = type === 'case' ? setCaseLoading : setGeneralLoading;
    setIsLoading(true);
    
    try {
      const welcomeMessage = type === 'case' 
        ? await startCaseChat()
        : 'Xin chào! Tôi là Lumi, trợ lý AI của BizCase Lab. Tôi có thể giúp gì cho bạn?';
      
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: welcomeMessage,
        timestamp: Date.now(),
      };
      
      await saveMessage(threadId, botMessage);
      
      if (type === 'case') {
        setCaseThread(prev => prev ? { ...prev, messages: [botMessage] } : null);
        setCaseInitialized(true);
      } else {
        setGeneralThread(prev => prev ? { ...prev, messages: [botMessage] } : null);
        setGeneralInitialized(true);
      }
    } catch (error) {
      console.error('Error initializing thread:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string, type: 'case' | 'general') => {
    const thread = type === 'case' ? caseThread : generalThread;
    const setInput = type === 'case' ? setCaseInput : setGeneralInput;
    const setIsLoading = type === 'case' ? setCaseLoading : setGeneralLoading;
    
    if (!text.trim() || !thread || (type === 'case' ? caseLoading : generalLoading)) return;
    
    setInput('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      type: MessageType.TEXT,
      content: text,
      timestamp: Date.now(),
    };
    
    if (type === 'case') {
      setCaseThread(prev => prev ? { ...prev, messages: [...prev.messages, userMessage] } : null);
    } else {
      setGeneralThread(prev => prev ? { ...prev, messages: [...prev.messages, userMessage] } : null);
    }
    
    await saveMessage(thread.id, userMessage);
    setIsLoading(true);
    
    try {
      const response = await sendCaseMessage(text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: response,
        timestamp: Date.now(),
      };
      
      if (type === 'case') {
        setCaseThread(prev => prev ? { ...prev, messages: [...prev.messages, botMessage] } : null);
      } else {
        setGeneralThread(prev => prev ? { ...prev, messages: [...prev.messages, botMessage] } : null);
      }
      
      await saveMessage(thread.id, botMessage);
      await updateThreadTimestamp(thread.id);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Case Competition Thread */}
      <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm flex flex-col" style={{ height: '600px' }}>
        <div className="p-4 border-b border-[#E6E9EF] bg-[#1F4AA8] text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">Case Competition</h3>
            </div>
            <button
              onClick={() => navigate('/case-competition')}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Mở toàn màn hình"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '450px' }}>
          {caseThread?.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {caseLoading && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[85%] flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-900 text-white mr-3 flex items-center justify-center text-[10px] font-semibold">
                  LUMI
                </div>
                <div className="bg-white border border-neutral-200 py-3 px-4 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                  <span className="flex space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={caseMessagesEndRef} className="h-1" />
        </div>
        
        <div className="p-4 border-t border-[#E6E9EF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(caseInput, 'case');
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={caseInput}
              onChange={(e) => setCaseInput(e.target.value)}
                    placeholder="Ask about case competition..."
                    className="flex-1 py-2 px-3 bg-white border border-[#E6E9EF] rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#E6F0FF] focus:border-[#1F4AA8] transition-all"
              disabled={caseLoading}
            />
            <button
              type="submit"
              disabled={!caseInput.trim() || caseLoading}
                className={`p-2 rounded-xl transition-all ${
                  !caseInput.trim() || caseLoading
                    ? 'text-[#a3a3a3] bg-[#F8F9FB] cursor-not-allowed'
                    : 'text-white bg-[#1F4AA8] hover:bg-[#153A73] shadow-sm hover:shadow-md'
                }`}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* General Assistant Thread */}
      <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm flex flex-col" style={{ height: '600px' }}>
        <div className="p-4 border-b border-[#E6E9EF] bg-[#1F4AA8] text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">General Assistant</h3>
            </div>
            <button
              onClick={() => navigate('/general-assistant')}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Mở toàn màn hình"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '450px' }}>
          {generalThread?.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {generalLoading && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[85%] flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-900 text-white mr-3 flex items-center justify-center text-[10px] font-semibold">
                  LUMI
                </div>
                <div className="bg-white border border-neutral-200 py-3 px-4 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                  <span className="flex space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={generalMessagesEndRef} className="h-1" />
        </div>
        
        <div className="p-4 border-t border-[#E6E9EF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(generalInput, 'general');
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={generalInput}
              onChange={(e) => setGeneralInput(e.target.value)}
                    placeholder="Ask Lumi anything..."
                    className="flex-1 py-2 px-3 bg-white border border-[#E6E9EF] rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#E6F0FF] focus:border-[#1F4AA8] transition-all"
              disabled={generalLoading}
            />
            <button
              type="submit"
              disabled={!generalInput.trim() || generalLoading}
                className={`p-2 rounded-xl transition-all ${
                  !generalInput.trim() || generalLoading
                    ? 'text-[#a3a3a3] bg-[#F8F9FB] cursor-not-allowed'
                    : 'text-white bg-[#1F4AA8] hover:bg-[#153A73] shadow-sm hover:shadow-md'
                }`}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePageThreads;

