import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useExam } from '../contexts/ExamContext';
import useFetchExams from '../hooks/useFetchExams';
import ExamSelector from '../components/ExamSelector';
import QuestionSelector from '../components/QuestionSelector';
import QuestionDetails from '../components/QuestionDetails';
import ResultDisplay from '../components/ResultDisplay';

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
    setShowFullScheme,
  } = useExam();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExamChange = useCallback((examId) => {
    setSelectedExamId(examId);
    setSelectedQuestionId('');
    setCurrentQuestion(null);
    setResult(null);
  }, [setSelectedExamId, setSelectedQuestionId, setCurrentQuestion, setResult]);

  const handleQuestionChange = useCallback((questionId) => {
    setSelectedQuestionId(questionId);
    const selectedExam = exams.find(e => e.id === selectedExamId);
    const question = selectedExam?.questions.find(q => q.id === questionId);
    setCurrentQuestion(question || null);
    setResult(null);
  }, [exams, selectedExamId, setSelectedQuestionId, setCurrentQuestion, setResult]);

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion) {
      alert('请先选择题目');
      return;
    }
    
    if (!essay.trim()) {
      alert('请输入作文内容');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/grade`, {
        essay,
        examId: selectedExamId,
        questionId: selectedQuestionId,
        questionPrompt: currentQuestion.question,
        questionRequirement: currentQuestion.mark_scheme,
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: `请求失败：${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, essay, selectedExamId, selectedQuestionId, setResult]);

  if (error) {
    return (
      <div className="container">
        <div className="error-banner">
          <span>⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 页面标题 */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-primary mb-2">
          📊 经济学论文智能评分系统
        </h1>
        <p className="text-secondary text-lg">
          基于AI的智能评分，提供专业、客观的论文评估
        </p>
      </div>

      {/* 选择区域 */}
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">📝 选择考试和题目</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loader">正在加载考试数据...</div>
          ) : (
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">选择考试</label>
                <ExamSelector 
                  exams={exams} 
                  value={selectedExamId} 
                  onChange={handleExamChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">选择题目</label>
                <QuestionSelector 
                  exams={exams} 
                  examId={selectedExamId} 
                  value={selectedQuestionId} 
                  onChange={handleQuestionChange} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 题目详情 */}
      {currentQuestion && (
        <div className="card mb-4 fade-in">
          <div className="card-header">
            <h2 className="card-title">📋 题目详情</h2>
          </div>
          <div className="card-body">
            <QuestionDetails
              question={currentQuestion}
              showFullScheme={showFullScheme}
              onToggle={() => setShowFullScheme(!showFullScheme)}
            />
          </div>
        </div>
      )}

      {/* 作文输入区域 */}
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">✍️ 输入您的论文</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">
              论文内容 
              <span className="text-muted">（建议至少200字）</span>
            </label>
            <textarea
              className="form-textarea"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="在此输入您的经济学论文内容..."
              disabled={!currentQuestion}
              rows="12"
            />
            <div className="text-right mt-2">
              <span className="text-muted">
                字符数: {essay.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="text-center mb-4">
        <button 
          onClick={handleSubmit} 
          disabled={!currentQuestion || !essay.trim() || isSubmitting}
          className="btn btn-primary btn-lg"
        >
          {isSubmitting ? (
            <>
              <span className="loader"></span>
              正在评分...
            </>
          ) : (
            <>
              🚀 开始评分
            </>
          )}
        </button>
      </div>

      {/* 评分结果 */}
      {result && (
        <div className="card slide-up">
          <div className="card-header">
            <h2 className="card-title">📊 评分结果</h2>
          </div>
          <div className="card-body">
            <ResultDisplay result={result} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
