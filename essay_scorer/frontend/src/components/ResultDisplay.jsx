import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  // 处理错误情况
  if (result.error) {
    return (
      <div className="error-banner">
        <span>❌</span>
        {result.error}
      </div>
    );
  }

  // 处理正常结果
  const resultText = result.result || result;
  
  return (
    <div className="result-content">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-green-800 mb-2">
          ✅ AI评分完成
        </h4>
        <p className="text-green-700 text-sm">
          以下是AI对您论文的详细评分和分析
        </p>
      </div>
      
      <div className="bg-white border rounded-lg p-4" style={{maxHeight: '400px', overflow: 'auto'}}>
        <ReactMarkdown
          children={resultText}
          remarkPlugins={[remarkGfm]}
          className="text-sm leading-relaxed whitespace-pre-wrap"
        />
      </div>
    </div>
  );
};

ResultDisplay.propTypes = {
  result: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

export default ResultDisplay;