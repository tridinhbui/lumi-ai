import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageType, Sender } from '../types';
import { Copy, MoreVertical, Edit2, Trash2, Check } from 'lucide-react';
import ExhibitOne from './ExhibitOne';
import ExhibitTwo from './ExhibitTwo';

interface Props {
  message: Message;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const MessageBubble: React.FC<Props> = ({ 
  message, 
  onEdit, 
  onDelete,
  canEdit = false,
  canDelete = false 
}) => {
  const isBot = message.sender === Sender.BOT;
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Focus edit input when editing
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(
        editInputRef.current.value.length,
        editInputRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim() && editedContent !== message.content) {
      onEdit(message.id, editedContent.trim());
    }
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id);
    }
    setShowMenu(false);
  };

  const formatTime = (timestamp: number) => {
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

  return (
    <div className={`flex w-full mb-6 group ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
          isBot ? 'bg-[#1F4AA8] text-white mr-3' : 'bg-[#E6E9EF] text-[#2E2E2E] ml-3'
        }`}>
          {isBot ? 'LUMI' : 'YOU'}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className={`relative py-3 px-4 rounded-2xl text-sm md:text-base shadow-sm ${
            isBot 
              ? 'bg-white text-[#2E2E2E] border border-[#E6E9EF] rounded-tl-none' 
              : 'bg-[#1F4AA8] text-white rounded-tr-none'
          }`}>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  ref={editInputRef}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSaveEdit();
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                  className={`w-full p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1F4AA8] ${
                    isBot ? 'bg-[#F8F9FB] border border-[#E6E9EF]' : 'bg-white/10 border border-white/20 text-white'
                  }`}
                  rows={Math.min(10, editedContent.split('\n').length + 1)}
                />
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-xs rounded-lg hover:bg-black/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-xs bg-[#1F4AA8] text-white rounded-lg hover:bg-[#153A73] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
                {/* Message Actions */}
                <div className={`absolute top-2 ${isBot ? 'right-2' : 'left-2'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1`}>
                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBot 
                        ? 'hover:bg-[#F8F9FB] text-[#737373] hover:text-[#1F4AA8]' 
                        : 'hover:bg-white/20 text-white/70 hover:text-white'
                    }`}
                    title="Copy message"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* More Actions Menu */}
                  {(canEdit || canDelete) && (
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBot 
                            ? 'hover:bg-[#F8F9FB] text-[#737373] hover:text-[#1F4AA8]' 
                            : 'hover:bg-white/20 text-white/70 hover:text-white'
                        }`}
                        title="More actions"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {showMenu && (
                        <div className={`absolute ${isBot ? 'right-0' : 'left-0'} top-full mt-1 bg-white dark:bg-[#1e293b] border border-[#E6E9EF] dark:border-[#334155] rounded-lg shadow-lg z-50 min-w-[140px]`}>
                          {canEdit && (
                            <button
                              onClick={handleEdit}
                              className="w-full px-3 py-2 text-left text-sm text-[#2E2E2E] dark:text-[#e2e8f0] hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a] flex items-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={handleDelete}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a] flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Exhibits injected based on type */}
          {message.type === MessageType.EXHIBIT_1 && (
            <div className="mt-3 animate-fade-in">
              <ExhibitOne />
            </div>
          )}
          {message.type === MessageType.EXHIBIT_2 && (
            <div className="mt-3 animate-fade-in">
              <ExhibitTwo />
            </div>
          )}
          
          <span className={`text-[10px] text-[#737373] mt-1.5 ${isBot ? 'text-left' : 'text-right'}`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
