
import dspy
import os
import json
from dotenv import load_dotenv

load_dotenv()


# 配置AI模型
OPENAI_MODEL = 'openai/gpt-4o'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

DEEP_SEEK_MODEL = "deepseek/deepseek-chat"
DEEP_SEEK_API_KEY = os.getenv('DEEP_SEEK_API_KEY')

TEMPERATURE = 0.7

lm = dspy.LM(DEEP_SEEK_MODEL, api_key=DEEP_SEEK_API_KEY, temperature=TEMPERATURE)
dspy.configure(lm=lm)




def evaluate_essay(question, answer, ms):

    prompt = f"""
You are a strict AP Economics grader. Your task is to evaluate a student's answer based on the provided rubric. Please adhere strictly to the rubric without any deviation, and provide detailed reasoning for the score as well as suggestions for improvement.

Question: 
{question}

Student Answer: 
{answer}

Rubric: 
{ms}


Scoring Requirements:
1. Score:
Assign a clear score based on the rubric.
The score must strictly follow the rubric; do not adjust arbitrarily.
Do not deduct points for missing graphs or diagrams, since the student is unable to include them in this response.


2. Rationale:
Explain the specific reasons for the assigned score, including how the student's answer meets or does not meet the rubric criteria.
If the answer partially meets the criteria, specify lost points, referencing the rubric.
Clearly list the specific deduction points, stating exactly why the answer lost points.
If the rubric requires a graph for full credit, do not deduct points for its absence, but clearly describe what a complete and correct graph should include to earn full points.


3. Suggestions for Improvement:
Provide specific suggestions to help the student improve their answer.
Indicate what content needs to be added, modified, or refined to meet the rubric standards.

Please grade strictly according to the rubric and provide clear rationale and improvement suggestions. 
And please provide the whole evaluation both in English and Chinese.
"""
    # print(prompt)

    # return lm(prompt)[0]
    return prompt



def generate_explanation(topic_info):
    prompt = f"""
You are an economics teacher. Your task is to explain economic concepts in simple terms for someone with no prior economics knowledge. 

Topic: {topic_info['top']}
Main Concept: {topic_info['main']}
Subtopic: {topic_info['sub']}
Definition: {topic_info['explanation']}

Instructions:
1. Explain the concept in very simple terms, as if you were teaching a beginner.
2. Use real-world examples to illustrate the idea.
3. Provide both English and Chinese versions. The Chinese version should also be simple and easy to understand.

"""

    return lm(prompt)[0]


def handle_follow_up_question(data):
    # 从请求中获取数据
    question = data.get('question', '')
    context = data.get('context', [])
    
    # 取最近三条对话历史记录
    history = "\n".join([f"{msg['type']}: {msg['content']}" for msg in context[-3:]])

    # 构造 prompt
    prompt = f"""
根据对话历史回答后续问题：
{history}

当前问题：{question}

要求：
1. 保持专业性和易懂性的平衡
2. 使用中文回复
3. 如果问题不明确，请请求澄清
"""

    return lm(prompt)[0]