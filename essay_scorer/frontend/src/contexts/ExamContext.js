import { createContext, useContext, useState } from 'react';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState('');
  const [showFullScheme, setShowFullScheme] = useState(false);

  return (
    <ExamContext.Provider
      value={{
        selectedExamId,
        setSelectedExamId,
        selectedQuestionId,
        setSelectedQuestionId,
        currentQuestion,
        setCurrentQuestion,
        essay,
        setEssay,
        result,
        setResult,
        showFullScheme,
        setShowFullScheme
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);