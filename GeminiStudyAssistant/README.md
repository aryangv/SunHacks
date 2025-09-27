# Gemini Study Assistant

An AI-powered study tool that generates comprehensive study notes and interactive flashcards from text files using Google's Gemini AI.

## Features

- 📝 **Smart Notes**: AI-generated comprehensive study notes with clear structure and key concepts highlighted
- 🎯 **Interactive Flashcards**: Test your knowledge with AI-created flashcards covering the most important topics
- ⚡ **Instant Generation**: Get your study materials in seconds using Google's advanced Gemini AI
- 🔍 **Search Functionality**: Search through your notes with highlighting
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📄 **Export Options**: Export notes as text files
- 🖨️ **Print Support**: Print your notes for offline study

## Installation

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**:
   ```bash
   python app.py
   ```

3. **Access the Application**:
   Open your browser and go to `http://localhost:5001`

## Usage

1. **Upload a Text File**: 
   - Click "Choose File" or drag and drop a text file
   - Supported formats: .txt, .md, .py, .js, .html, .css

2. **Generate Study Materials**:
   - Click "Generate Study Materials" to process your file
   - The AI will analyze your content and create notes and flashcards

3. **View Notes**:
   - Click "View Notes" to see your generated study notes
   - Use the search box to find specific content
   - Toggle between readable and compact views

4. **Study with Flashcards**:
   - Click "Study Flashcards" to access interactive flashcards
   - Use keyboard shortcuts for navigation (← → arrows, Space/Enter to flip)
   - Mark cards as known to track your progress

## File Structure

```
GeminiStudyAssistant/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── sample_text.txt       # Sample text file for testing
├── README.md             # This file
├── templates/            # HTML templates
│   ├── index.html        # Main upload page
│   ├── notes.html        # Notes display page
│   └── flashcards.html   # Flashcards page
└── static/               # Static assets
    ├── style.css         # Main stylesheet
    ├── notes.css         # Notes page styles
    ├── flashcards.css    # Flashcards page styles
    ├── script.js         # Main JavaScript
    ├── notes.js          # Notes page JavaScript
    └── flashcards.js     # Flashcards page JavaScript
```

## API Configuration

The application uses Google's Gemini AI API. The API key is already configured in the code. If you need to use your own API key:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Replace the API key in `app.py`:
   ```python
   API_KEY = "your-api-key-here"
   ```

## Keyboard Shortcuts (Flashcards)

- **← →**: Navigate between cards
- **Space/Enter**: Flip the current card
- **Ctrl+S**: Shuffle all cards

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

1. **Module Not Found Error**: Make sure all dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```

2. **API Errors**: Check your internet connection and API key validity

3. **File Upload Issues**: Ensure your file is in a supported format and not too large

## License

This project is for educational purposes. Please respect Google's API terms of service when using the Gemini AI features.
