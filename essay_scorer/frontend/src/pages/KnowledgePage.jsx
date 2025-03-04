import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConceptSelector from '../components/ConceptSelector';
import ConversationPanel from '../components/ConversationPanel';
import ResultDisplay from '../components/ResultDisplay'; // 引入 ResultDisplay

const KnowledgePage = () => {
  const [concepts, setConcepts] = useState([]);
  const [selectedTop, setSelectedTop] = useState('');
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/knowledge`);
        setConcepts(res.data);
      } catch (error) {
        console.error('加载知识点失败:', error);
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
        { type: 'response', content: response.data}
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
        selectedTop={selectedTop}
        selectedMain={selectedMain}
        selectedSub={selectedSub}
        onSelectTop={handleTopChange}
        onSelectMain={handleMainChange}
        onSelectSub={handleSubChange}
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
