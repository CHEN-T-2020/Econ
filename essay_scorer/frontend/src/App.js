import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3001/api/grade', {
        essay: essay
      });
      
      setResult(response.data); // 直接使用返回的文本
    } catch (error) {
      setResult(`请求失败：${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>极简作文评分</h1>
      
      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        rows="10"
        placeholder="输入作文..."
      />
      
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '评分中...' : '提交'}
      </button>
      
      {result && (
        <pre className="result">  {/* 使用pre保留格式 */}
          {result}
        </pre>
      )}
    </div>
  );
}

export default App;