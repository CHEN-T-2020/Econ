from flask import Flask, request, jsonify
from flask_cors import CORS
import dspy
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 加载考试数据
with open('combined_papers.json', 'r', encoding='utf-8') as f:
    EXAM_DATA = json.load(f)

# 配置AI模型
OPENAI_MODEL = 'openai/gpt-4o'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
TEMPERATURE = 0.7

lm = dspy.LM(OPENAI_MODEL, api_key=OPENAI_API_KEY, temperature=TEMPERATURE)
dspy.configure(lm=lm)

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

        # 构建专业评分提示
        evaluation_prompt = f"""【考试信息】
试卷ID: {exam_id}
题目ID: {question_id}

【题目要求】
{question_prompt}

【评分标准】
{question_requirement}

【学生作文】
{essay}
"""

        return evaluation_prompt
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001)