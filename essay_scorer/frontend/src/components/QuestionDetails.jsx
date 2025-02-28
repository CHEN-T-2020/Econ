import React from 'react';
import PropTypes from 'prop-types';

const QuestionDetails = ({ question, showFullScheme, onToggle }) => (
  <div className="question-info">
    <h3>题目要求（{question.id}）</h3>
    <p className="prompt">{question.prompt}</p>
    <div className="requirement-box">
      <p>总分：{question.total_marks} 分</p>
      <button onClick={onToggle} className="toggle-btn">
        {showFullScheme ? '收起完整评分标准' : '展开完整评分标准'}
      </button>
      {showFullScheme && (
        <pre className="full-mark-scheme">
          {question.fullMarkScheme}
        </pre>
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