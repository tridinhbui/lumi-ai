import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, X, ArrowLeft, MessageSquare, BarChart3 } from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import { sendCaseMessage } from '../services/caseCompetitionService';
import { 
  createThread, getThreads, 
  saveMessage, getMessages, updateThreadTimestamp 
} from '../services/supabaseService';
import MessageBubble from './MessageBubble';
import BizCaseLogo from './BizCaseLogo';
import MinimalButton from './MinimalButton';
import MinimalInput from './MinimalInput';
import GeneralAssistantDashboard from './GeneralAssistantDashboard';
import { Message, Sender, MessageType } from '../types';

const GeneralAssistantChat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [thread, setThread] = useState<{ id: string; name: string; messages: Message[] } | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadThread();
  }, [user]);

  useEffect(() => {
    if (thread && !isInitialized) {
      loadThreadMessages();
    }
  }, [thread]);

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages, isLoading]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const loadThread = async () => {
    if (!user?.email) return;
    
    try {
      const dbThreads = await getThreads(user.email);
      const existingThread = dbThreads.find(t => t.mode === 'general');
      
      if (existingThread) {
        setThread({
          id: existingThread.id,
          name: existingThread.name,
          messages: [],
        });
      } else {
        const threadId = await createThread(user.email, 'General Assistant', 'general');
        setThread({
          id: threadId || Date.now().toString(),
          name: 'General Assistant',
          messages: [],
        });
      }
    } catch (error) {
      console.error('Error loading thread:', error);
    }
  };

  const loadThreadMessages = async () => {
    if (!thread) return;
    
    setIsLoading(true);
    try {
      const messages = await getMessages(thread.id);
      
      if (messages.length === 0) {
        await initializeThread();
      } else {
        setThread(prev => prev ? { ...prev, messages } : null);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      await initializeThread();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeThread = async () => {
    if (!thread) return;
    
    setIsLoading(true);
    try {
      const welcomeMessage = 'Xin chào! Tôi là Lumi, trợ lý AI của BizCase Lab. Tôi có thể giúp bạn với:\n\n• Câu hỏi về case competition\n• Phân tích kinh doanh và chiến lược\n• Hướng dẫn sử dụng BizCase Lab\n• Và nhiều hơn nữa!\n\nHãy hỏi tôi bất cứ điều gì bạn muốn biết!';
      
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: welcomeMessage,
        timestamp: Date.now(),
      };
      
      await saveMessage(thread.id, botMessage);
      setThread(prev => prev ? { ...prev, messages: [botMessage] } : null);
      setIsInitialized(true);
    } catch (error) {
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
    if ((!inputText.trim() && uploadedFiles.length === 0) || isLoading || !thread) return;

    const userMsg = inputText.trim();
    setInputText('');

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      type: MessageType.TEXT,
      content: userMsg || `Uploaded ${uploadedFiles.length} file(s)`,
      timestamp: Date.now(),
    };

    setThread(prev => prev ? { ...prev, messages: [...prev.messages, userMessage] } : null);
    await saveMessage(thread.id, userMessage);
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

      setThread(prev => prev ? { ...prev, messages: [...prev.messages, botMessage] } : null);
      await saveMessage(thread.id, botMessage);
      await updateThreadTimestamp(thread.id);

      if (uploadedFiles.length > 0) {
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB] overflow-hidden">
      {/* Minimal Header */}
      <header className="w-full bg-white border-b border-[#E6E9EF] z-30 h-16 flex-shrink-0">
        <div className="w-full h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center space-x-4">
            <MinimalButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/home')}
              icon={ArrowLeft}
            >
              <span className="sr-only">Back</span>
            </MinimalButton>
            <div className="h-6 w-px bg-[#E6E9EF]"></div>
            <BizCaseLogo size="sm" showText={false} />
            <div className="h-6 w-px bg-[#E6E9EF]"></div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#153A73] icon-line-art" />
              <div>
                <h1 className="text-sm font-semibold text-[#1F4AA8]">General Assistant</h1>
                <p className="text-xs text-[#737373]">Lumi Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MinimalButton
              variant={showDashboard ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
              icon={BarChart3}
            >
              <span className="sr-only">Toggle Dashboard</span>
            </MinimalButton>
            {user && <SettingsMenu user={user} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6"
          style={{ paddingBottom: uploadedFiles.length > 0 ? '180px' : '120px' }}
        >
          {thread?.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex w-full justify-start mb-6">
              <div className="flex max-w-[85%] flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#1F4AA8] text-white mr-3 flex items-center justify-center text-[10px] font-semibold">
                  LUMI
                </div>
                <div className="bg-white border border-[#E6E9EF] py-4 px-5 rounded-2xl rounded-tl-none shadow-sm flex items-center">
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
          <div className="px-4 lg:px-6 py-2 bg-gray-50 border-t border-gray-200 absolute bottom-[120px] left-0 right-0 z-20">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-shrink-0">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-700 max-w-[150px] truncate min-w-0">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="w-full bg-white border-t border-[#E6E9EF] p-6 absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <div className="flex-1 min-w-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.ppt,.pptx"
                  className="hidden"
                />
                <MinimalInput
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Lumi anything..."
                  disabled={isLoading}
                />
              </div>
              <MinimalButton
                variant="ghost"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                icon={Upload}
              >
                <span className="sr-only">Upload</span>
              </MinimalButton>
              <MinimalButton
                type="submit"
                variant="primary"
                size="md"
                disabled={(!inputText.trim() && uploadedFiles.length === 0) || isLoading}
                icon={Send}
              >
                <span className="sr-only">Send</span>
              </MinimalButton>
            </form>
            <p className="text-xs text-[#737373] mt-3 ml-1">
              Supports: PDF, Slides, Images • General Assistant • Detailed Answers
            </p>
          </div>
        </div>

        {/* Dashboard Panel */}
        {showDashboard && (
          <div className="w-[600px] border-l border-[#E6E9EF] bg-white flex flex-col">
            <div className="p-4 border-b border-[#E6E9EF] bg-[#F8F9FB] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1F4AA8] flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Assistant Dashboard
              </h3>
              <button
                onClick={() => setShowDashboard(false)}
                className="p-1 hover:bg-[#E6E9EF] rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <GeneralAssistantDashboard 
                messages={thread?.messages || []} 
                threadName={thread?.name || 'General Assistant'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralAssistantChat;

