import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showFullScheme, setShowFullScheme] = useState(false);
  const [loadingExams, setLoadingExams] = useState(true);
  const [error, setError] = useState(null);

  // 加载考试数据
  useEffect(() => {
    const fetchExams = async () => {
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
        setError('无法加载考试数据，请检查网络连接后重试');
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // 处理考试选择
  const handleExamChange = (e) => {
    const examId = e.target.value;
    setSelectedExamId(examId);
    setSelectedQuestionId('');
    setCurrentQuestion(null);
  };

  // 处理题目选择
  const handleQuestionChange = (e) => {
    const questionId = e.target.value;
    setSelectedQuestionId(questionId);
    const selectedExam = exams.find(exam => exam.id === selectedExamId);
    const question = selectedExam?.questions.find(q => q.id === questionId);
    setCurrentQuestion(question || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion) {
      alert('请先选择题目');
      return;
    }
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3001/api/grade', {
        essay: essay,
        examId: selectedExamId,
        questionId: selectedQuestionId,
        questionPrompt: currentQuestion.question,
        questionRequirement: currentQuestion.fullMarkScheme
      });
      
      setResult(response.data);
    } catch (error) {
      setResult(`请求失败：${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>经济学论文智能评分系统</h1>
      
      {error && <div className="error-banner">{error}</div>}
      
      <div className="selection-container">
        {loadingExams ? (
          <div className="loader">正在加载考试数据...</div>
        ) : (
          <>
            <select
              value={selectedExamId}
              onChange={handleExamChange}
              className="exam-selector"
            >
              <option value="">请选择考试场次</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))}
            </select>

            <select
              value={selectedQuestionId}
              onChange={handleQuestionChange}
              disabled={!selectedExamId}
              className="question-selector"
            >
              <option value="">请选择题目</option>
              {exams.find(exam => exam.id === selectedExamId)?.questions.map(question => (
                <option key={question.id} value={question.id}>
                  {question.id} - {question.prompt.substring(0, 50)}...
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {currentQuestion && (
        <div className="question-info">
          <h3>题目要求（{currentQuestion.id}）</h3>
          <p className="prompt">{currentQuestion.prompt}</p>
          <div className="requirement-box">
            <p>总分：{currentQuestion.total_marks} 分</p>
            <button 
              onClick={() => setShowFullScheme(!showFullScheme)}
              className="toggle-btn"
            >
              {showFullScheme ? '收起完整评分标准' : '展开完整评分标准'}
            </button>
            {showFullScheme && (
              <pre className="full-mark-scheme">
                {currentQuestion.fullMarkScheme}
              </pre>
            )}
          </div>
        </div>
      )}

      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        rows="12"
        placeholder="在此输入您的经济学论文..."
        disabled={!currentQuestion}
      />
      
      <button 
        onClick={handleSubmit} 
        disabled={loading || !currentQuestion}
        className="submit-btn"
      >
        {loading ? '评分中...' : '提交评分'}
      </button>
      
      {result && (
        <pre className="result">
          {result}
        </pre>
      )}
    </div>
  );
}

export default App;