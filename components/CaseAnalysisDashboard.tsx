import React, { useState, useEffect } from 'react';
import { 
  Target, CheckCircle2, Clock, TrendingUp, 
  BarChart3, PieChart, ArrowRight, Lightbulb,
  AlertCircle, Star, Zap, BookOpen
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Message, Sender } from '../types';

interface CaseAnalysisDashboardProps {
  messages: Message[];
  threadName: string;
}

interface CaseStage {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  score: number;
  feedback: string;
}

const CaseAnalysisDashboard: React.FC<CaseAnalysisDashboardProps> = ({ messages, threadName }) => {
  const [stages, setStages] = useState<CaseStage[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    analyzeCaseProgress();
  }, [messages]);

  const analyzeCaseProgress = () => {
    const userMessages = messages.filter(m => m.sender === Sender.USER);
    const botMessages = messages.filter(m => m.sender === Sender.BOT);
    
    // Define case stages
    const caseStages: CaseStage[] = [
      {
        name: 'Problem Definition',
        status: userMessages.length > 0 ? 'completed' : 'pending',
        score: userMessages.length > 0 ? 85 : 0,
        feedback: userMessages.length > 0 
          ? 'Đã xác định được vấn đề cần giải quyết rõ ràng'
          : 'Cần xác định vấn đề chính của case'
      },
      {
        name: 'Framework Development',
        status: userMessages.length > 1 ? 'completed' : userMessages.length > 0 ? 'in-progress' : 'pending',
        score: userMessages.length > 1 ? 78 : userMessages.length > 0 ? 45 : 0,
        feedback: userMessages.length > 1
          ? 'Đã phát triển framework phân tích phù hợp'
          : 'Đang phát triển framework phân tích'
      },
      {
        name: 'Data Analysis',
        status: userMessages.length > 2 ? 'completed' : userMessages.length > 1 ? 'in-progress' : 'pending',
        score: userMessages.length > 2 ? 82 : userMessages.length > 1 ? 50 : 0,
        feedback: userMessages.length > 2
          ? 'Phân tích dữ liệu chi tiết và logic'
          : 'Cần phân tích dữ liệu sâu hơn'
      },
      {
        name: 'Solution Development',
        status: userMessages.length > 3 ? 'completed' : userMessages.length > 2 ? 'in-progress' : 'pending',
        score: userMessages.length > 3 ? 80 : userMessages.length > 2 ? 55 : 0,
        feedback: userMessages.length > 3
          ? 'Đã đề xuất giải pháp cụ thể và khả thi'
          : 'Đang phát triển giải pháp'
      },
      {
        name: 'Recommendation',
        status: userMessages.length > 4 ? 'completed' : userMessages.length > 3 ? 'in-progress' : 'pending',
        score: userMessages.length > 4 ? 88 : userMessages.length > 3 ? 60 : 0,
        feedback: userMessages.length > 4
          ? 'Đưa ra khuyến nghị rõ ràng và có căn cứ'
          : 'Cần đưa ra khuyến nghị cuối cùng'
      }
    ];

    setStages(caseStages);
    
    // Calculate overall score
    const avgScore = caseStages.reduce((sum, stage) => sum + stage.score, 0) / caseStages.length;
    setOverallScore(Math.round(avgScore));
    
    // Find current stage
    const currentIdx = caseStages.findIndex(s => s.status === 'in-progress');
    setCurrentStage(currentIdx >= 0 ? currentIdx : caseStages.length - 1);
  };

  const stageData = stages.map((stage, idx) => ({
    name: stage.name.split(' ')[0],
    score: stage.score,
    status: stage.status
  }));

  const skillData = [
    { name: 'Structuring', value: 85, color: '#171717' },
    { name: 'Quantitative', value: 78, color: '#404040' },
    { name: 'Creativity', value: 82, color: '#525252' },
    { name: 'Communication', value: 80, color: '#737373' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-neutral-900';
      case 'in-progress': return 'bg-neutral-600';
      default: return 'bg-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-neutral-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-neutral-900">
              Case Analysis
            </h2>
            <div className="flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2 rounded-xl">
              <Star className="w-4 h-4" />
              <span className="font-semibold text-base">{overallScore}%</span>
            </div>
          </div>
          <p className="text-sm text-neutral-600">Track progress and analyze each case-solving step</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-neutral-900 mb-5 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-neutral-600" />
            Overall Progress
          </h3>
          <div className="space-y-3">
            {stages.map((stage, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getStatusColor(stage.status)} shadow-md`}>
                      {getStatusIcon(stage.status)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{stage.name}</p>
                      <p className="text-xs text-neutral-500">{stage.feedback}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-700">{stage.score}%</p>
                  </div>
                </div>
                <div className="ml-11">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        stage.status === 'completed'                       ? 'bg-neutral-900' :
                        stage.status === 'in-progress' ? 'bg-neutral-600' :
                        'bg-neutral-300'
                      }`}
                      style={{ width: `${stage.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Performance Chart */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-neutral-900 mb-5 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-neutral-600" />
            Stage Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stageData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {stageData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.status === 'completed' ? '#171717' :
                      entry.status === 'in-progress' ? '#525252' :
                      '#d4d4d4'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Breakdown */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-neutral-900 mb-5 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-neutral-600" />
            Skill Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={skillData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {skillData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Answer Analysis */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-neutral-900 mb-5 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-neutral-600" />
            Answer Analysis
          </h3>
          <div className="space-y-3">
            {messages.filter(m => m.sender === Sender.USER).slice(-3).map((msg, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-neutral-700 line-clamp-2">{msg.content.substring(0, 100)}...</p>
                  <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-neutral-200">
                    <Star className="w-3 h-3 text-neutral-600 fill-current" />
                    <span className="text-xs font-semibold text-neutral-700">{(85 - idx * 5)}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-500">
                  <CheckCircle2 className="w-3 h-3 text-neutral-600" />
                  <span>Logical and structured analysis</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-neutral-900 rounded-2xl shadow-sm p-6 text-white">
          <h3 className="text-base font-semibold mb-4 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Recommendations
          </h3>
          <ul className="space-y-2.5 text-sm text-neutral-300">
            <li className="flex items-start space-x-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Focus on deeper quantitative analysis</span>
            </li>
            <li className="flex items-start space-x-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Develop more complete MECE frameworks</span>
            </li>
            <li className="flex items-start space-x-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Provide specific and actionable solutions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaseAnalysisDashboard;

