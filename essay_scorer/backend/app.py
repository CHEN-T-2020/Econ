from flask import Flask, request, jsonify
from flask_cors import CORS
import dspy
import os
import json
from .utils import evaluate_essay, generate_explanation, handle_follow_up_question
# from utils import evaluate_essay, generate_explanation, handle_follow_up_question # for local testing
from dotenv import load_dotenv

load_dotenv()
current_dir = os.path.dirname(os.path.abspath(__file__))
static_folder = os.path.join(current_dir, '..', 'frontend', 'build')

# 加载考试题目数据
data_file_path = os.path.join(current_dir, 'data', 'combined_papers.json')
with open(data_file_path, 'r', encoding='utf-8') as f:
    EXAM_DATA = json.load(f)


app = Flask(__name__, static_folder=static_folder, static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')
    # return "Hello Heroku!"

@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('index.html') # ?????


@app.route('/api/exams', methods=['GET'])
def get_exams():
    """获取所有考试数据"""
    try:
        formatted_data = []
        for paper_code, questions in EXAM_DATA.items():
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
        return jsonify(formatted_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# app.py 新增路由
@app.route('/api/knowledge', methods=['GET'])
def get_knowledge():
    knowledge_file_path = os.path.join(current_dir, 'data', 'knowledge_map.json')
    try:
        with open(knowledge_file_path, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route('/api/grade', methods=['POST'])
def grade_essay():
    """作文评分接口"""
    try:
        data = request.get_json()
        # 获取所有参数
        essay = data.get('essay', '')
        exam_id = data.get('examId', '')
        question_id = data.get('questionId', '')
        question_prompt = data.get('questionPrompt', '')
        question_requirement = data.get('questionRequirement', '')


        return evaluate_essay(question=question_prompt, answer=essay, ms=question_requirement)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/explain', methods=['POST'])
def explain_concept():
    data = request.json
    # data example:
    # {'top': 'The price system and the microeconomy (A Level)', 'main': 'Efficiency and market failure', 'sub': 'Pareto optimality', 'explanation': 'Pareto optimality occurs when no one can be made better off without making someone else worse off, a key concept in welfare economics.'}

    try:
        response = generate_explanation(data)
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ask', methods=['POST'])
def handle_question():
    data = request.json

    try:
        response = handle_follow_up_question(data)
        print(response)
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    





if __name__ == '__main__':
    # app.run(port=3001) # for local testing
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))