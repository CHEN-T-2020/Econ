import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """应用配置类"""
    
    # Flask配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    PORT = int(os.getenv('PORT', 3001))
    
    # AI模型配置
    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'openai/gpt-4o')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
    DEEP_SEEK_MODEL = os.getenv('DEEP_SEEK_MODEL', 'deepseek/deepseek-chat')
    DEEP_SEEK_API_KEY = os.getenv('DEEP_SEEK_API_KEY', '')
    TEMPERATURE = float(os.getenv('TEMPERATURE', 0.7))
    
    # 数据文件路径
    DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
    EXAM_DATA_FILE = os.path.join(DATA_DIR, 'combined_papers.json')
    KNOWLEDGE_DATA_FILE = os.path.join(DATA_DIR, 'knowledge_map.json')
    
    # 前端构建文件路径
    STATIC_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build')
    
    @classmethod
    def validate(cls):
        """验证必要的配置项"""
        # 允许在测试模式下不设置API key
        if not cls.OPENAI_API_KEY:
            print("Warning: OPENAI_API_KEY not set. Running in test mode.")
            return True
        return True 