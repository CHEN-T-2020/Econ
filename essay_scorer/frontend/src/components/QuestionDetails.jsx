import React from 'react';
import PropTypes from 'prop-types';

const QuestionDetails = ({ question, showFullScheme, onToggle }) => (
  <div>
    <div className="mb-3">
      <h3 className="text-lg font-semibold mb-2">
        题目要求（{question.id}）
      </h3>
      <p className="text-primary leading-relaxed" style={{fontSize: '1.1rem', maxWidth: '900px', wordBreak: 'break-word'}}>
        {question.question}
      </p>
    </div>
    
    <div className="bg-secondary p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium">
          总分：<span className="text-primary font-bold">{question.total_marks}</span> 分
        </p>
        <button 
          onClick={onToggle} 
          className="btn btn-secondary btn-sm"
        >
          {showFullScheme ? '收起评分标准' : '展开评分标准'}
        </button>
      </div>
      
      {showFullScheme && (
        <div className="mt-3 p-3 bg-white rounded border" style={{maxHeight: '320px', overflow: 'auto'}}>
          <h4 className="font-medium mb-2">完整评分标准：</h4>
          <pre className="text-sm leading-relaxed whitespace-pre-wrap" style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
            {question.mark_scheme}
          </pre>
        </div>
      )}
    </div>
  </div>
);

QuestionDetails.propTypes = {
  question: PropTypes.object.isRequired,
  showFullScheme: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default QuestionDetails;