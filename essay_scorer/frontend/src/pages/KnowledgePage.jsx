import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConceptSelector from '../components/ConceptSelector';
import ConversationPanel from '../components/ConversationPanel';

const KnowledgePage = () => {
  const [concepts, setConcepts] = useState([]);
  const [selectedTop, setSelectedTop] = useState('');
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        setError('');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/knowledge`);
        setConcepts(res.data);
      } catch (error) {
        console.error('加载知识点失败:', error);
        setError('加载知识点失败，请稍后重试');
      }
    };
    fetchConcepts();
  }, []);

  // 顶层选择变化时，清空下级选择
  const handleTopChange = (value) => {
    setSelectedTop(value);
    setSelectedMain('');
    setSelectedSub('');
  };

  const handleMainChange = (value) => {
    setSelectedMain(value);
    setSelectedSub('');
  };

  const handleSubChange = (value) => {
    setSelectedSub(value);
  };

  const handleConceptSelect = async () => {
    if (!selectedSub) return;
    
    // 从知识树中找到对应的选择项
    const topConcept = concepts.find(concept => concept.id === selectedTop);
    const mainTopic = topConcept && topConcept.main_topics.find(topic => topic.id === selectedMain);
    const subTopic = mainTopic && mainTopic.sub_topics.find(sub => sub.id === selectedSub);
    
    // 构造包含每一层 description 的 payload 对象
    const payload = {
      top: topConcept ? topConcept.description : '',
      main: mainTopic ? mainTopic.description : '',
      sub: subTopic ? subTopic.description : '',
      explanation: subTopic ? subTopic.explanation : ''
    };

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/explain`, payload);
      setConversation([
        { type: 'response', content: response.data.result || response.data}
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ask`, {
        question,
        context: conversation
      });
      setConversation(prev => [
        ...prev,
        { type: 'request', content: question },
        { type: 'response', content: response.data.result || response.data }
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
    <div className="container">
      {/* 页面标题 */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-primary mb-2">
          📚 经济学知识点问答
        </h1>
        <p className="text-secondary text-lg">
          智能AI助手，为您解答经济学概念和问题
        </p>
      </div>

      {error && (
        <div className="error-banner mb-4">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="grid grid-2 gap-6">
        {/* 左侧：概念选择 */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🎯 选择知识点</h2>
          </div>
          <div className="card-body">
            <ConceptSelector
              concepts={concepts}
              selectedTop={selectedTop}
              selectedMain={selectedMain}
              selectedSub={selectedSub}
              onSelectTop={handleTopChange}
              onSelectMain={handleMainChange}
              onSelectSub={handleSubChange}
              onExplain={handleConceptSelect}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* 右侧：对话面板 */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">💬 AI助手对话</h2>
          </div>
          <div className="card-body">
            <ConversationPanel
              conversation={conversation}
              isLoading={isLoading}
              onFollowUp={handleFollowUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;
