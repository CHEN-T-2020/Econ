import React from 'react';
import PropTypes from 'prop-types';

const ConceptSelector = ({ concepts, selectedConcept, onSelect, onExplain }) => (
  <div className="concept-selector">
    <select
      value={selectedConcept}
      onChange={(e) => onSelect(e.target.value)}
      className="concept-select"
    >
      <option value="">-- 选择知识点 --</option>
      {concepts.map(concept => (
        <option key={concept} value={concept}>{concept}</option>
      ))}
    </select>
    <button 
      onClick={onExplain}
      disabled={!selectedConcept}
      className="explain-btn"
    >
      解释
    </button>
  </div>
);

ConceptSelector.propTypes = {
  concepts: PropTypes.array.isRequired,
  selectedConcept: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onExplain: PropTypes.func.isRequired
};

export default ConceptSelector;