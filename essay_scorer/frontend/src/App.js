import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// 模拟考试数据
const EXAMS = [
  {
    id: 1,
    name: '2023年高考模拟考试',
    questions: [
      { id: 1, prompt: '写一篇关于环保的议论文', requirement: '不少于800字，结构清晰，论点明确' },
      { id: 2, prompt: '描述你最喜欢的季节', requirement: '使用生动的描写，不少于600字' }
    ]
  },
  {
    id: 2,
    name: '2024年中考模拟考试',
    questions: [
      { id: 3, prompt: '我的理想', requirement: '内容具体，感情真挚，500字以上' }
    ]
  }
];

function App() {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // 获取当前选择的考试
  const selectedExam = EXAMS.find(exam => exam.id === Number(selectedExamId));
  
  // 处理考试选择
  const handleExamChange = (e) => {
    const examId = e.target.value;
    setSelectedExamId(examId);
    setSelectedQuestionId(''); // 重置题目选择
    setCurrentQuestion(null);
  };

  // 处理题目选择
  const handleQuestionChange = (e) => {
    const questionId = e.target.value;
    setSelectedQuestionId(questionId);
    const question = selectedExam?.questions.find(q => q.id === Number(questionId));
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
        questionPrompt: currentQuestion.prompt,
        questionRequirement: currentQuestion.requirement
      });
      
      setResult(response.data);
    } catch (error) {
      setResult(`请求失败：${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>智能作文评分系统</h1>
      
      <div className="selection-container">
        <select 
          value={selectedExamId} 
          onChange={handleExamChange}
          className="exam-selector"
        >
          <option value="">请选择考试场次</option>
          {EXAMS.map(exam => (
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
          {selectedExam?.questions.map(question => (
            <option key={question.id} value={question.id}>
              {question.prompt}
            </option>
          ))}
        </select>
      </div>

      {currentQuestion && (
        <div className="question-info">
          <h3>题目要求</h3>
          <p className="prompt">{currentQuestion.prompt}</p>
          <p className="requirement">具体要求：{currentQuestion.requirement}</p>
        </div>
      )}

      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        rows="10"
        placeholder="在此输入你的作文..."
        disabled={!currentQuestion}
      />
      
      <button 
        onClick={handleSubmit} 
        disabled={loading || !currentQuestion}
        className="submit-btn"
      >
        {loading ? '评分中...' : '提交作文'}
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