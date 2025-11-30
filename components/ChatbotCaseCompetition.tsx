import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, X, LogOut, ArrowLeft, Brain, BarChart3, LayoutGrid, File } from 'lucide-react';
import { startCaseChat, sendCaseMessage, extractInsightsFromText } from '../services/caseCompetitionService';
import CaseCompetitionDashboard, { DashboardData } from './CaseCompetitionDashboard';
import PDFViewer from './PDFViewer';
import MessageBubble from './MessageBubble';
import { Message, Sender, MessageType } from '../types';

const ChatbotCaseCompetition: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [rightPanelView, setRightPanelView] = useState<'dashboard' | 'pdf'>('dashboard');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isInitialized) {
      initializeChat();
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const initializeChat = async () => {
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
      setMessages([botMessage]);
    } catch (error: any) {
      console.error('Error initializing chat:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: `Error: ${error?.message || 'Failed to initialize chat. Please check your API key in .env.local file.'}`,
        timestamp: Date.now(),
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    
    // Check for PDF files and set as selected PDF
    const pdfFiles = files.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      setSelectedPDF(pdfFiles[0]);
      setRightPanelView('pdf');
    }
    
    // Process files and extract insights
    files.forEach(async (file) => {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        // In production, you'd extract text from PDF/images here
        // For now, we'll just show the file name
        const fileContent = `File uploaded: ${file.name}`;
        try {
          const insights = await extractInsightsFromText(fileContent);
          if (insights.insights && insights.insights.length > 0) {
            setDashboardData((prev) => ({
              ...prev,
              insights: [...(prev?.insights || []), ...insights.insights],
              frameworks: insights.suggestedFrameworks || prev?.frameworks,
            }));
          }
        } catch (error) {
          console.error('Error extracting insights:', error);
        }
      }
    });
  };

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    
    // If removing the selected PDF, clear it
    if (selectedPDF && fileToRemove === selectedPDF) {
      setSelectedPDF(null);
      setRightPanelView('dashboard');
    }
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

    setMessages((prev) => [...prev, userMessage]);
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
      
      setMessages((prev) => [...prev, botMessage]);
      
      // Clear uploaded files after sending
      if (uploadedFiles.length > 0) {
        setUploadedFiles([]);
      }
      
      // Try to extract and update dashboard data from response
      updateDashboardFromResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDashboardFromResponse = (response: string) => {
    // Simple parsing to extract insights and suggestions
    // In production, you'd want more sophisticated parsing
    const insights: string[] = [];
    const frameworks: string[] = [];
    
    // Look for bullet points or numbered lists
    const lines = response.split('\n');
    lines.forEach((line) => {
      if (line.match(/^[-•*]\s/) || line.match(/^\d+\.\s/)) {
        insights.push(line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '').trim());
      }
      if (line.toLowerCase().includes('framework') || line.toLowerCase().includes('mcee')) {
        frameworks.push(line);
      }
    });
    
    if (insights.length > 0 || frameworks.length > 0) {
      setDashboardData((prev) => ({
        ...prev,
        insights: [...(prev?.insights || []), ...insights],
        frameworks: [...(prev?.frameworks || []), ...frameworks],
      }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 z-30 h-16 flex-shrink-0">
        <div className="w-full h-full px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <Brain className="w-6 h-6 text-green-600" />
              <h1 className="font-semibold text-lg tracking-tight text-gray-900">Lumi</h1>
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Strategic AI Assistant</p>
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
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="flex-1 lg:w-1/2 flex flex-col bg-white border-r border-gray-200 relative">
          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6"
            style={{ paddingBottom: '180px' }}
          >
            {messages.map((msg) => (
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
                    placeholder="Nhập câu hỏi về case, upload slide/PDF để phân tích..."
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

        {/* Right Panel - Dashboard or PDF Viewer */}
        <aside className="hidden lg:flex lg:w-1/2 h-full z-20 shadow-xl bg-white border-l border-gray-200 flex-col">
          {/* Panel Header with Tabs */}
          <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRightPanelView('dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                  rightPanelView === 'dashboard'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 size={16} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setRightPanelView('pdf')}
                disabled={!selectedPDF}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                  rightPanelView === 'pdf'
                    ? 'bg-green-100 text-green-700'
                    : selectedPDF
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <File size={16} />
                <span>PDF Viewer</span>
                {selectedPDF && (
                  <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                    {uploadedFiles.filter(f => f.type === 'application/pdf').length}
                  </span>
                )}
              </button>
            </div>
            {selectedPDF && rightPanelView === 'pdf' && (
              <button
                onClick={() => {
                  setSelectedPDF(null);
                  setRightPanelView('dashboard');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded"
                title="Close PDF"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {rightPanelView === 'dashboard' ? (
              <CaseCompetitionDashboard data={dashboardData} />
            ) : (
              <div className="h-full p-4">
                <PDFViewer file={selectedPDF} />
              </div>
            )}
          </div>
        </aside>

        {/* Mobile PDF Viewer Overlay */}
        {selectedPDF && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full h-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">PDF Viewer</h3>
                <button
                  onClick={() => {
                    setSelectedPDF(null);
                    setRightPanelView('dashboard');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <PDFViewer file={selectedPDF} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotCaseCompetition;

