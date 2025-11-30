import React from 'react';
import { FileText, Lightbulb, CheckCircle2, TrendingUp, BookOpen, Calendar } from 'lucide-react';
import { ThreadSummary } from '../services/threadSummarizer';

interface ThreadSummaryCardProps {
  summary: ThreadSummary;
  className?: string;
}

const ThreadSummaryCard: React.FC<ThreadSummaryCardProps> = ({ summary, className = '' }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white dark:bg-[#1e293b] border border-[#E6E9EF] dark:border-[#334155] rounded-2xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1F4AA8] dark:text-[#4C86FF] flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Thread Summary
        </h3>
        <div className="flex items-center space-x-2 text-xs text-[#737373] dark:text-[#94a3b8]">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(summary.last_summarized_at)}</span>
        </div>
      </div>

      {/* Key Topics */}
      {summary.key_topics && summary.key_topics.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <BookOpen className="w-4 h-4 text-[#1F4AA8] dark:text-[#4C86FF] mr-2" />
            <h4 className="text-sm font-semibold text-[#2E2E2E] dark:text-[#e2e8f0]">Key Topics</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.key_topics.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#E6F0FF] dark:bg-[#153A73] text-[#1F4AA8] dark:text-[#4C86FF] rounded-lg text-xs font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Insights */}
      {summary.main_insights && summary.main_insights.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Lightbulb className="w-4 h-4 text-[#FFD700] mr-2" />
            <h4 className="text-sm font-semibold text-[#2E2E2E] dark:text-[#e2e8f0]">Main Insights</h4>
          </div>
          <ul className="space-y-1">
            {summary.main_insights.slice(0, 3).map((insight, index) => (
              <li key={index} className="text-sm text-[#737373] dark:text-[#94a3b8] flex items-start">
                <span className="mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Decisions Made */}
      {summary.decisions_made && summary.decisions_made.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] dark:text-[#34D399] mr-2" />
            <h4 className="text-sm font-semibold text-[#2E2E2E] dark:text-[#e2e8f0]">Decisions Made</h4>
          </div>
          <ul className="space-y-1">
            {summary.decisions_made.slice(0, 3).map((decision, index) => (
              <li key={index} className="text-sm text-[#737373] dark:text-[#94a3b8] flex items-start">
                <span className="mr-2">•</span>
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Frameworks Used */}
      {summary.frameworks_used && summary.frameworks_used.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-[#1F4AA8] dark:text-[#4C86FF] mr-2" />
            <h4 className="text-sm font-semibold text-[#2E2E2E] dark:text-[#e2e8f0]">Frameworks Used</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.frameworks_used.map((framework, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#F8F9FB] dark:bg-[#0f172a] border border-[#E6E9EF] dark:border-[#334155] text-[#2E2E2E] dark:text-[#e2e8f0] rounded-lg text-xs"
              >
                {framework}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Important Facts */}
      {summary.important_facts && Object.keys(summary.important_facts).length > 0 && (
        <div className="pt-4 border-t border-[#E6E9EF] dark:border-[#334155]">
          <h4 className="text-sm font-semibold text-[#2E2E2E] dark:text-[#e2e8f0] mb-2">Key Facts</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(summary.important_facts).slice(0, 4).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-[#737373] dark:text-[#94a3b8]">{key.replace(/_/g, ' ')}:</span>
                <span className="ml-1 text-[#2E2E2E] dark:text-[#e2e8f0] font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Count */}
      <div className="mt-4 pt-4 border-t border-[#E6E9EF] dark:border-[#334155] text-xs text-[#737373] dark:text-[#94a3b8]">
        {summary.message_count} messages in this thread
      </div>
    </div>
  );
};

export default ThreadSummaryCard;

