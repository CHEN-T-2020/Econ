import json
import os
from typing import Dict, List, Optional
from config import Config

class DataService:
    """数据服务类，处理所有数据相关操作"""
    
    def __init__(self):
        self._exam_data: Optional[Dict] = None
        self._knowledge_data: Optional[List] = None
    
    def load_exam_data(self) -> Dict:
        """加载考试数据"""
        if self._exam_data is None:
            try:
                with open(Config.EXAM_DATA_FILE, 'r', encoding='utf-8') as f:
                    self._exam_data = json.load(f)
            except FileNotFoundError:
                raise FileNotFoundError(f"Exam data file not found: {Config.EXAM_DATA_FILE}")
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON in exam data file: {e}")
        return self._exam_data
    
    def load_knowledge_data(self) -> List:
        """加载知识点数据"""
        if self._knowledge_data is None:
            try:
                with open(Config.KNOWLEDGE_DATA_FILE, 'r', encoding='utf-8') as f:
                    self._knowledge_data = json.load(f)
            except FileNotFoundError:
                raise FileNotFoundError(f"Knowledge data file not found: {Config.KNOWLEDGE_DATA_FILE}")
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON in knowledge data file: {e}")
        return self._knowledge_data
    
    def get_formatted_exams(self) -> List[Dict]:
        """获取格式化的考试数据"""
        exam_data = self.load_exam_data()
        formatted_data = []
        
        for paper_code, questions in exam_data.items():
            exam_entry = {
                "id": paper_code,
                "name": paper_code.replace('_', ' ').upper(),
                "questions": []
            }
            
            for q in questions:
                exam_entry["questions"].append({
                    "id": q["id"],
                    "question": q["question"],
                    "mark_scheme": q["mark_scheme"],
                    "total_marks": q["total_marks"]
                })
            
            formatted_data.append(exam_entry)
        
        return formatted_data
    
    def get_exam_by_id(self, exam_id: str) -> Optional[Dict]:
        """根据ID获取考试数据"""
        exam_data = self.load_exam_data()
        if exam_id not in exam_data:
            return None
        
        questions = exam_data[exam_id]
        return {
            "id": exam_id,
            "name": exam_id.replace('_', ' ').upper(),
            "questions": questions
        }
    
    def get_question_by_ids(self, exam_id: str, question_id: str) -> Optional[Dict]:
        """根据考试ID和题目ID获取题目数据"""
        exam = self.get_exam_by_id(exam_id)
        if not exam:
            return None
        
        for question in exam["questions"]:
            if question["id"] == question_id:
                return question
        
        return None
    
    def clear_cache(self):
        """清除缓存"""
        self._exam_data = None
        self._knowledge_data = None

# 全局数据服务实例
data_service = DataService() 