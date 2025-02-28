import React from 'react';
import PropTypes from 'prop-types';

const ResultDisplay = ({ result }) => (
  result && (
    <pre className="result">
      {result}
    </pre>
  )
);

ResultDisplay.propTypes = {
  result: PropTypes.string
};

export default ResultDisplay;