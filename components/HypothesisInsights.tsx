import React, { useState } from 'react';
import { Lightbulb, Pin, X } from 'lucide-react';

interface Hypothesis {
  id: string;
  text: string;
  isPinned: boolean;
  timestamp: number;
}

interface HypothesisInsightsProps {
  hypotheses?: Hypothesis[];
  onAddHypothesis?: (text: string) => void;
  onTogglePin?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const HypothesisInsights: React.FC<HypothesisInsightsProps> = ({
  hypotheses = [],
  onAddHypothesis,
  onTogglePin,
  onRemove,
}) => {
  const [newHypothesis, setNewHypothesis] = useState('');

  const handleAdd = () => {
    if (newHypothesis.trim() && onAddHypothesis) {
      onAddHypothesis(newHypothesis.trim());
      setNewHypothesis('');
    }
  };

  const pinnedHypotheses = hypotheses.filter(h => h.isPinned);
  const unpinnedHypotheses = hypotheses.filter(h => !h.isPinned);

  return (
    <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-4 lg:p-6">
      <h3 className="text-sm lg:text-base font-semibold text-[#1F4AA8] mb-3 lg:mb-4 flex items-center">
        <Lightbulb className="w-4 h-4 text-[#153A73] icon-line-art mr-2" />
        Hypothesis & Key Insights
      </h3>

      {/* Pinned Items */}
      {pinnedHypotheses.length > 0 && (
        <div className="mb-3 lg:mb-4 space-y-2">
          {pinnedHypotheses.map((hypothesis) => (
            <div
              key={hypothesis.id}
              className="bg-[#E6F0FF] border border-[#1F4AA8] rounded-lg p-3 flex items-start space-x-2"
            >
              <Pin className="w-4 h-4 text-[#1F4AA8] flex-shrink-0 mt-0.5 fill-current" />
              <p className="flex-1 text-sm text-[#2E2E2E]">{hypothesis.text}</p>
              <div className="flex items-center space-x-1">
                {onTogglePin && (
                  <button
                    onClick={() => onTogglePin(hypothesis.id)}
                    className="p-1 text-[#1F4AA8] hover:bg-[#1F4AA8]/10 rounded transition-colors"
                  >
                    <Pin className="w-3 h-3 fill-current" />
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={() => onRemove(hypothesis.id)}
                    className="p-1 text-[#737373] hover:text-[#1F4AA8] hover:bg-[#F8F9FB] rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unpinned Items */}
      {unpinnedHypotheses.length > 0 && (
        <div className="mb-3 lg:mb-4 space-y-2">
          {unpinnedHypotheses.map((hypothesis) => (
            <div
              key={hypothesis.id}
              className="bg-[#F8F9FB] border border-[#E6E9EF] rounded-lg p-3 flex items-start space-x-2"
            >
              <Lightbulb className="w-4 h-4 text-[#153A73] flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-sm text-[#2E2E2E]">{hypothesis.text}</p>
              <div className="flex items-center space-x-1">
                {onTogglePin && (
                  <button
                    onClick={() => onTogglePin(hypothesis.id)}
                    className="p-1 text-[#737373] hover:text-[#1F4AA8] hover:bg-[#F8F9FB] rounded transition-colors"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={() => onRemove(hypothesis.id)}
                    className="p-1 text-[#737373] hover:text-[#1F4AA8] hover:bg-[#F8F9FB] rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Hypothesis */}
      {onAddHypothesis && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newHypothesis}
            onChange={(e) => setNewHypothesis(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add hypothesis or insight..."
            className="flex-1 px-3 py-2 bg-[#F8F9FB] border border-[#E6E9EF] rounded-lg text-sm text-[#2E2E2E] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#E6F0FF] focus:border-[#1F4AA8] transition-all"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-[#1F4AA8] text-white rounded-lg hover:bg-[#153A73] transition-all text-sm font-medium"
          >
            Add
          </button>
        </div>
      )}

      {hypotheses.length === 0 && !onAddHypothesis && (
        <p className="text-sm text-[#737373] text-center py-4">
          No hypotheses or insights yet. They will appear here as you discuss the case.
        </p>
      )}
    </div>
  );
};

export default HypothesisInsights;

