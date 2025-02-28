import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/exams');
        const formatted = response.data.map(exam => ({
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
        setError('无法加载考试数据，请检查网络连接');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { exams, loading, error };
};

export default useFetchExams;