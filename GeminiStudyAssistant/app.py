from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import json
from datetime import datetime
import random

app = Flask(__name__)

# Configure Gemini API
API_KEY = "AIzaSyBPz66g7Z7FGHNpeirqlhZUglaaqggKVt4"
genai.configure(api_key=API_KEY)

# Try different model configurations for Gemini 2.0
try:
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    print("✅ Using gemini-2.0-flash-exp model")
except:
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-thinking-exp')
        print("✅ Using gemini-2.0-flash-thinking-exp model")
    except:
        try:
            model = genai.GenerativeModel('gemini-1.5-pro')
            print("✅ Using gemini-1.5-pro model")
        except:
            try:
                model = genai.GenerativeModel('gemini-1.5-flash')
                print("✅ Using gemini-1.5-flash model")
            except:
                model = None
                print("❌ No Gemini models available, using mock mode")

# Store generated content
generated_content = {
    'notes': None,
    'flashcards': None,
    'filename': None,
    'timestamp': None
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/notes')
def notes():
    return render_template('notes.html', notes=generated_content['notes'])

@app.route('/flashcards')
def flashcards():
    return render_template('flashcards.html', flashcards=generated_content['flashcards'])

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read file content
        content = file.read().decode('utf-8')
        filename = file.filename
        
        # Generate notes using Gemini API
        if model:
            try:
                notes = generate_gemini_notes(content)
                flashcards = generate_gemini_flashcards(content)
                print("✅ Generated content using Gemini API")
            except Exception as e:
                print(f"❌ Gemini API error: {e}")
                print("🔄 Falling back to mock content")
                notes = generate_mock_notes(content)
                flashcards = generate_mock_flashcards(content)
        else:
            print("🔄 Using mock content (no Gemini model available)")
            notes = generate_mock_notes(content)
            flashcards = generate_mock_flashcards(content)
        
        # Store generated content
        generated_content['notes'] = notes
        generated_content['flashcards'] = flashcards
        generated_content['filename'] = filename
        generated_content['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        mode = "Gemini AI" if model else "Mock Mode"
        return jsonify({
            'success': True,
            'message': f'File processed successfully ({mode})',
            'filename': filename,
            'notes_count': len(notes.split('\n')),
            'flashcards_count': len(flashcards)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_gemini_notes(content):
    """Generate study notes using Gemini API"""
    notes_prompt = f"""
    Please analyze the following text and create comprehensive study notes. 
    Organize the notes in a clear, structured format with main topics, subtopics, and key points.
    Use markdown formatting for better readability. Include:
    - A clear overview and summary
    - Key concepts and main topics
    - Important details and supporting information
    - Study tips and recommendations
    - A conclusion with key takeaways
    
    Text to analyze:
    {content}
    """
    
    try:
        response = model.generate_content(notes_prompt)
        return response.text
    except Exception as e:
        print(f"Error generating notes: {e}")
        return generate_mock_notes(content)

def generate_gemini_flashcards(content):
    """Generate flashcards using Gemini API"""
    flashcards_prompt = f"""
    Please create interactive flashcards from the following text. 
    Generate 10-15 flashcards that cover the most important concepts, facts, and key information.
    Format each flashcard as JSON with "question" and "answer" fields.
    Make the questions clear and specific, and provide comprehensive answers.
    Return only a JSON array of flashcards, no other text.
    
    Text to analyze:
    {content}
    """
    
    try:
        response = model.generate_content(flashcards_prompt)
        flashcards_text = response.text.strip()
        
        # Clean the response to extract JSON
        if flashcards_text.startswith('```json'):
            flashcards_text = flashcards_text[7:-3]
        elif flashcards_text.startswith('```'):
            flashcards_text = flashcards_text[3:-3]
        
        flashcards = json.loads(flashcards_text)
        return flashcards
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print("Falling back to mock flashcards")
        return generate_mock_flashcards(content)
    except Exception as e:
        print(f"Error generating flashcards: {e}")
        return generate_mock_flashcards(content)

def generate_mock_notes(content):
    """Generate mock study notes based on content"""
    lines = content.split('\n')
    word_count = len(content.split())
    
    notes = f"""# Study Notes - Generated from {generated_content.get('filename', 'your file')}

## 📚 Overview
This document contains key concepts and important information extracted from your uploaded text file.

**Document Statistics:**
- Total words: {word_count}
- Total lines: {len(lines)}
- Key topics identified: {min(5, len([line for line in lines if line.strip() and len(line) > 20]))}

## 🎯 Key Concepts

### Main Topics
{chr(10).join([f"- {line.strip()}" for line in lines[:10] if line.strip() and len(line) > 10])}

### Important Points
{chr(10).join([f"1. **{line.strip()}**" for line in lines[10:20] if line.strip() and len(line) > 15])}

## 📝 Detailed Analysis

### Section 1: Introduction
The document begins with foundational concepts that establish the context for the main discussion.

### Section 2: Core Content
The main body of the text contains detailed information about the subject matter, including:
- Technical details and specifications
- Practical applications and examples
- Important considerations and limitations

### Section 3: Key Takeaways
Based on the content analysis, here are the most important points to remember:

1. **Primary Concept**: The main theme or subject of the document
2. **Supporting Details**: Additional information that reinforces the main concept
3. **Practical Applications**: How this information can be used in real-world scenarios
4. **Important Considerations**: Things to keep in mind when applying this knowledge

## 🔍 Study Tips

- **Review regularly**: Go through these notes multiple times for better retention
- **Create connections**: Link new information with what you already know
- **Practice application**: Try to apply these concepts in practical scenarios
- **Ask questions**: Formulate questions about unclear or interesting points

## 📚 Additional Resources

For further study, consider:
- Related documentation and references
- Practice exercises and examples
- Discussion with peers or instructors
- Hands-on experimentation

---
*Generated on {datetime.now().strftime("%Y-%m-%d at %H:%M:%S")}*
"""

    return notes

def generate_mock_flashcards(content):
    """Generate mock flashcards based on content"""
    lines = [line.strip() for line in content.split('\n') if line.strip() and len(line) > 10]
    
    flashcards = []
    
    # Generate flashcards from the content
    for i, line in enumerate(lines[:10]):  # Take first 10 meaningful lines
        if len(line) > 20:  # Only use substantial lines
            question = f"What is the main point about: {line[:50]}...?"
            answer = f"The main point is: {line}"
            flashcards.append({
                "question": question,
                "answer": answer
            })
    
    # Add some general study flashcards if we don't have enough content
    if len(flashcards) < 5:
        general_flashcards = [
            {
                "question": "What is the main topic of this document?",
                "answer": "The main topic covers the key concepts and information presented in the uploaded text file."
            },
            {
                "question": "How many words are in this document?",
                "answer": f"This document contains approximately {len(content.split())} words."
            },
            {
                "question": "What should you do to study this material effectively?",
                "answer": "Review regularly, create connections with prior knowledge, practice application, and ask questions about unclear points."
            },
            {
                "question": "What are the key sections of this study material?",
                "answer": "The material is organized into overview, key concepts, detailed analysis, study tips, and additional resources."
            },
            {
                "question": "When was this study material generated?",
                "answer": f"This material was generated on {datetime.now().strftime('%Y-%m-%d at %H:%M:%S')}."
            }
        ]
        flashcards.extend(general_flashcards[:5-len(flashcards)])
    
    return flashcards

@app.route('/api/notes')
def get_notes():
    return jsonify(generated_content['notes'])

@app.route('/api/flashcards')
def get_flashcards():
    return jsonify(generated_content['flashcards'])

if __name__ == '__main__':
    print("🚀 Starting Gemini Study Assistant...")
    if model:
        print("🤖 Using Gemini AI for content generation")
    else:
        print("📝 Using mock content (Gemini API not available)")
    print("🌐 Access at: http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
