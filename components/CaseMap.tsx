import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface CaseNode {
  id: string;
  label: string;
  subItems?: CaseNode[];
  isActive?: boolean;
}

interface CaseMapProps {
  activeNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
}

const CaseMap: React.FC<CaseMapProps> = ({ activeNodeId, onNodeClick }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['problem']));

  const caseNodes: CaseNode[] = [
    {
      id: 'problem',
      label: 'Problem',
      subItems: [
        { id: 'problem-definition', label: 'Problem Definition' },
        { id: 'problem-scope', label: 'Problem Scope' },
        { id: 'key-questions', label: 'Key Questions' },
      ],
    },
    {
      id: 'market',
      label: 'Market',
      subItems: [
        { id: 'market-size', label: 'Market Size' },
        { id: 'market-growth', label: 'Market Growth' },
        { id: 'market-segments', label: 'Market Segments' },
        { id: 'market-trends', label: 'Market Trends' },
      ],
    },
    {
      id: 'customer',
      label: 'Customer',
      subItems: [
        { id: 'customer-segments', label: 'Customer Segments' },
        { id: 'customer-needs', label: 'Customer Needs' },
        { id: 'customer-behavior', label: 'Customer Behavior' },
        { id: 'customer-value', label: 'Customer Value' },
      ],
    },
    {
      id: 'product',
      label: 'Product',
      subItems: [
        { id: 'product-features', label: 'Product Features' },
        { id: 'product-positioning', label: 'Product Positioning' },
        { id: 'product-pricing', label: 'Product Pricing' },
        { id: 'product-margin', label: 'Product Margin' },
      ],
    },
    {
      id: 'financials',
      label: 'Financials',
      subItems: [
        { id: 'revenue', label: 'Revenue' },
        { id: 'costs', label: 'Costs' },
        { id: 'profitability', label: 'Profitability' },
        { id: 'investment', label: 'Investment' },
      ],
    },
    {
      id: 'risk',
      label: 'Risk',
      subItems: [
        { id: 'market-risk', label: 'Market Risk' },
        { id: 'operational-risk', label: 'Operational Risk' },
        { id: 'financial-risk', label: 'Financial Risk' },
        { id: 'competitive-risk', label: 'Competitive Risk' },
      ],
    },
    {
      id: 'recommendation',
      label: 'Recommendation',
      subItems: [
        { id: 'recommendation-option', label: 'Recommendation Option' },
        { id: 'rationale', label: 'Rationale' },
        { id: 'implementation', label: 'Implementation' },
        { id: 'next-steps', label: 'Next Steps' },
      ],
    },
  ];

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
  };

  const renderNode = (node: CaseNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isActive = activeNodeId === node.id || activeNodeId?.startsWith(node.id);
    const hasSubItems = node.subItems && node.subItems.length > 0;

    return (
      <div key={node.id} className="mb-1">
        <div
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150
            ${isActive 
              ? 'bg-[#E6F0FF] border border-[#1F4AA8] text-[#1F4AA8] font-semibold' 
              : 'hover:bg-[#F8F9FB] text-[#2E2E2E]'
            }
          `}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            if (hasSubItems) {
              toggleNode(node.id);
            }
            handleNodeClick(node.id);
          }}
        >
          {hasSubItems && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
          {!hasSubItems && <div className="w-4 h-4" />}
          <span className="text-sm">{node.label}</span>
          {isActive && (
            <div className="ml-auto w-2 h-2 bg-[#1F4AA8] rounded-full animate-pulse" />
          )}
        </div>
        {hasSubItems && isExpanded && (
          <div className="mt-1">
            {node.subItems?.map((subItem) => renderNode(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#E6E9EF] rounded-2xl shadow-sm p-6 h-full overflow-y-auto">
      <h3 className="text-base font-semibold text-[#1F4AA8] mb-4 flex items-center">
        <div className="w-2 h-2 bg-[#153A73] rounded-full mr-2" />
        Case Map
      </h3>
      <div className="space-y-1">
        {caseNodes.map((node) => renderNode(node))}
      </div>
    </div>
  );
};

export default CaseMap;

