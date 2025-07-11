import React from 'react';
import PropTypes from 'prop-types';

const ExamSelector = ({ exams, value, onChange }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="form-select"
  >
    <option value="">请选择考试场次</option>
    {exams.map(exam => (
      <option key={exam.id} value={exam.id}>
        {exam.name}
      </option>
    ))}
  </select>
);

ExamSelector.propTypes = {
  exams: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ExamSelector;