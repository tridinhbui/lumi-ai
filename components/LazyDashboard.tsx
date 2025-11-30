import React, { lazy, Suspense } from 'react';
import { Message } from '../types';
import MessageSkeleton from './MessageSkeleton';

// Lazy load dashboard components
const CaseAnalysisDashboard = lazy(() => import('./CaseAnalysisDashboard'));
const GeneralAssistantDashboard = lazy(() => import('./GeneralAssistantDashboard'));

interface LazyDashboardProps {
  type: 'case' | 'general';
  messages: Message[];
  threadName: string;
  uploadedFiles?: File[];
}

const LazyDashboard: React.FC<LazyDashboardProps> = ({ type, messages, threadName, uploadedFiles = [] }) => {
  const DashboardComponent = type === 'case' ? CaseAnalysisDashboard : GeneralAssistantDashboard;

  return (
    <Suspense
      fallback={
        <div className="flex-1 overflow-hidden flex flex-col p-4 lg:p-6">
          <div className="space-y-4">
            <div className="h-8 bg-[#E6E9EF] dark:bg-[#334155] rounded animate-pulse" style={{ width: '40%' }} />
            <div className="h-64 bg-[#E6E9EF] dark:bg-[#334155] rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-[#E6E9EF] dark:bg-[#334155] rounded animate-pulse" />
              <div className="h-32 bg-[#E6E9EF] dark:bg-[#334155] rounded animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <DashboardComponent 
        messages={messages} 
        threadName={threadName}
        uploadedFiles={uploadedFiles}
      />
    </Suspense>
  );
};

export default LazyDashboard;

