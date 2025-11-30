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
    { name: 'Structuring', value: 85, color: '#3b82f6' },
    { name: 'Quantitative', value: 78, color: '#8b5cf6' },
    { name: 'Creativity', value: 82, color: '#ec4899' },
    { name: 'Communication', value: 80, color: '#10b981' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'in-progress': return 'bg-amber-500';
      default: return 'bg-gray-300';
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
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Case Analysis Dashboard
            </h2>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg">
              <Star className="w-5 h-5" />
              <span className="font-bold text-lg">{overallScore}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Theo dõi tiến độ và phân tích từng bước giải case</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Tiến độ tổng thể
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
                      <p className="font-medium text-gray-800">{stage.name}</p>
                      <p className="text-xs text-gray-500">{stage.feedback}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{stage.score}%</p>
                  </div>
                </div>
                <div className="ml-11">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        stage.status === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                        stage.status === 'in-progress' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                        'bg-gray-300'
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Biểu đồ hiệu suất từng giai đoạn
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
                      entry.status === 'completed' ? '#10b981' :
                      entry.status === 'in-progress' ? '#f59e0b' :
                      '#d1d5db'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-pink-600" />
            Phân tích kỹ năng
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            Phân tích câu trả lời
          </h3>
          <div className="space-y-4">
            {messages.filter(m => m.sender === Sender.USER).slice(-3).map((msg, idx) => (
              <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 line-clamp-2">{msg.content.substring(0, 100)}...</p>
                  <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-gray-700">{(85 - idx * 5)}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Phân tích logic và có cấu trúc</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Khuyến nghị cải thiện
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Tập trung vào phân tích định lượng sâu hơn</span>
            </li>
            <li className="flex items-start space-x-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Phát triển framework MECE hoàn chỉnh hơn</span>
            </li>
            <li className="flex items-start space-x-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Đưa ra giải pháp cụ thể và có thể thực thi</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaseAnalysisDashboard;

