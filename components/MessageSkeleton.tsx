import React from 'react';

interface MessageSkeletonProps {
  isBot?: boolean;
}

const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ isBot = true }) => {
  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar Skeleton */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-[#E6E9EF] dark:bg-[#334155] animate-pulse mr-3 ${isBot ? '' : 'ml-3'}`} />
        
        {/* Content Skeleton */}
        <div className="flex flex-col flex-1">
          <div className={`py-3 px-4 rounded-2xl ${
            isBot 
              ? 'bg-white border border-[#E6E9EF] rounded-tl-none' 
              : 'bg-[#1F4AA8] rounded-tr-none'
          }`}>
            <div className="space-y-2">
              <div className="h-4 bg-[#E6E9EF] dark:bg-[#334155] rounded animate-pulse" style={{ width: '100%' }} />
              <div className="h-4 bg-[#E6E9EF] dark:bg-[#334155] rounded animate-pulse" style={{ width: '85%' }} />
              <div className="h-4 bg-[#E6E9EF] dark:bg-[#334155] rounded animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
          <div className={`h-3 w-16 bg-[#E6E9EF] dark:bg-[#334155] rounded mt-1.5 animate-pulse ${isBot ? 'self-start' : 'self-end'}`} />
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;

