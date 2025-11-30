import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, X, Brain, MessageSquare, Plus, Trash2 } from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import { startCaseChat, sendCaseMessage } from '../services/caseCompetitionService';
import MessageBubble from './MessageBubble';
import { Message, Sender, MessageType } from '../types';

interface Thread {
  id: string;
  name: string;
  messages: Message[];
  mode: 'case-competition' | 'general';
}

const LumiWorkspace: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: '1',
      name: 'Case Competition',
      messages: [],
      mode: 'case-competition'
    },
    {
      id: '2',
      name: 'General Assistant',
      messages: [],
      mode: 'general'
    }
  ]);
  
  const [activeThreadId, setActiveThreadId] = useState<string>('1');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isInitialized, setIsInitialized] = useState<Record<string, boolean>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    if (!isInitialized[activeThreadId] && activeThread) {
      initializeThread(activeThreadId);
    }
  }, [activeThreadId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const initializeThread = async (threadId: string) => {
    setIsLoading(true);
    try {
      const welcomeMessage = await startCaseChat();
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: welcomeMessage,
        timestamp: Date.now(),
      };
      
      setThreads(prev => prev.map(t => 
        t.id === threadId 
          ? { ...t, messages: [botMessage] }
          : t
      ));
      setIsInitialized(prev => ({ ...prev, [threadId]: true }));
    } catch (error: any) {
      console.error('Error initializing thread:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && uploadedFiles.length === 0) || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      type: MessageType.TEXT,
      content: userMsg || `Uploaded ${uploadedFiles.length} file(s)`,
      timestamp: Date.now(),
    };

    setThreads(prev => prev.map(t => 
      t.id === activeThreadId 
        ? { ...t, messages: [...t.messages, userMessage] }
        : t
    ));
    setIsLoading(true);

    try {
      const response = await sendCaseMessage(userMsg, uploadedFiles);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: response,
        timestamp: Date.now(),
      };
      
      setThreads(prev => prev.map(t => 
        t.id === activeThreadId 
          ? { ...t, messages: [...t.messages, botMessage] }
          : t
      ));
      
      if (uploadedFiles.length > 0) {
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setThreads(prev => prev.map(t => 
        t.id === activeThreadId 
          ? { ...t, messages: [...t.messages, errorMessage] }
          : t
      ));
    } finally {
      setIsLoading(false);
    }
  };


  const createNewThread = () => {
    const newThread: Thread = {
      id: Date.now().toString(),
      name: `Thread ${threads.length + 1}`,
      messages: [],
      mode: 'case-competition'
    };
    setThreads(prev => [...prev, newThread]);
    setActiveThreadId(newThread.id);
  };

  const deleteThread = (threadId: string) => {
    if (threads.length <= 1) return; // Keep at least one thread
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThreadId === threadId) {
      const remainingThreads = threads.filter(t => t.id !== threadId);
      setActiveThreadId(remainingThreads[0]?.id || '1');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 z-30 h-16 flex-shrink-0">
        <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-green-600" />
              <h1 className="font-semibold text-lg tracking-tight text-gray-900">Lumi</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && <SettingsMenu user={user} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Threads Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={createNewThread}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              <span>New Thread</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`group relative mb-2 p-3 rounded-lg cursor-pointer transition-all ${
                  activeThreadId === thread.id
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">{thread.name}</span>
                  </div>
                  {threads.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {thread.messages.length} messages
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-white relative">
          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6"
            style={{ paddingBottom: '200px' }}
          >
            {activeThread?.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex w-full justify-start mb-6">
                <div className="flex max-w-[85%] flex-row">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-800 text-white mr-3 flex items-center justify-center text-[10px] font-bold">
                    LUMI
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

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="px-4 lg:px-6 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-700 max-w-[150px] truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="w-full bg-white border-t border-gray-200 p-4 lg:p-6 absolute bottom-0 left-0 right-0 z-20 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.ppt,.pptx"
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Nhập câu hỏi hoặc upload file để phân tích..."
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-800 placeholder-gray-400 text-sm lg:text-base focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Upload file"
                >
                  <Upload size={20} />
                </button>
                <button
                  type="submit"
                  disabled={(!inputText.trim() && uploadedFiles.length === 0) || isLoading}
                  className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
                    (!inputText.trim() && uploadedFiles.length === 0) || isLoading
                      ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'text-white bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Send size={20} />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2 ml-2">
                Hỗ trợ: PDF, Slide, Hình ảnh • Phân tích tự động • Framework MECE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumiWorkspace;

