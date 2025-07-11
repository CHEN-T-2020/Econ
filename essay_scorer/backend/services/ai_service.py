import dspy
from config import Config

class AIService:
    """AI服务类，处理所有AI相关操作"""
    
    def __init__(self):
        self._setup_ai_model()
    
    def _setup_ai_model(self):
        """设置AI模型"""
        try:
            # 检查API key是否设置
            if not Config.OPENAI_API_KEY or Config.OPENAI_API_KEY == 'your_openai_api_key_here':
                print("Warning: OPENAI_API_KEY not set. Running in test mode.")
                self.test_mode = True
                return
            
            Config.validate()
            self.lm = dspy.LM(
                Config.OPENAI_MODEL, 
                api_key=Config.OPENAI_API_KEY, 
                temperature=Config.TEMPERATURE
            )
            dspy.configure(lm=self.lm)
            self.test_mode = False
        except Exception as e:
            print(f"Warning: Failed to setup AI model: {e}. Running in test mode.")
            self.test_mode = True
    
    def evaluate_essay(self, question: str, answer: str, rubric: str) -> dict:
        """评估论文"""
        if self.test_mode:
            return self._generate_test_response("essay_evaluation", question, answer, rubric)
        
        prompt = f"""
You are a strict AP Economics grader. Your task is to evaluate a student's answer based on the provided rubric. Please adhere strictly to the rubric without any deviation, and provide detailed reasoning for the score as well as suggestions for improvement.

Question: 
{question}

Student Answer: 
{answer}

Rubric: 
{rubric}

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
        try:
            result = self.lm(prompt)[0]
            return {"result": result}
        except Exception as e:
            error_msg = str(e)
            if "quota" in error_msg.lower() or "rate limit" in error_msg.lower():
                print("Warning: API quota exceeded. Running in test mode.")
                return self._generate_test_response("essay_evaluation", question, answer, rubric)
            else:
                raise RuntimeError(f"Essay evaluation failed: {e}")
    
    def generate_explanation(self, topic_info: dict) -> dict:
        """生成概念解释"""
        if self.test_mode:
            return self._generate_test_response("concept_explanation", topic_info)
        
        prompt = f"""
You are an economics teacher. Your task is to explain economic concepts in simple terms for someone with no prior economics knowledge. 

Topic: {topic_info.get('top', '')}
Main Concept: {topic_info.get('main', '')}
Subtopic: {topic_info.get('sub', '')}
Definition: {topic_info.get('explanation', '')}

Instructions:
1. Explain the concept in very simple terms, as if you were teaching a beginner.
2. Use real-world examples to illustrate the idea.
3. Provide both English and Chinese versions. The Chinese version should also be simple and easy to understand.
"""
        try:
            result = self.lm(prompt)[0]
            return {"result": result}
        except Exception as e:
            error_msg = str(e)
            if "quota" in error_msg.lower() or "rate limit" in error_msg.lower():
                print("Warning: API quota exceeded. Running in test mode.")
                return self._generate_test_response("concept_explanation", topic_info)
            else:
                raise RuntimeError(f"Explanation generation failed: {e}")
    
    def handle_follow_up_question(self, question: str, context: list) -> dict:
        """处理后续问题"""
        if self.test_mode:
            return self._generate_test_response("follow_up_question", question, context)
        
        # 取最近三条对话历史记录
        history = "\n".join([f"{msg['type']}: {msg['content']}" for msg in context[-3:]])

        prompt = f"""
根据对话历史回答后续问题：
{history}

当前问题：{question}

要求：
1. 保持专业性和易懂性的平衡
2. 使用中文回复
3. 如果问题不明确，请请求澄清
"""
        try:
            result = self.lm(prompt)[0]
            return {"result": result}
        except Exception as e:
            error_msg = str(e)
            if "quota" in error_msg.lower() or "rate limit" in error_msg.lower():
                print("Warning: API quota exceeded. Running in test mode.")
                return self._generate_test_response("follow_up_question", question, context)
            else:
                raise RuntimeError(f"Follow-up question handling failed: {e}")
    
    def _generate_test_response(self, response_type: str, *args) -> dict:
        """生成测试响应"""
        if response_type == "essay_evaluation":
            question, answer, rubric = args
            result = f"""
【测试模式 - 作文评分】

问题: {question[:100]}...
学生答案: {answer[:100]}...
评分标准: {rubric[:100]}...

评分结果:
分数: 6/8
理由: 这是一个测试响应。在实际环境中，这里会显示AI的详细评分。
改进建议: 请设置正确的OPENAI_API_KEY或检查API配额以获得真实的AI评分。

English Version:
Score: 6/8
Rationale: This is a test response. In production, this would show detailed AI evaluation.
Suggestions: Please set the correct OPENAI_API_KEY or check API quota for real AI grading.
"""
            return {"result": result}
        elif response_type == "concept_explanation":
            topic_info = args[0]
            result = f"""
【测试模式 - 概念解释】

主题: {topic_info.get('top', 'N/A')}
主要概念: {topic_info.get('main', 'N/A')}
子主题: {topic_info.get('sub', 'N/A')}

解释: 这是一个测试响应。在实际环境中，这里会显示AI的详细概念解释。

English Version:
This is a test response. In production, this would show detailed AI explanation.
"""
            return {"result": result}
        elif response_type == "follow_up_question":
            question, context = args
            result = f"""
【测试模式 - 后续问题】

问题: {question}
上下文: {len(context)} 条历史记录

回答: 这是一个测试响应。在实际环境中，这里会显示AI的详细回答。

English Version:
This is a test response. In production, this would show detailed AI response.
"""
            return {"result": result}
        else:
            return {"result": "测试响应 - 请设置OPENAI_API_KEY或检查API配额以获得真实AI服务"}

# 全局AI服务实例
ai_service = AIService() 