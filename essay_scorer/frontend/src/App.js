import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ExamProvider } from './contexts/ExamContext';
import HomePage from './pages/HomePage';
import KnowledgePage from './pages/KnowledgePage';
import './App.css';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="modern-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">📊</div>
          <span className="brand-text">EconAI</span>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">✍️</span>
            作文评分
          </Link>
          <Link 
            to="/knowledge" 
            className={`nav-link ${location.pathname === '/knowledge' ? 'active' : ''}`}
          >
            <span className="nav-icon">📚</span>
            知识点问答
          </Link>
        </div>
      </div>
    </nav>
  );
};

const AppRouter = () => (
  <Router>
    <div className="app-wrapper">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
        </Routes>
      </main>
    </div>
  </Router>
);

const App = () => (
  <ExamProvider>
    <AppRouter />
  </ExamProvider>
);

export default App;
