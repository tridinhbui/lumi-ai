import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, X, ArrowLeft, MessageSquare } from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import { sendCaseMessage } from '../services/caseCompetitionService';
import { 
  createThread, getThreads, 
  saveMessage, getMessages, updateThreadTimestamp 
} from '../services/supabaseService';
import MessageBubble from './MessageBubble';
import BizCaseLogo from './BizCaseLogo';
import { Message, Sender, MessageType } from '../types';

const GeneralAssistantChat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [thread, setThread] = useState<{ id: string; name: string; messages: Message[] } | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
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
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b-2 border-[#1e3a8a] z-30 h-16 flex-shrink-0">
        <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 text-gray-600 hover:text-[#1e3a8a] transition-colors"
              title="Trang chủ"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <BizCaseLogo size="sm" showText={false} />
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#1e3a8a]" />
              <div>
                <h1 className="font-semibold text-sm tracking-tight text-[#1e3a8a]">General Assistant Chat</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Lumi - BizCase Lab</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && <SettingsMenu user={user} />}
          </div>
        </div>
      </header>

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
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#1e3a8a] text-white mr-3 flex items-center justify-center text-[10px] font-bold">
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
        <div className="w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 lg:p-6 absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
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
                  placeholder="Hỏi Lumi bất cứ điều gì..."
                  className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-800 placeholder-gray-400 text-sm lg:text-base focus:ring-2 focus:ring-[#1e3a8a]/50 focus:border-[#1e3a8a] transition-all"
                  disabled={isLoading}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-600 hover:text-[#1e3a8a] hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                title="Upload file"
              >
                <Upload size={20} />
              </button>
              <button
                type="submit"
                disabled={(!inputText.trim() && uploadedFiles.length === 0) || isLoading}
                className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
                  (!inputText.trim() && uploadedFiles.length === 0) || isLoading
                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                    : 'text-white bg-[#1e3a8a] hover:bg-[#1e40af]'
                }`}
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2 ml-2">
              Hỗ trợ: PDF, Slide, Hình ảnh • Trợ lý đa năng • Câu trả lời chi tiết
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralAssistantChat;

