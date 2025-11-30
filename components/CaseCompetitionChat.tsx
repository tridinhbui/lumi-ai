import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, FileText, X, ArrowLeft, MessageSquare, BarChart3, Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import SettingsMenu from './SettingsMenu';
import { startCaseChat, sendCaseMessage } from '../services/caseCompetitionService';
import { needsSummarization } from '../services/memoryService';
import { 
  createThread, getThreads, 
  saveMessage, getMessages, updateThreadTimestamp,
  deleteThread as deleteThreadService
} from '../services/supabaseService';
import MessageBubble from './MessageBubble';
import MessageSkeleton from './MessageSkeleton';
import ThreadSkeleton from './ThreadSkeleton';
import BizCaseLogo from './BizCaseLogo';
import LazyDashboard from './LazyDashboard';
import ThreadSummaryCard from './ThreadSummaryCard';
import { getThreadSummary } from '../services/threadSummarizer';
import { extractMessageMetadata, updateMessageMetadata } from '../services/messageMetadata';
import { logDatabaseStatus } from '../utils/dbHealthCheck';
import MinimalButton from './MinimalButton';
import MinimalInput from './MinimalInput';
import { useToast } from '../contexts/ToastContext';
import { notifyNewMessage } from '../utils/notifications';
import DatabaseStatus from './DatabaseStatus';
import { Message, Sender, MessageType } from '../types';

const CaseCompetitionChat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [threads, setThreads] = useState<{ id: string; name: string; messages: Message[] }[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isInitialized, setIsInitialized] = useState<Record<string, boolean>>({});
  const [showDashboard, setShowDashboard] = useState(true);
  const [dashboardWidth, setDashboardWidth] = useState(800);
  const [isResizing, setIsResizing] = useState(false);
  const [showThreadMenu, setShowThreadMenu] = useState<string | null>(null);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [newThreadName, setNewThreadName] = useState('');
  const [threadSummary, setThreadSummary] = useState<any>(null);
  const [showMobileThreads, setShowMobileThreads] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadThreads();
    // Check database health on mount
    logDatabaseStatus();
  }, [user]);

  useEffect(() => {
    if (activeThreadId && !isInitialized[activeThreadId]) {
      loadThreadMessages(activeThreadId);
    }
    // Load thread summary when thread changes
    if (activeThreadId) {
      loadThreadSummary(activeThreadId);
    }
  }, [activeThreadId]);

  const loadThreadSummary = async (threadId: string) => {
    try {
      const summary = await getThreadSummary(threadId);
      setThreadSummary(summary);
    } catch (error) {
      console.error('Error loading thread summary:', error);
    }
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  // Handle dashboard resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 400;
      const maxWidth = window.innerWidth - 400;
      setDashboardWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const loadThreads = async () => {
    if (!user?.email) return;
    
    try {
      const dbThreads = await getThreads(user.email);
      const caseThreads = dbThreads.filter(t => t.mode === 'case-competition');
      
      if (caseThreads.length === 0) {
        // Create default thread
        const threadId = await createThread(user.email, 'Case Competition 1', 'case-competition');
        const newThread = {
          id: threadId || Date.now().toString(),
          name: 'Case Competition 1',
          messages: [],
        };
        setThreads([newThread]);
        setActiveThreadId(newThread.id);
      } else {
        const formattedThreads = caseThreads.map(t => ({
          id: t.id,
          name: t.name,
          messages: [],
        }));
        setThreads(formattedThreads);
        setActiveThreadId(formattedThreads[0].id);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const loadThreadMessages = async (threadId: string) => {
    if (isInitialized[threadId]) return;
    
    setIsLoading(true);
    try {
      const messages = await getMessages(threadId);
      
      if (messages.length === 0) {
        await initializeThread(threadId);
      } else {
        setThreads(prev => prev.map(t => 
          t.id === threadId ? { ...t, messages } : t
        ));
        setIsInitialized(prev => ({ ...prev, [threadId]: true }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      await initializeThread(threadId);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeThread = async (threadId: string) => {
    setIsLoading(true);
    try {
      // Pass threadId to startCaseChat for persistent session
      const welcomeMessage = await startCaseChat(threadId);
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: welcomeMessage,
        timestamp: Date.now(),
      };
      
      const saved = await saveMessage(threadId, botMessage);
      if (!saved) {
        console.error('Failed to save welcome message:', botMessage.id);
      }
      setThreads(prev => prev.map(t => 
        t.id === threadId ? { ...t, messages: [botMessage] } : t
      ));
      setIsInitialized(prev => ({ ...prev, [threadId]: true }));
    } catch (error) {
      console.error('Error initializing thread:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewThread = async () => {
    if (!user?.email) return;
    
    const threadNumber = threads.length + 1;
    const threadId = await createThread(user.email, `Case Competition ${threadNumber}`, 'case-competition');
    const newThread = {
      id: threadId || Date.now().toString(),
      name: `Case Competition ${threadNumber}`,
      messages: [],
    };
    setThreads(prev => [...prev, newThread]);
    setActiveThreadId(newThread.id);
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!user?.email) return;
    
    try {
      const success = await deleteThreadService(threadId);
      if (success) {
        setThreads(prev => {
          const filtered = prev.filter(t => t.id !== threadId);
          if (activeThreadId === threadId && filtered.length > 0) {
            setActiveThreadId(filtered[0].id);
          } else if (filtered.length === 0) {
            setActiveThreadId(null);
          }
          return filtered;
        });
      }
      setShowThreadMenu(null);
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  const updateThreadName = async (threadId: string, newName: string) => {
    if (!newName.trim()) return;
    
    setThreads(prev => prev.map(t => 
      t.id === threadId ? { ...t, name: newName.trim() } : t
    ));
    setEditingThreadId(null);
    setNewThreadName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && uploadedFiles.length === 0) || isLoading || !activeThreadId) return;

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
      t.id === activeThreadId ? { ...t, messages: [...t.messages, userMessage] } : t
    ));
    
    // Save user message to database
    const userMessageSaved = await saveMessage(activeThreadId, userMessage);
    if (!userMessageSaved) {
      showError('Failed to save message. Please check your connection.');
      console.error('Failed to save user message:', userMessage.id);
    }
    
    // Extract and save metadata for user message
    const userMetadata = await extractMessageMetadata(userMessage);
    if (uploadedFiles.length > 0) {
      userMetadata.has_attachment = true;
      userMetadata.attachment_type = uploadedFiles.map(f => f.type).join(', ');
    }
    await updateMessageMetadata(userMessage.id, userMetadata);
    
    setIsLoading(true);

    try {
      // Pass threadId to sendCaseMessage for persistent session with context
      const response = await sendCaseMessage(userMsg, uploadedFiles, activeThreadId);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        type: MessageType.TEXT,
        content: response,
        timestamp: Date.now(),
      };

      setThreads(prev => prev.map(t => 
        t.id === activeThreadId ? { ...t, messages: [...t.messages, botMessage] } : t
      ));
      
      // Save bot message to database
      const botMessageSaved = await saveMessage(activeThreadId, botMessage);
      if (!botMessageSaved) {
        showError('Failed to save bot response. Please check your connection.');
        console.error('Failed to save bot message:', botMessage.id);
      }
      
      // Update thread timestamp
      await updateThreadTimestamp(activeThreadId);

      // Show success toast
      showSuccess('Message sent successfully');

      // Send browser notification if user is not on the page
      if (document.hidden) {
        await notifyNewMessage('Lumi', response.substring(0, 100), () => {
          window.focus();
        });
      }

      // Extract and save metadata for bot message
      const botMetadata = await extractMessageMetadata(botMessage);
      await updateMessageMetadata(botMessage.id, botMetadata);

      // Auto-summarize thread if needed (every 20 messages)
      const currentMessages = threads.find(t => t.id === activeThreadId)?.messages || [];
      if (currentMessages.length > 0 && currentMessages.length % 20 === 0) {
        try {
          const summary = await getThreadSummary(activeThreadId);
          if (summary) {
            setThreadSummary(summary);
          }
        } catch (error) {
          console.error('Error summarizing thread:', error);
        }
      }

      if (uploadedFiles.length > 0) {
        setUploadedFiles([]);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      showError(error?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeThreadId, inputText, uploadedFiles, isLoading, showSuccess, showError, threads]);

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
                <h1 className="text-sm font-semibold text-[#1F4AA8]">Case Competition</h1>
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
            <DatabaseStatus />
            {user && <SettingsMenu user={user} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mobile Threads Toggle Button */}
        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <button
            onClick={() => setShowMobileThreads(true)}
            className="p-3 bg-[#1F4AA8] text-white rounded-full shadow-lg hover:bg-[#153A73] transition-colors active:scale-95"
            title="View threads"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Threads Sidebar (Bottom Sheet) */}
        <div className={`lg:hidden fixed inset-x-0 bottom-0 bg-white dark:bg-[#1e293b] border-t border-[#E6E9EF] dark:border-[#334155] rounded-t-2xl shadow-2xl z-50 transition-transform duration-300 ${
          showMobileThreads ? 'translate-y-0' : 'translate-y-full'
        }`} style={{ maxHeight: '70vh' }}>
          <div className="p-4 border-b border-[#E6E9EF] dark:border-[#334155] flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1F4AA8] dark:text-[#4C86FF]">Threads</h3>
            <button
              onClick={() => setShowMobileThreads(false)}
              className="p-2 hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a] rounded-lg active:scale-95"
            >
              <X className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
            </button>
          </div>
          <div className="p-4 border-b border-[#E6E9EF] dark:border-[#334155]">
            <button
              onClick={createNewThread}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#1F4AA8] dark:bg-[#4C86FF] text-white rounded-lg hover:bg-[#153A73] dark:hover:bg-[#1F4AA8] transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Thread</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {threads.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-12 h-12 text-[#E6E9EF] dark:text-[#334155] mx-auto mb-3" />
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">No threads yet</p>
              </div>
            ) : (
              threads.map((t) => {
                const lastMessage = t.messages[t.messages.length - 1];
                const lastMessagePreview = lastMessage 
                  ? (lastMessage.content.length > 40 
                      ? lastMessage.content.substring(0, 40) + '...' 
                      : lastMessage.content)
                  : 'No messages yet';
                
                const formatRelativeTime = (timestamp: number) => {
                  const date = new Date(timestamp);
                  const now = new Date();
                  const diffMs = now.getTime() - date.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                  if (diffMins < 1) return 'Just now';
                  if (diffMins < 60) return `${diffMins}m`;
                  if (diffHours < 24) return `${diffHours}h`;
                  if (diffDays < 7) return `${diffDays}d`;
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                };

                const lastMessageTime = lastMessage 
                  ? formatRelativeTime(lastMessage.timestamp)
                  : '';

                return (
                  <div
                    key={t.id}
                    className={`
                      relative group mb-2 p-3 rounded-lg cursor-pointer transition-all
                      ${activeThreadId === t.id
                        ? 'bg-[#E6F0FF] dark:bg-[#153A73] border border-[#1F4AA8] dark:border-[#4C86FF]'
                        : 'bg-[#F8F9FB] dark:bg-[#0f172a] active:bg-[#E6E9EF] dark:active:bg-[#334155]'
                      }
                    `}
                    onClick={() => {
                      setActiveThreadId(t.id);
                      setShowMobileThreads(false);
                      setShowThreadMenu(null);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium truncate flex-1 ${activeThreadId === t.id ? 'text-[#1F4AA8] dark:text-[#4C86FF]' : 'text-[#2E2E2E] dark:text-[#e2e8f0]'}`}>
                        {t.name}
                      </p>
                      {lastMessageTime && (
                        <p className="text-xs text-[#737373] dark:text-[#94a3b8] ml-2 flex-shrink-0">
                          {lastMessageTime}
                        </p>
                      )}
                    </div>
                    {lastMessage && (
                      <p className={`text-xs truncate ${
                        activeThreadId === t.id 
                          ? 'text-[#153A73] dark:text-[#94a3b8]' 
                          : 'text-[#737373] dark:text-[#94a3b8]'
                      }`}>
                        {lastMessage.sender === 'user' ? 'You: ' : 'Lumi: '}
                        {lastMessagePreview}
                      </p>
                    )}
                    <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">
                      {t.messages.length} {t.messages.length === 1 ? 'message' : 'messages'}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Desktop Threads Sidebar */}
        <div className="w-64 bg-white dark:bg-[#1e293b] border-r border-[#E6E9EF] dark:border-[#334155] flex flex-col flex-shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-[#E6E9EF] dark:border-[#334155]">
            <button
              onClick={createNewThread}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#1F4AA8] dark:bg-[#4C86FF] text-white rounded-lg hover:bg-[#153A73] dark:hover:bg-[#1F4AA8] transition-colors text-sm font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Thread</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {threads.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-12 h-12 text-[#E6E9EF] dark:text-[#334155] mx-auto mb-3" />
                <p className="text-sm text-[#737373] dark:text-[#94a3b8]">No threads yet</p>
                <p className="text-xs text-[#737373] dark:text-[#94a3b8] mt-1">Create your first thread</p>
              </div>
            ) : threads.length === 0 && isLoading ? (
              <>
                <ThreadSkeleton />
                <ThreadSkeleton />
                <ThreadSkeleton />
              </>
            ) : (
              threads.map((t) => {
                const lastMessage = t.messages[t.messages.length - 1];
                const lastMessagePreview = lastMessage 
                  ? (lastMessage.content.length > 50 
                      ? lastMessage.content.substring(0, 50) + '...' 
                      : lastMessage.content)
                  : 'No messages yet';
                
                const formatRelativeTime = (timestamp: number) => {
                  const date = new Date(timestamp);
                  const now = new Date();
                  const diffMs = now.getTime() - date.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                  if (diffMins < 1) return 'Just now';
                  if (diffMins < 60) return `${diffMins}m ago`;
                  if (diffHours < 24) return `${diffHours}h ago`;
                  if (diffDays < 7) return `${diffDays}d ago`;
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                };

                const lastMessageTime = lastMessage 
                  ? formatRelativeTime(lastMessage.timestamp)
                  : '';

                return (
                  <div
                    key={t.id}
                    className={`
                      relative group mb-2 p-3 rounded-lg cursor-pointer transition-all
                      ${activeThreadId === t.id
                        ? 'bg-[#E6F0FF] dark:bg-[#153A73] border border-[#1F4AA8] dark:border-[#4C86FF]'
                        : 'bg-[#F8F9FB] dark:bg-[#0f172a] hover:bg-[#E6E9EF] dark:hover:bg-[#334155]'
                      }
                    `}
                    onClick={() => {
                      setActiveThreadId(t.id);
                      setShowThreadMenu(null);
                    }}
                  >
                    {editingThreadId === t.id ? (
                      <input
                        type="text"
                        value={newThreadName}
                        onChange={(e) => setNewThreadName(e.target.value)}
                        onBlur={() => {
                          if (newThreadName.trim()) {
                            updateThreadName(t.id, newThreadName);
                          } else {
                            setEditingThreadId(null);
                            setNewThreadName('');
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (newThreadName.trim()) {
                              updateThreadName(t.id, newThreadName);
                            }
                          } else if (e.key === 'Escape') {
                            setEditingThreadId(null);
                            setNewThreadName('');
                          }
                        }}
                        className="w-full px-2 py-1 text-sm bg-white dark:bg-[#1e293b] border border-[#1F4AA8] dark:border-[#4C86FF] rounded focus:outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium truncate flex-1 ${activeThreadId === t.id ? 'text-[#1F4AA8] dark:text-[#4C86FF]' : 'text-[#2E2E2E] dark:text-[#e2e8f0]'}`}>
                            {t.name}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowThreadMenu(showThreadMenu === t.id ? null : t.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white dark:hover:bg-[#0f172a] rounded flex-shrink-0"
                          >
                            <MoreVertical className="w-4 h-4 text-[#737373] dark:text-[#94a3b8]" />
                          </button>
                        </div>
                        
                        {/* Last Message Preview */}
                        {lastMessage && (
                          <p className={`text-xs truncate mb-1 ${
                            activeThreadId === t.id 
                              ? 'text-[#153A73] dark:text-[#94a3b8]' 
                              : 'text-[#737373] dark:text-[#94a3b8]'
                          }`}>
                            {lastMessage.sender === 'user' ? 'You: ' : 'Lumi: '}
                            {lastMessagePreview}
                          </p>
                        )}
                        
                        {/* Footer with message count and time */}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-[#737373] dark:text-[#94a3b8]">
                            {t.messages.length} {t.messages.length === 1 ? 'message' : 'messages'}
                          </p>
                          {lastMessageTime && (
                            <p className="text-xs text-[#737373] dark:text-[#94a3b8]">
                              {lastMessageTime}
                            </p>
                          )}
                        </div>

                        {showThreadMenu === t.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1e293b] border border-[#E6E9EF] dark:border-[#334155] rounded-lg shadow-lg z-50 min-w-[120px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingThreadId(t.id);
                                setNewThreadName(t.name);
                                setShowThreadMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-[#2E2E2E] dark:text-[#e2e8f0] hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a] flex items-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteThread(t.id);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a] flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className={`flex-1 flex flex-col bg-white relative overflow-hidden transition-all duration-300 ${showDashboard ? 'lg:mr-0' : ''}`}>
          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto px-6 py-8 space-y-6"
            style={{ paddingBottom: uploadedFiles.length > 0 ? '180px' : '140px' }}
          >
            {activeThread?.messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg}
                canEdit={msg.sender === Sender.USER}
                canDelete={msg.sender === Sender.USER}
                onEdit={async (messageId, newContent) => {
                  // Update message in thread
                  setThreads(prev => prev.map(t => 
                    t.id === activeThreadId 
                      ? { 
                          ...t, 
                          messages: t.messages.map(m => 
                            m.id === messageId ? { ...m, content: newContent } : m
                          )
                        }
                      : t
                  ));
                  // Message already saved to database in handleSendMessage
                }}
                onDelete={async (messageId) => {
                  // Remove message from thread
                  setThreads(prev => prev.map(t => 
                    t.id === activeThreadId 
                      ? { 
                          ...t, 
                          messages: t.messages.filter(m => m.id !== messageId)
                        }
                      : t
                  ));
                  // Thread and messages deleted via deleteThreadService
                }}
              />
            ))}
            {isLoading && <MessageSkeleton isBot={true} />}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 absolute bottom-[140px] left-0 right-0 z-20">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-3 py-2 flex-shrink-0 shadow-sm">
                    <FileText className="w-4 h-4 text-neutral-500" />
                    <span className="text-xs text-neutral-700 max-w-[150px] truncate min-w-0">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="w-full bg-white border-t border-[#E6E9EF] p-4 lg:p-6 absolute bottom-0 left-0 right-0 z-20">
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
                    placeholder="Ask about case competition, upload files to analyze..."
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
                Supports: PDF, Slides, Images • Automatic Analysis • MECE Framework
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Panel */}
        {showDashboard && (
          <>
            {/* Mobile Dashboard Overlay */}
            <div 
              className="lg:hidden fixed inset-0 bg-white dark:bg-[#1e293b] flex flex-col z-30"
            >
              <div className="p-4 border-b border-[#E6E9EF] dark:border-[#334155] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1F4AA8] dark:text-[#4C86FF]">Dashboard</h3>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="p-2 hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a] rounded-lg active:scale-95"
                >
                  <X className="w-5 h-5 text-[#737373] dark:text-[#94a3b8]" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {threadSummary && (
                  <div className="p-4 border-b border-[#E6E9EF] dark:border-[#334155]">
                    <ThreadSummaryCard summary={threadSummary} />
                  </div>
                )}
                <LazyDashboard
                  type="case"
                  messages={activeThread?.messages || []} 
                  threadName={activeThread?.name || ''}
                  uploadedFiles={uploadedFiles}
                />
              </div>
            </div>

            {/* Desktop Dashboard Panel */}
            <div 
              ref={dashboardRef}
              className="hidden lg:flex absolute lg:relative inset-0 lg:inset-auto bg-white dark:bg-[#1e293b] flex flex-col z-30 lg:z-auto"
              style={{ width: window.innerWidth >= 1024 ? `${dashboardWidth}px` : '100%' }}
            >
            {/* Resize Handle */}
            <div
              className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#1F4AA8] transition-colors z-10"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizing(true);
              }}
            />
            
            <div className="border-l border-[#E6E9EF] dark:border-[#334155] h-full flex flex-col">
              <div className="p-4 border-b border-[#E6E9EF] dark:border-[#334155] bg-[#F8F9FB] dark:bg-[#0f172a] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1F4AA8] dark:text-[#4C86FF] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analysis Dashboard
                </h3>
                <MinimalButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDashboard(false)}
                  icon={X}
                >
                  <span className="sr-only">Close</span>
                </MinimalButton>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Thread Summary */}
                {threadSummary && (
                  <div className="p-4 border-b border-[#E6E9EF] dark:border-[#334155]">
                    <ThreadSummaryCard summary={threadSummary} />
                  </div>
                )}
                {/* Dashboard */}
                <div className="flex-1 overflow-hidden">
                <LazyDashboard
                  type="case"
                  messages={activeThread?.messages || []} 
                  threadName={activeThread?.name || ''}
                  uploadedFiles={uploadedFiles}
                />
                </div>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CaseCompetitionChat;
