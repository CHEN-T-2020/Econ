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
    <div className="conversation-panel">
      <div className="messages">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeKatex]}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="message response loading">
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="question-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入追问内容..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </div>
  );
};

export default ConversationPanel;