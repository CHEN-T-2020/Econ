import { useState, useCallback } from 'react';
import ApiService from '../services/api';

// 通用API调用Hook
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeApiCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, executeApiCall };
};

// 考试数据Hook
export const useExams = () => {
  const [exams, setExams] = useState([]);
  const { loading, error, executeApiCall } = useApi();

  const fetchExams = useCallback(async () => {
    try {
      const data = await executeApiCall(ApiService.getExams);
      const formatted = data.map(exam => ({
        ...exam,
        questions: exam.questions.map(q => ({
          ...q,
          prompt: q.question,
          requirement: q.mark_scheme.split('\n').slice(0, 3).join('\n'),
          fullMarkScheme: q.mark_scheme
        }))
      }));
      setExams(formatted);
    } catch (err) {
      console.error('Failed to fetch exams:', err);
    }
  }, [executeApiCall]);

  return { exams, loading, error, fetchExams };
};

// 知识点数据Hook
export const useKnowledge = () => {
  const [concepts, setConcepts] = useState([]);
  const { loading, error, executeApiCall } = useApi();

  const fetchConcepts = useCallback(async () => {
    try {
      const data = await executeApiCall(ApiService.getKnowledge);
      setConcepts(data);
    } catch (err) {
      console.error('Failed to fetch concepts:', err);
    }
  }, [executeApiCall]);

  return { concepts, loading, error, fetchConcepts };
};

// 作文评分Hook
export const useEssayGrading = () => {
  const { loading, error, executeApiCall } = useApi();

  const gradeEssay = useCallback(async (data) => {
    return await executeApiCall(ApiService.gradeEssay, data);
  }, [executeApiCall]);

  return { loading, error, gradeEssay };
};

// 概念解释Hook
export const useConceptExplanation = () => {
  const { loading, error, executeApiCall } = useApi();

  const explainConcept = useCallback(async (data) => {
    return await executeApiCall(ApiService.explainConcept, data);
  }, [executeApiCall]);

  return { loading, error, explainConcept };
};

// 后续问题Hook
export const useQuestionHandling = () => {
  const { loading, error, executeApiCall } = useApi();

  const askQuestion = useCallback(async (data) => {
    return await executeApiCall(ApiService.askQuestion, data);
  }, [executeApiCall]);

  return { loading, error, askQuestion };
}; 