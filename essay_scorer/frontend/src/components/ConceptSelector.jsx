import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ConceptSelector = ({ 
  concepts, 
  selectedTop, 
  selectedMain, 
  selectedSub, 
  onSelectTop, 
  onSelectMain, 
  onSelectSub, 
  onExplain,
  isLoading
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
    <div className="space-y-4">
      {/* 选择区域 */}
      <div className="space-y-3">
        <div className="form-group">
          <label className="form-label">知识领域</label>
          <select 
            value={selectedTop}
            onChange={(e) => onSelectTop(e.target.value)}
            className="form-select"
          >
            <option value="">请选择知识领域</option>
            {concepts.map(concept => (
              <option key={concept.id} value={concept.id}>
                {concept.description}
              </option>
            ))}
          </select>
        </div>

        {topConcept && (
          <div className="form-group">
            <label className="form-label">主要主题</label>
            <select 
              value={selectedMain}
              onChange={(e) => onSelectMain(e.target.value)}
              className="form-select"
            >
              <option value="">请选择主要主题</option>
              {topConcept.main_topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.description}
                </option>
              ))}
            </select>
          </div>
        )}

        {mainTopic && (
          <div className="form-group">
            <label className="form-label">子主题</label>
            <select 
              value={selectedSub}
              onChange={(e) => handleSubSelect(e.target.value)}
              className="form-select"
            >
              <option value="">请选择子主题</option>
              {mainTopic.sub_topics.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.description}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          onClick={onExplain}
          disabled={!selectedSub || isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <>
              <span className="loader"></span>
              正在生成解释...
            </>
          ) : (
            <>
              🎯 获取AI解释
            </>
          )}
        </button>
      </div>

      {/* 解释预览 */}
      {selectedExplanation && (
        <div className="bg-secondary p-4 rounded-lg">
          <h4 className="font-semibold mb-2">概念解释预览：</h4>
          <p className="text-sm leading-relaxed">
            {selectedExplanation}
          </p>
        </div>
      )}
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
  isLoading: PropTypes.bool
};

export default ConceptSelector;
