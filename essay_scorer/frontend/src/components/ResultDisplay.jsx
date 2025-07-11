import React from 'react';
import PropTypes from 'prop-types';

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
      
      <div className="bg-white border rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed overflow-auto max-h-96">
          {resultText}
        </pre>
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