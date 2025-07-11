import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API服务类
class ApiService {
  // 考试相关API
  static async getExams() {
    try {
      const response = await api.get('/api/exams');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch exams');
    }
  }

  // 知识点相关API
  static async getKnowledge() {
    try {
      const response = await api.get('/api/knowledge');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch knowledge data');
    }
  }

  // 作文评分API
  static async gradeEssay(data) {
    try {
      const response = await api.post('/api/grade', data);
      return response.data;
    } catch (error) {
      throw new Error('Essay grading failed');
    }
  }

  // 概念解释API
  static async explainConcept(data) {
    try {
      const response = await api.post('/api/explain', data);
      return response.data;
    } catch (error) {
      throw new Error('Concept explanation failed');
    }
  }

  // 后续问题API
  static async askQuestion(data) {
    try {
      const response = await api.post('/api/ask', data);
      return response.data;
    } catch (error) {
      throw new Error('Question handling failed');
    }
  }
}

export default ApiService; 