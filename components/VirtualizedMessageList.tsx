import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import MessageSkeleton from './MessageSkeleton';

interface VirtualizedMessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
}

const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  isLoading = false,
  onEdit,
  onDelete,
  className = '',
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length + (isLoading ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height per message
    overscan: 5, // Render 5 extra items outside viewport
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && parentRef.current) {
      const scrollToBottom = () => {
        if (parentRef.current) {
          parentRef.current.scrollTop = parentRef.current.scrollHeight;
        }
      };
      
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(scrollToBottom, 100);
      });
    }
  }, [messages.length]);

  return (
    <div
      ref={parentRef}
      className={`flex-1 overflow-auto ${className}`}
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const index = virtualItem.index;
          
          // Show loading skeleton if it's the last item and loading
          if (index === messages.length && isLoading) {
            return (
              <div
                key="loading"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <MessageSkeleton isBot={true} />
              </div>
            );
          }

          const message = messages[index];
          if (!message) return null;

          return (
            <div
              key={message.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              data-index={index}
              ref={virtualizer.measureElement}
            >
              <MessageBubble
                message={message}
                canEdit={message.sender === 'user'}
                canDelete={message.sender === 'user'}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedMessageList;

