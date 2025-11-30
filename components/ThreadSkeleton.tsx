import React from 'react';

const ThreadSkeleton: React.FC = () => {
  return (
    <div className="mb-2 p-3 rounded-lg bg-[#F8F9FB] dark:bg-[#0f172a] animate-pulse">
      <div className="h-4 bg-[#E6E9EF] dark:bg-[#334155] rounded mb-2" style={{ width: '70%' }} />
      <div className="h-3 bg-[#E6E9EF] dark:bg-[#334155] rounded mb-1" style={{ width: '90%' }} />
      <div className="h-3 bg-[#E6E9EF] dark:bg-[#334155] rounded" style={{ width: '40%' }} />
    </div>
  );
};

export default ThreadSkeleton;

