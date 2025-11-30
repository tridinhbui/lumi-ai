import React, { useState, useEffect } from 'react';
import { Message, Sender } from '../types';
import CaseMap from './CaseMap';
import ProgressTracker from './ProgressTracker';
import DataChartsPanel from './DataChartsPanel';
import HypothesisInsights from './HypothesisInsights';
import FinalRecommendation from './FinalRecommendation';
import PDFViewer from './PDFViewer';
import { LayoutDashboard, Target, BarChart3, Lightbulb, CheckCircle2 } from 'lucide-react';

interface CaseAnalysisDashboardProps {
  messages: Message[];
  threadName: string;
  uploadedFiles?: File[];
}

interface Hypothesis {
  id: string;
  text: string;
  isPinned: boolean;
  timestamp: number;
}

interface Recommendation {
  recommendation?: string;
  reasons?: string[];
  risk?: string;
  nextStep?: string;
}

const CaseAnalysisDashboard: React.FC<CaseAnalysisDashboardProps> = ({ messages, threadName, uploadedFiles = [] }) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'data' | 'insights' | 'recommendation'>('overview');

  const progressSteps = [
    { id: 'clarify', label: 'Clarify Case' },
    { id: 'structure', label: 'Structure' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'synthesis', label: 'Synthesis' },
    { id: 'next-steps', label: 'Next Steps' },
  ];

  // Analyze messages to update dashboard
  useEffect(() => {
    analyzeMessages();
  }, [messages]);

  const analyzeMessages = () => {
    const userMessages = messages.filter(m => m.sender === Sender.USER);
    const botMessages = messages.filter(m => m.sender === Sender.BOT);
    
    // Determine current step based on conversation flow
    if (userMessages.length === 0) {
      setCurrentStep(0);
    } else if (userMessages.length <= 2) {
      setCurrentStep(1);
    } else if (userMessages.length <= 5) {
      setCurrentStep(2);
    } else if (userMessages.length <= 8) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }

    // Extract active node from user messages
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (lastUserMessage) {
      const content = lastUserMessage.content.toLowerCase();
      if (content.includes('market') || content.includes('thị trường')) {
        setActiveNodeId('market');
      } else if (content.includes('customer') || content.includes('khách hàng')) {
        setActiveNodeId('customer');
      } else if (content.includes('product') || content.includes('sản phẩm')) {
        setActiveNodeId('product');
      } else if (content.includes('financial') || content.includes('tài chính')) {
        setActiveNodeId('financials');
      } else if (content.includes('risk') || content.includes('rủi ro')) {
        setActiveNodeId('risk');
      } else if (content.includes('problem') || content.includes('vấn đề')) {
        setActiveNodeId('problem');
      } else if (content.includes('recommend') || content.includes('đề xuất')) {
        setActiveNodeId('recommendation');
      }
    }

    // Extract hypotheses from bot messages
    const newHypotheses: Hypothesis[] = [];
    botMessages.forEach((msg, index) => {
      const content = msg.content;
      // Look for hypothesis patterns
      if (content.includes('giả thuyết') || content.includes('hypothesis') || 
          content.includes('insight') || content.includes('key point')) {
        const lines = content.split('\n').filter(line => 
          line.includes('•') || line.includes('-') || line.match(/^\d+\./)
        );
        lines.forEach((line, lineIndex) => {
          const cleanLine = line.replace(/^[•\-\d+\.]\s*/, '').trim();
          if (cleanLine.length > 10) {
            newHypotheses.push({
              id: `hyp-${index}-${lineIndex}`,
              text: cleanLine,
              isPinned: false,
              timestamp: msg.timestamp,
            });
          }
        });
      }
    });
    if (newHypotheses.length > 0) {
      setHypotheses(prev => {
        const existing = prev.map(h => h.id);
        const toAdd = newHypotheses.filter(h => !existing.includes(h.id));
        return [...prev, ...toAdd];
      });
    }

    // Extract recommendation from final messages
    if (botMessages.length > 0 && currentStep >= 3) {
      const lastBotMessage = botMessages[botMessages.length - 1];
      const content = lastBotMessage.content;
      
      // Try to extract structured recommendation
      const recMatch = content.match(/recommendation[:\s]+([^\n]+)/i);
      const reasonsMatch = content.match(/reason[s]?[:\s]+([^\n]+)/i);
      const riskMatch = content.match(/risk[s]?[:\s]+([^\n]+)/i);
      const nextStepMatch = content.match(/next step[s]?[:\s]+([^\n]+)/i);

      setRecommendation({
        recommendation: recMatch ? recMatch[1] : undefined,
        reasons: reasonsMatch ? [reasonsMatch[1]] : undefined,
        risk: riskMatch ? riskMatch[1] : undefined,
        nextStep: nextStepMatch ? nextStepMatch[1] : undefined,
      });
    }

    // Extract data for charts (look for numbers and segments)
    const dataMatches: any[] = [];
    botMessages.forEach(msg => {
      const content = msg.content;
      // Look for patterns like "Segment A: 400, Segment B: 300"
      const segmentMatches = content.matchAll(/(\w+)\s*(?:segment|market|product)?[:\s]+(\d+)/gi);
      for (const match of segmentMatches) {
        dataMatches.push({
          name: match[1],
          value: parseInt(match[2]),
          revenue: parseInt(match[2]) * 3, // Estimate
        });
      }
    });
    if (dataMatches.length > 0) {
      setChartData(dataMatches.slice(0, 4));
    }
  };

  const handleAddHypothesis = (text: string) => {
    const newHypothesis: Hypothesis = {
      id: `hyp-${Date.now()}`,
      text,
      isPinned: false,
      timestamp: Date.now(),
    };
    setHypotheses(prev => [...prev, newHypothesis]);
  };

  const handleTogglePin = (id: string) => {
    setHypotheses(prev =>
      prev.map(h => (h.id === id ? { ...h, isPinned: !h.isPinned } : h))
    );
  };

  const handleRemoveHypothesis = (id: string) => {
    setHypotheses(prev => prev.filter(h => h.id !== id));
  };

  const pdfFile = uploadedFiles.find(file => file.type === 'application/pdf');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'progress', label: 'Progress', icon: Target },
    { id: 'data', label: 'Data & Charts', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'recommendation', label: 'Recommendation', icon: CheckCircle2 },
  ];

  return (
    <div className="h-full overflow-hidden bg-[#F8F9FB] dark:bg-[#0f172a] flex flex-col">
      {/* PDF Viewer if PDF uploaded */}
      {pdfFile && (
        <div className="flex-1 min-h-0 border-b border-[#E6E9EF] dark:border-[#334155]">
          <PDFViewer file={pdfFile} />
        </div>
      )}

      {/* Dashboard Content with Tabs */}
      <div className={`overflow-hidden flex flex-col ${pdfFile ? 'h-96' : 'flex-1'}`}>
        {/* Header with Tabs */}
        <div className="bg-white dark:bg-[#1e293b] border-b border-[#E6E9EF] dark:border-[#334155] px-4 lg:px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg lg:text-xl font-semibold text-[#1F4AA8] dark:text-[#4C86FF]">
                Case Analysis Dashboard
              </h2>
              <p className="text-xs lg:text-sm text-[#737373] dark:text-[#94a3b8] mt-1">
                Track progress and analyze each case-solving step
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-[#1F4AA8] dark:bg-[#4C86FF] text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl">
              <span className="font-semibold text-sm lg:text-base">{Math.min(100, (currentStep + 1) * 20)}%</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap
                    ${isActive
                      ? 'bg-[#F8F9FB] dark:bg-[#0f172a] text-[#1F4AA8] dark:text-[#4C86FF] border-b-2 border-[#1F4AA8] dark:border-[#4C86FF]'
                      : 'text-[#737373] dark:text-[#94a3b8] hover:text-[#1F4AA8] dark:hover:text-[#4C86FF] hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <CaseMap 
                activeNodeId={activeNodeId} 
                onNodeClick={(nodeId) => setActiveNodeId(nodeId)}
              />
              <ProgressTracker steps={progressSteps.map((step, index) => ({
                ...step,
                status: index <= currentStep ? (index === currentStep ? 'in-progress' : 'completed') : 'pending'
              }))} currentStep={currentStep} />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-4 lg:space-y-6">
              <ProgressTracker steps={progressSteps.map((step, index) => ({
                ...step,
                status: index <= currentStep ? (index === currentStep ? 'in-progress' : 'completed') : 'pending'
              }))} currentStep={currentStep} />
              <CaseMap 
                activeNodeId={activeNodeId} 
                onNodeClick={(nodeId) => setActiveNodeId(nodeId)}
              />
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4 lg:space-y-6">
              <DataChartsPanel 
                data={chartData.length > 0 ? chartData : undefined}
                chartType="bar"
                title="Data & Charts"
              />
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4 lg:space-y-6">
              <HypothesisInsights
                hypotheses={hypotheses}
                onAddHypothesis={handleAddHypothesis}
                onTogglePin={handleTogglePin}
                onRemove={handleRemoveHypothesis}
              />
            </div>
          )}

          {activeTab === 'recommendation' && (
            <div className="space-y-4 lg:space-y-6">
              <FinalRecommendation recommendation={recommendation} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseAnalysisDashboard;
