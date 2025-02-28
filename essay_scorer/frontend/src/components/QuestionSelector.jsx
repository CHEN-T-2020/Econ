import React from 'react';
import PropTypes from 'prop-types';

const QuestionSelector = ({ exams, examId, value, onChange }) => {
  const currentExam = exams.find(e => e.id === examId);

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={!examId}
      className="question-selector"
    >
      <option value="">请选择题目</option>
      {currentExam?.questions.map(question => (
        <option key={question.id} value={question.id}>
          {/* {question.id} - {question.prompt.substring(0, 100)}... */}
          {question.id} - {question.prompt}
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