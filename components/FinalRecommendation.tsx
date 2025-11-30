import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, Edit2 } from 'lucide-react';

interface Recommendation {
  recommendation?: string;
  reasons?: string[];
  risk?: string;
  nextStep?: string;
}

interface FinalRecommendationProps {
  recommendation?: Recommendation;
  onEdit?: () => void;
}

const FinalRecommendation: React.FC<FinalRecommendationProps> = ({ 
  recommendation,
  onEdit 
}) => {
  const hasContent = recommendation && (
    recommendation.recommendation ||
    (recommendation.reasons && recommendation.reasons.length > 0) ||
    recommendation.risk ||
    recommendation.nextStep
  );

  return (
    <div className="bg-[#1F4AA8] text-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Final Recommendation
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {hasContent ? (
        <div className="space-y-4">
          {/* Recommendation */}
          {recommendation.recommendation && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-sm font-semibold">Recommendation</h4>
              </div>
              <p className="text-sm text-white/90 ml-6">{recommendation.recommendation}</p>
            </div>
          )}

          {/* Reasons */}
          {recommendation.reasons && recommendation.reasons.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <ArrowRight className="w-4 h-4" />
                <h4 className="text-sm font-semibold">Key Reasons</h4>
              </div>
              <ul className="space-y-1 ml-6">
                {recommendation.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-white/90 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk */}
          {recommendation.risk && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-sm font-semibold">Key Risk</h4>
              </div>
              <p className="text-sm text-white/90 ml-6">{recommendation.risk}</p>
            </div>
          )}

          {/* Next Step */}
          {recommendation.nextStep && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <ArrowRight className="w-4 h-4" />
                <h4 className="text-sm font-semibold">Next Step</h4>
              </div>
              <p className="text-sm text-white/90 ml-6">{recommendation.nextStep}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-white/70 mb-2">
            Final recommendation will appear here as you progress through the case.
          </p>
          <p className="text-xs text-white/50">
            The system will automatically populate this section based on your discussion.
          </p>
        </div>
      )}
    </div>
  );
};

export default FinalRecommendation;

