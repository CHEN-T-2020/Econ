import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ConceptSelector.css'; // 导入 CSS 文件

const ConceptSelector = ({ 
  concepts, 
  selectedTop, 
  selectedMain, 
  selectedSub, 
  onSelectTop, 
  onSelectMain, 
  onSelectSub, 
  onExplain 
}) => {
  const topConcept = concepts.find(concept => concept.id === selectedTop);
  const mainTopic = topConcept?.main_topics.find(topic => topic.id === selectedMain);
  const subTopic = mainTopic?.sub_topics.find(sub => sub.id === selectedSub);

  const [selectedExplanation, setSelectedExplanation] = useState('');

  const handleSubSelect = (id) => {
    onSelectSub(id);
    const selected = mainTopic?.sub_topics.find(sub => sub.id === id);
    setSelectedExplanation(selected ? selected.explanation : '');
  };

  return (
    <div className="concept-selector-container">
      {/* 左侧选择框 */}
      <div className="concept-selector">
        <select 
          value={selectedTop}
          onChange={(e) => onSelectTop(e.target.value)}
          className="concept-select"
        >
          <option value="">-- 选择知识领域 --</option>
          {concepts.map(concept => (
            <option key={concept.id} value={concept.id}>
              {concept.description}
            </option>
          ))}
        </select>

        {topConcept && (
          <select 
            value={selectedMain}
            onChange={(e) => onSelectMain(e.target.value)}
            className="concept-select"
          >
            <option value="">-- 选择主要主题 --</option>
            {topConcept.main_topics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.description}
              </option>
            ))}
          </select>
        )}

        {mainTopic && (
          <select 
            value={selectedSub}
            onChange={(e) => handleSubSelect(e.target.value)}
            className="concept-select"
          >
            <option value="">-- 选择子主题 --</option>
            {mainTopic.sub_topics.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.description}
              </option>
            ))}
          </select>
        )}

        <button 
          onClick={onExplain}
          disabled={!selectedSub}
          className="explain-btn"
        >
          解释
        </button>
      </div>

      {/* 右侧解释框 */}
      <div className="explanation-box">
        {selectedExplanation ? (
          <p>{selectedExplanation}</p>
        ) : (
          <p>请选择子主题查看解释</p>
        )}
      </div>
    </div>
  );
};

ConceptSelector.propTypes = {
  concepts: PropTypes.array.isRequired,
  selectedTop: PropTypes.string.isRequired,
  selectedMain: PropTypes.string.isRequired,
  selectedSub: PropTypes.string.isRequired,
  onSelectTop: PropTypes.func.isRequired,
  onSelectMain: PropTypes.func.isRequired,
  onSelectSub: PropTypes.func.isRequired,
  onExplain: PropTypes.func.isRequired,
};

export default ConceptSelector;
