from flask import Flask, request, jsonify
from flask_cors import CORS
import dspy
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# 加载考试题目数据
with open('data/combined_papers.json', 'r', encoding='utf-8') as f:
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



# 添加在现有路由之后

CONCEPTS = [
    "机会成本",
    "边际效用递减规律",
    "市场失灵",
    "比较优势理论",
    "菲利普斯曲线",
    "供需定律",
    "GDP计算",
    "通货膨胀",
    "货币政策"
]

@app.route('/api/concepts', methods=['GET'])
def get_concepts():
    return jsonify(CONCEPTS)

@app.route('/api/explain', methods=['POST'])
def explain_concept():
    data = request.json
    concept = data.get('concept', '')
    
    prompt = f"""作为经济学教授，请用中文解释以下概念：
概念名称：{concept}

要求：
1. 给出精确定义（100字内）
2. 提供1-2个现实案例
3. 说明其经济意义
4. 使用Markdown格式
5. 包含相关公式（使用LaTeX）"""

    try:
        # response = lm(prompt)
        return prompt
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ask', methods=['POST'])
def handle_question():
    data = request.json
    question = data.get('question', '')
    context = data.get('context', [])
    
    history = "\n".join([f"{msg['type']}: {msg['content']}" for msg in context[-3:]])
    
    prompt = f"""根据对话历史回答后续问题：
{history}

当前问题：{question}

要求：
1. 保持专业性和易懂性的平衡
2. 使用中文回复
3. 包含必要的数学公式（LaTeX格式）
4. 使用Markdown排版
5. 如果问题不明确，请求澄清"""

    try:
        # response = lm(prompt)
        return prompt
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



if __name__ == '__main__':
    app.run(port=3001)