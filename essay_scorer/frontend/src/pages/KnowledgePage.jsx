import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConceptSelector from '../components/ConceptSelector';
import ConversationPanel from '../components/ConversationPanel';

const KnowledgePage = () => {
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/concepts');
        // console.log('获取到的知识点数据:', res.data); // 添加调试日志
        setConcepts(res.data);
      } catch (error) {
        console.error('加载知识点失败:', error);
      }
    };
    fetchConcepts();
  }, []);

  const handleConceptSelect = async () => {
    if (!selectedConcept) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/explain', { concept: selectedConcept });
      setConversation([
        { type: 'response', content: response.data }
      ]);
    } catch (error) {
      setConversation([{
        type: 'error',
        content: '获取解释失败，请稍后重试'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUp = async (question) => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/ask', {
        question,
        context: conversation
      });
      setConversation(prev => [
        ...prev,
        { type: 'request', content: question },
        { type: 'response', content: response.data }
      ]);
    } catch (error) {
      setConversation(prev => [
        ...prev,
        { type: 'error', content: '请求失败，请检查网络连接' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="knowledge-page">
      <h2>经济学知识点问答</h2>
      <ConceptSelector
        concepts={concepts}
        selectedConcept={selectedConcept}
        onSelect={setSelectedConcept}
        onExplain={handleConceptSelect}
      />
      <ConversationPanel
        conversation={conversation}
        isLoading={isLoading}
        onFollowUp={handleFollowUp}
      />
    </div>
  );
};

export default KnowledgePage;