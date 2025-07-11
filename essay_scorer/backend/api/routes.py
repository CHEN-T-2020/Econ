from flask import Blueprint, request, jsonify
from services.ai_service import ai_service
from services.data_service import data_service
from utils.error_handler import handle_api_error

# 创建蓝图
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/exams', methods=['GET'])
def get_exams():
    """获取所有考试数据"""
    try:
        formatted_data = data_service.get_formatted_exams()
        return jsonify(formatted_data)
    except Exception as e:
        return handle_api_error(e, "Failed to fetch exams")

@api_bp.route('/knowledge', methods=['GET'])
def get_knowledge():
    """获取知识点数据"""
    try:
        knowledge_data = data_service.load_knowledge_data()
        return jsonify(knowledge_data)
    except Exception as e:
        return handle_api_error(e, "Failed to fetch knowledge data")

@api_bp.route('/grade', methods=['POST'])
def grade_essay():
    """作文评分接口"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # 获取参数
        essay = data.get('essay', '')
        exam_id = data.get('examId', '')
        question_id = data.get('questionId', '')
        question_prompt = data.get('questionPrompt', '')
        question_requirement = data.get('questionRequirement', '')
        
        # 验证必要参数
        if not all([essay, question_prompt, question_requirement]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # 调用AI服务评分
        result = ai_service.evaluate_essay(
            question=question_prompt,
            answer=essay,
            rubric=question_requirement
        )
        
        return jsonify(result)
    except Exception as e:
        return handle_api_error(e, "Essay grading failed")

@api_bp.route('/explain', methods=['POST'])
def explain_concept():
    """解释概念接口"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # 验证必要参数
        required_fields = ['top', 'main', 'sub', 'explanation']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # 调用AI服务生成解释
        response = ai_service.generate_explanation(data)
        return jsonify(response)
    except Exception as e:
        return handle_api_error(e, "Concept explanation failed")

@api_bp.route('/ask', methods=['POST'])
def handle_question():
    """处理后续问题接口"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        question = data.get('question', '')
        context = data.get('context', [])
        
        if not question:
            return jsonify({"error": "Question is required"}), 400
        
        # 调用AI服务处理问题
        response = ai_service.handle_follow_up_question(question, context)
        return jsonify(response)
    except Exception as e:
        return handle_api_error(e, "Question handling failed") 