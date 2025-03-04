import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ExamProvider } from './contexts/ExamContext';
import HomePage from './pages/HomePage';
import KnowledgePage from './pages/KnowledgePage';
import './App.css';

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

const App = () => (
  <ExamProvider>
    <AppRouter />
  </ExamProvider>
);

export default App;
