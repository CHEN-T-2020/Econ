import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const ConversationPanel = ({ conversation, isLoading, onFollowUp }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onFollowUp(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-96">
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 && !isLoading && (
          <div className="text-center text-muted py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>选择知识点后，AI助手将为您提供详细解释</p>
            <p className="text-sm mt-2">您也可以继续提问相关问题</p>
          </div>
        )}
        
        {conversation.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'request' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.type === 'request' 
                ? 'bg-primary text-primary' 
                : msg.type === 'error'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-secondary border border-border-color'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                className="text-sm leading-relaxed"
              >
                {typeof msg.content === 'string' ? msg.content : ''}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary border border-border-color px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="loader"></div>
                <span className="text-sm text-muted">AI正在思考...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <div className="border-t border-border-color p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            disabled={isLoading}
            className="flex-1 form-input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="btn btn-primary"
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </form>
      </div>
    </div>
  );
};

ConversationPanel.propTypes = {
  conversation: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onFollowUp: PropTypes.func.isRequired
};

export default ConversationPanel;
