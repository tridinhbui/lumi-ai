import React from 'react';
import { Message, MessageType, Sender } from '../types';
import ExhibitOne from './ExhibitOne';
import ExhibitTwo from './ExhibitTwo';

interface Props {
  message: Message;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  const isBot = message.sender === Sender.BOT;

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
          isBot ? 'bg-[#1F4AA8] text-white mr-3' : 'bg-[#E6E9EF] text-[#2E2E2E] ml-3'
        }`}>
          {isBot ? 'LUMI' : 'YOU'}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className={`py-3 px-4 rounded-2xl text-sm md:text-base shadow-sm ${
            isBot 
              ? 'bg-white text-[#2E2E2E] border border-[#E6E9EF] rounded-tl-none' 
              : 'bg-[#1F4AA8] text-white rounded-tr-none'
          }`}>
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>

          {/* Exhibits injected based on type */}
          {message.type === MessageType.EXHIBIT_1 && (
            <div className="mt-3 animate-fade-in">
              <ExhibitOne />
            </div>
          )}
          {message.type === MessageType.EXHIBIT_2 && (
            <div className="mt-3 animate-fade-in">
              <ExhibitTwo />
            </div>
          )}
          
          <span className={`text-[10px] text-[#737373] mt-1.5 ${isBot ? 'text-left' : 'text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
