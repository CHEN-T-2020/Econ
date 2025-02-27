from flask import Flask, request
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
    essay = request.json.get('essay', '')
    response = lm(essay)
    return response

if __name__ == '__main__':
    app.run(port=3001)