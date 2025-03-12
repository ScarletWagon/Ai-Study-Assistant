from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # Allows frontend (React) to communicate with backend

# Configure OpenAI API Key (replace with your actual key)
openai.api_key = "your-openai-api-key"

@app.route('/')
def home():
    return "AI Study Assistant Backend is Running!"

# Route 1: Generate Study Plan using OpenAI API
@app.route('/generate-study-plan', methods=['POST'])
def generate_study_plan():
    data = request.json  # Get request data
    subject = data.get('subject', 'General Study Plan')  # Default to general if no subject provided

    prompt = f"Create a structured study plan for {subject}."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  
            messages=[{"role": "system", "content": prompt}]
        )
        study_plan = response['choices'][0]['message']['content']
        return jsonify({"study_plan": study_plan})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
