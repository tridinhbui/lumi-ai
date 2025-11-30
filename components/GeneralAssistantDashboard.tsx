import React, { useState, useEffect } from 'react';
import { Message, Sender } from '../types';
import DataChartsPanel from './DataChartsPanel';
import HypothesisInsights from './HypothesisInsights';
import FinalRecommendation from './FinalRecommendation';
import PDFViewer from './PDFViewer';

interface GeneralAssistantDashboardProps {
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

const GeneralAssistantDashboard: React.FC<GeneralAssistantDashboardProps> = ({ messages, threadName, uploadedFiles = [] }) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation>({});
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    analyzeMessages();
  }, [messages]);

  const analyzeMessages = () => {
    const botMessages = messages.filter(m => m.sender === Sender.BOT);

    // Extract hypotheses from bot messages
    const newHypotheses: Hypothesis[] = [];
    botMessages.forEach((msg, index) => {
      const content = msg.content;
      // Look for key points or insights
      if (content.includes('key point') || content.includes('insight') || 
          content.includes('important') || content.includes('note')) {
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
    if (botMessages.length > 0) {
      const lastBotMessage = botMessages[botMessages.length - 1];
      const content = lastBotMessage.content;
      
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

    // Extract data for charts
    const dataMatches: any[] = [];
    botMessages.forEach(msg => {
      const content = msg.content;
      const segmentMatches = content.matchAll(/(\w+)[:\s]+(\d+)/gi);
      for (const match of segmentMatches) {
        dataMatches.push({
          name: match[1],
          value: parseInt(match[2]),
          revenue: parseInt(match[2]) * 3,
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

  return (
    <div className="h-full overflow-hidden bg-[#F8F9FB] flex flex-col">
      {/* PDF Viewer if PDF uploaded */}
      {pdfFile && (
        <div className="flex-1 min-h-0 border-b border-[#E6E9EF]">
          <PDFViewer file={pdfFile} />
        </div>
      )}

      {/* Dashboard Content */}
      <div className={`overflow-y-auto ${pdfFile ? 'h-96' : 'flex-1'} p-4 lg:p-6`}>
        <div className="space-y-4 lg:space-y-6">
          {/* Header */}
          <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg lg:text-xl font-semibold text-[#1F4AA8]">
                Assistant Dashboard
              </h2>
            </div>
            <p className="text-xs lg:text-sm text-[#737373]">Track insights and key information from your conversation</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Left Column - Hypothesis & Insights */}
            <div className="space-y-4 lg:space-y-6">
              <HypothesisInsights
                hypotheses={hypotheses}
                onAddHypothesis={handleAddHypothesis}
                onTogglePin={handleTogglePin}
                onRemove={handleRemoveHypothesis}
              />
              
              <FinalRecommendation recommendation={recommendation} />
            </div>

            {/* Right Column - Data Charts */}
            <div>
              <DataChartsPanel 
                data={chartData.length > 0 ? chartData : undefined}
                chartType="bar"
                title="Data & Charts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralAssistantDashboard;

