import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ExamProvider, useExam } from './contexts/ExamContext';
import useFetchExams from './hooks/useFetchExams';
import ExamSelector from './components/ExamSelector';
import QuestionSelector from './components/QuestionSelector';
import QuestionDetails from './components/QuestionDetails';
import ResultDisplay from './components/ResultDisplay';
import KnowledgePage from './pages/KnowledgePage';
import axios from 'axios';
import './App.css';

// 原AppLayout组件重命名为HomePage
const HomePage = () => {
  const { exams, loading, error } = useFetchExams();
  const {
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
  } = useExam();

  const handleExamChange = useCallback((examId) => {
    setSelectedExamId(examId);
    setSelectedQuestionId('');
    setCurrentQuestion(null);
  }, [setSelectedExamId, setSelectedQuestionId, setCurrentQuestion]);

  const handleQuestionChange = useCallback((questionId) => {
    setSelectedQuestionId(questionId);
    const selectedExam = exams.find(e => e.id === selectedExamId);
    const question = selectedExam?.questions.find(q => q.id === questionId);
    setCurrentQuestion(question || null);
  }, [exams, selectedExamId, setSelectedQuestionId, setCurrentQuestion]);

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion) {
      alert('请先选择题目');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/grade', {
        essay,
        examId: selectedExamId,
        questionId: selectedQuestionId,
        questionPrompt: currentQuestion.question,
        questionRequirement: currentQuestion.fullMarkScheme
      });
      setResult(response.data);
    } catch (error) {
      setResult(`请求失败：${error.message}`);
    }
  }, [currentQuestion, essay, selectedExamId, selectedQuestionId, setResult]);

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  return (
    <div className="container">
      <h1>经济学论文智能评分系统</h1>
      
      <div className="selection-container">
        {loading ? (
          <div className="loader">正在加载考试数据...</div>
        ) : (
          <>
            <ExamSelector
              exams={exams}
              value={selectedExamId}
              onChange={handleExamChange}
            />
            
            <QuestionSelector
              exams={exams}
              examId={selectedExamId}
              value={selectedQuestionId}
              onChange={handleQuestionChange}
            />
          </>
        )}
      </div>

      {currentQuestion && (
        <QuestionDetails
          question={currentQuestion}
          showFullScheme={showFullScheme}
          onToggle={() => setShowFullScheme(!showFullScheme)}
        />
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
        disabled={!currentQuestion}
        className="submit-btn"
      >
        提交评分
      </button>

      <ResultDisplay result={result} />
    </div>
  );
};

// 主路由组件
const AppRouter = () => (
  <Router>
    <nav className="main-nav">
      <Link to="/" className="nav-link">作文评分</Link>
      <Link to="/knowledge" className="nav-link">知识点问答</Link>
    </nav>
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/knowledge" element={<KnowledgePage />} />
    </Routes>
  </Router>
);

// 顶层App组件
const App = () => (
  <ExamProvider>
    <AppRouter />
  </ExamProvider>
);

export default App;