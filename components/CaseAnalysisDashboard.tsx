import React, { useState, useEffect } from 'react';
import { Message, Sender } from '../types';
import CaseMap from './CaseMap';
import ProgressTracker from './ProgressTracker';
import DataChartsPanel from './DataChartsPanel';
import HypothesisInsights from './HypothesisInsights';
import FinalRecommendation from './FinalRecommendation';

interface CaseAnalysisDashboardProps {
  messages: Message[];
  threadName: string;
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

const CaseAnalysisDashboard: React.FC<CaseAnalysisDashboardProps> = ({ messages, threadName }) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation>({});
  const [chartData, setChartData] = useState<any[]>([]);

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

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FB] p-4 lg:p-6">
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-[#1F4AA8]">
              Case Analysis Dashboard
            </h2>
            <div className="flex items-center space-x-2 bg-[#1F4AA8] text-white px-4 py-2 rounded-xl">
              <span className="font-semibold text-base">{Math.min(100, (currentStep + 1) * 20)}%</span>
            </div>
          </div>
          <p className="text-sm text-[#737373]">Track progress and analyze each case-solving step</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Case Map */}
          <div className="lg:col-span-1 xl:col-span-1">
            <CaseMap 
              activeNodeId={activeNodeId} 
              onNodeClick={(nodeId) => setActiveNodeId(nodeId)}
            />
          </div>

          {/* Middle Column - Progress & Hypothesis */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-4 lg:space-y-6">
            <ProgressTracker steps={progressSteps.map((step, index) => ({
              ...step,
              status: index <= currentStep ? (index === currentStep ? 'in-progress' : 'completed') : 'pending'
            }))} currentStep={currentStep} />
            
            <HypothesisInsights
              hypotheses={hypotheses}
              onAddHypothesis={handleAddHypothesis}
              onTogglePin={handleTogglePin}
              onRemove={handleRemoveHypothesis}
            />
          </div>

          {/* Right Column - Data Charts & Recommendation */}
          <div className="lg:col-span-2 xl:col-span-1 space-y-4 lg:space-y-6">
            <DataChartsPanel 
              data={chartData.length > 0 ? chartData : undefined}
              chartType="bar"
              title="Data & Charts"
            />
            
            <FinalRecommendation recommendation={recommendation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseAnalysisDashboard;
