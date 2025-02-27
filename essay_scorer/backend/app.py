from flask import Flask, request, jsonify
from flask_cors import CORS
import dspy
import os
from dotenv import load_dotenv
load_dotenv()

OPENAI_MODEL = 'openai/gpt-4o'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
TEMPERATURE = 0.7

lm = dspy.LM(OPENAI_MODEL, api_key=OPENAI_API_KEY, temperature=TEMPERATURE)
dspy.configure(lm=lm)

app = Flask(__name__)
CORS(app)

@app.route('/api/grade', methods=['POST'])
def grade_essay():
    try:
        data = request.get_json()
        essay = data.get('essay', '')
        question_prompt = data.get('questionPrompt', '')
        question_requirement = data.get('questionRequirement', '')

        # 构建评分提示语
        evaluation_prompt = (
            f"作文题目：{question_prompt}\n"
            f"具体要求：{question_requirement}\n"
            f"学生作文：\n{essay}\n\n"
            "请根据题目要求和以下标准进行评分：\n"
            "1. 内容是否符合题意\n"
            "2. 结构是否合理\n"
            "3. 语言表达是否准确\n"
            "4. 是否满足字数要求\n\n"
            "请给出具体评语和分数（满分100分）:"
        )

        response = lm(evaluation_prompt)
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001)