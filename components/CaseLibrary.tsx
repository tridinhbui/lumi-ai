import React, { useState } from 'react';
import { Search, Filter, BookOpen, Target, TrendingUp, Users, DollarSign, FileText, Clock, Star } from 'lucide-react';

interface Case {
  id: string;
  title: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  tags: string[];
  completed: boolean;
  rating: number;
}

const CaseLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const cases: Case[] = [
    {
      id: '1',
      title: 'Market Entry Strategy for E-commerce Platform',
      type: 'Market Entry',
      difficulty: 'Intermediate',
      duration: '45 min',
      description: 'Analyze market opportunities and develop entry strategy for a new e-commerce platform in Southeast Asia.',
      tags: ['Market Entry', 'Strategy', 'E-commerce'],
      completed: false,
      rating: 4.5,
    },
    {
      id: '2',
      title: 'Pricing Optimization for SaaS Company',
      type: 'Pricing',
      difficulty: 'Advanced',
      duration: '60 min',
      description: 'Determine optimal pricing strategy for a B2B SaaS product with multiple tiers and customer segments.',
      tags: ['Pricing', 'SaaS', 'Revenue'],
      completed: true,
      rating: 4.8,
    },
    {
      id: '3',
      title: 'Growth Strategy for Fintech Startup',
      type: 'Growth',
      difficulty: 'Intermediate',
      duration: '50 min',
      description: 'Develop growth strategy to scale a fintech startup from 10K to 100K users in 12 months.',
      tags: ['Growth', 'Fintech', 'Scaling'],
      completed: false,
      rating: 4.3,
    },
    {
      id: '4',
      title: 'Operations Efficiency for Logistics Company',
      type: 'Operations',
      difficulty: 'Beginner',
      duration: '40 min',
      description: 'Identify operational inefficiencies and recommend improvements for a mid-size logistics company.',
      tags: ['Operations', 'Efficiency', 'Logistics'],
      completed: true,
      rating: 4.6,
    },
    {
      id: '5',
      title: 'M&A Strategy for Healthcare Provider',
      type: 'M&A',
      difficulty: 'Advanced',
      duration: '75 min',
      description: 'Evaluate acquisition targets and develop M&A strategy for a regional healthcare provider.',
      tags: ['M&A', 'Healthcare', 'Strategy'],
      completed: false,
      rating: 4.7,
    },
    {
      id: '6',
      title: 'Digital Transformation for Retail Chain',
      type: 'Digital',
      difficulty: 'Intermediate',
      duration: '55 min',
      description: 'Design digital transformation roadmap for a traditional retail chain to compete online.',
      tags: ['Digital', 'Retail', 'Transformation'],
      completed: false,
      rating: 4.4,
    },
  ];

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || caseItem.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || caseItem.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const caseTypes = ['all', 'Market Entry', 'Pricing', 'Growth', 'Operations', 'M&A', 'Digital'];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a] flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-[#1e3a8a]" />
            Case Library
          </h2>
          <p className="text-sm text-gray-500 mt-1">Practice with real-world business cases</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{filteredCases.length}</p>
          <p className="text-xs text-gray-500">Available Cases</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by title, description, or tags..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a]/50 focus:border-[#1e3a8a] transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1e3a8a]/50 text-sm"
            >
              {caseTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/50 text-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:border-[#1e3a8a] cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
                  {caseItem.title}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(caseItem.difficulty)}`}>
                    {caseItem.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {caseItem.duration}
                  </span>
                </div>
              </div>
              {caseItem.completed && (
                <div className="bg-green-100 text-green-700 rounded-full p-1.5">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{caseItem.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {caseItem.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{caseItem.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No cases found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default CaseLibrary;

