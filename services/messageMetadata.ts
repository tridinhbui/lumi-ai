import { Message } from '../types';

export interface MessageMetadata {
  has_attachment: boolean;
  attachment_type?: string;
  frameworks_mentioned?: string[];
  charts_suggested?: string[];
  is_key_insight?: boolean;
  is_question?: boolean;
  is_decision?: boolean;
  tags?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  complexity?: 'low' | 'medium' | 'high';
}

/**
 * Extracts metadata from a message
 */
export const extractMessageMetadata = async (message: Message): Promise<MessageMetadata> => {
  const metadata: MessageMetadata = {
    has_attachment: false,
    is_key_insight: false,
    is_question: false,
    is_decision: false,
    tags: [],
  };

  const content = message.content.toLowerCase();

  // Check for attachments (this would be set by the caller if files are uploaded)
  // metadata.has_attachment = hasFiles;

  // Extract frameworks mentioned
  const frameworks: string[] = [];
  if (content.includes('mece')) frameworks.push('MECE');
  if (content.includes('porter') || content.includes("5 forces")) frameworks.push("Porter's 5 Forces");
  if (content.includes('swot')) frameworks.push('SWOT');
  if (content.includes('bcg')) frameworks.push('BCG Matrix');
  if (content.includes('value chain')) frameworks.push('Value Chain');
  if (content.includes('pestel') || content.includes('pest')) frameworks.push('PESTEL');
  if (content.includes('ansoff')) frameworks.push('Ansoff Matrix');
  if (content.includes('blue ocean')) frameworks.push('Blue Ocean Strategy');
  
  if (frameworks.length > 0) {
    metadata.frameworks_mentioned = frameworks;
  }

  // Extract chart types suggested
  const charts: string[] = [];
  if (content.includes('bar chart') || content.includes('biểu đồ cột')) charts.push('bar');
  if (content.includes('pie chart') || content.includes('biểu đồ tròn')) charts.push('pie');
  if (content.includes('line chart') || content.includes('biểu đồ đường')) charts.push('line');
  if (content.includes('scatter') || content.includes('phân tán')) charts.push('scatter');
  if (content.includes('heatmap') || content.includes('bản đồ nhiệt')) charts.push('heatmap');
  if (content.includes('matrix') || content.includes('ma trận')) charts.push('matrix');
  
  if (charts.length > 0) {
    metadata.charts_suggested = charts;
  }

  // Check if it's a key insight
  const insightKeywords = ['insight', 'key finding', 'important', 'critical', 'notable', 'điểm quan trọng', 'phát hiện'];
  if (insightKeywords.some(keyword => content.includes(keyword))) {
    metadata.is_key_insight = true;
    metadata.tags?.push('insight');
  }

  // Check if it's a question
  if (message.sender === 'user' && (content.includes('?') || content.includes('how') || content.includes('what') || content.includes('why') || content.includes('when') || content.includes('where'))) {
    metadata.is_question = true;
    metadata.tags?.push('question');
  }

  // Check if it's a decision
  const decisionKeywords = ['decide', 'decision', 'choose', 'select', 'recommend', 'quyết định', 'khuyến nghị'];
  if (decisionKeywords.some(keyword => content.includes(keyword))) {
    metadata.is_decision = true;
    metadata.tags?.push('decision');
  }

  // Determine sentiment (simple keyword-based)
  const positiveWords = ['good', 'great', 'excellent', 'positive', 'tốt', 'tuyệt vời'];
  const negativeWords = ['bad', 'poor', 'negative', 'problem', 'issue', 'xấu', 'vấn đề'];
  
  const positiveCount = positiveWords.filter(word => content.includes(word)).length;
  const negativeCount = negativeWords.filter(word => content.includes(word)).length;
  
  if (positiveCount > negativeCount) {
    metadata.sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    metadata.sentiment = 'negative';
  } else {
    metadata.sentiment = 'neutral';
  }

  // Determine complexity (based on length and structure)
  const wordCount = message.content.split(/\s+/).length;
  const hasNumbers = /\d+/.test(message.content);
  const hasMultipleSentences = message.content.split(/[.!?]/).length > 2;
  
  if (wordCount > 100 || (hasNumbers && hasMultipleSentences)) {
    metadata.complexity = 'high';
  } else if (wordCount > 50) {
    metadata.complexity = 'medium';
  } else {
    metadata.complexity = 'low';
  }

  // Add topic tags
  if (content.includes('market') || content.includes('thị trường')) {
    metadata.tags?.push('market');
  }
  if (content.includes('pricing') || content.includes('giá')) {
    metadata.tags?.push('pricing');
  }
  if (content.includes('competitor') || content.includes('đối thủ')) {
    metadata.tags?.push('competitive');
  }
  if (content.includes('financial') || content.includes('tài chính')) {
    metadata.tags?.push('financial');
  }
  if (content.includes('strategy') || content.includes('chiến lược')) {
    metadata.tags?.push('strategy');
  }

  return metadata;
};

/**
 * Updates message metadata in database
 */
export const updateMessageMetadata = async (
  messageId: string,
  metadata: MessageMetadata
): Promise<boolean> => {
  try {
    const { updateMessageMetadata: updateMetadataInDB } = await import('./supabaseService');
    return await updateMetadataInDB(messageId, metadata);
  } catch (error) {
    console.error('Error updating message metadata:', error);
    return false;
  }
};

/**
 * Gets messages by tag
 */
export const getMessagesByTag = async (
  threadId: string,
  tag: string
): Promise<Message[]> => {
  try {
    const { getMessagesByTag: getByTagFromDB } = await import('./supabaseService');
    return await getByTagFromDB(threadId, tag);
  } catch (error) {
    console.error('Error getting messages by tag:', error);
    return [];
  }
};

