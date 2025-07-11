import React from 'react';
import PropTypes from 'prop-types';

const QuestionSelector = ({ exams, examId, value, onChange }) => {
  const currentExam = exams.find(e => e.id === examId);

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={!examId}
      className="form-select question-select"
      style={{ minWidth: '420px', fontSize: '1rem', lineHeight: '1.5', padding: '0.75rem 1rem' }}
    >
      <option value="">请选择题目</option>
      {currentExam?.questions.map(question => (
        <option key={question.id} value={question.id} title={question.question} style={{whiteSpace: 'normal'}}>
          {question.id} - {question.question}
        </option>
      ))}
    </select>
  );
};

QuestionSelector.propTypes = {
  exams: PropTypes.array.isRequired,
  examId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default QuestionSelector;