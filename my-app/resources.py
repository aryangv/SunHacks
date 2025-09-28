import streamlit as st
import google.generativeai as genai
import pandas as pd
import plotly.express as px
import random
from collections import defaultdict
from datetime import datetime
import os
from dotenv import load_dotenv


# Load environment variables
load_dotenv()


# Custom CSS
def load_css():
    with open('.streamlit/style.css') as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)


# Page configuration
st.set_page_config(
    page_title="AI Content Recommender",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)


# Load custom CSS
load_css()


class ContentRecommender:
    def __init__(self, user_id="default_user"):
        """Initialize content recommender for tracking user preferences"""
        self.user_id = user_id
        self.preferences = defaultdict(lambda: {"total": 0.0, "count": 0})
        
    def update_preference(self, content_type, rating):
        """Update user preference based on content rating"""
        self.preferences[content_type]["total"] += rating
        self.preferences[content_type]["count"] += 1
    
    def get_preferred_content_type(self):
        """Get user's preferred content type based on ratings"""
        if not any(data["count"] > 0 for data in self.preferences.values()):
            return "mixed"  # Default to mixed if no data
        
        avg_ratings = {
            content_type: data["total"] / data["count"] 
            for content_type, data in self.preferences.items() 
            if data["count"] > 0
        }
        
        return max(avg_ratings, key=avg_ratings.get)


class GeminiContentRecommender:
    def __init__(self, api_key=None):
        """Initialize Gemini API wrapper for content recommendations"""
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
        else:
            # Try to get API key from environment
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
            else:
                self.model = None
        
    def analyze_learning_style(self, text):
        """Analyze text to determine learning style only"""
        if not self.model:
            return "API key not configured"
            
        prompt = f"""
        Analyze the following text and determine ONLY the learning style preference.
        Choose ONE from these options:
        - Visual (prefers diagrams, charts, videos, images)
        - Auditory (prefers listening, discussions, lectures)
        - Kinesthetic/Hands-on (prefers practical exercises, projects, doing)
        - Reading/Writing (prefers text, documentation, written materials)
        - Theoretical (prefers concepts, frameworks, abstract thinking)
        
        User Input: {text}
        
        Respond with ONLY the learning style, nothing else.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error analyzing learning style: {str(e)}"
    
    
    def recommend_websites(self, text, learning_style, num_sites=5):
        """Generate website recommendations based on user input and learning style"""
        if not self.model:
            return "API key not configured"
            
        prompt = f"""
        Based on the user's input and learning style, recommend {num_sites} specific websites.
        
        User Input: {text}
        Learning Style: {learning_style}
        
        For each website, provide:
        - Website name and URL (realistic, legitimate educational sites)
        - Brief description (1-2 sentences)
        - Why it matches the user's needs
        - Type of content (articles, tutorials, documentation, forums, etc.)
        
        Format as a numbered list with clear sections for each website.
        Focus on authoritative, educational, and helpful websites that match the user's interests.
        Include a mix of content types (documentation, tutorials, communities, tools).
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating website recommendations: {str(e)}"


def extract_text_from_file(uploaded_file):
    """Extract text content from uploaded file"""
    try:
        if uploaded_file.type == "text/plain":
            return uploaded_file.read().decode("utf-8")
        elif uploaded_file.type == "application/pdf":
            # For PDF files, you would need PyPDF2 or similar
            return "PDF files not supported yet. Please upload a .txt file."
        else:
            return "Unsupported file type. Please upload a .txt file."
    except Exception as e:
        return f"Error reading file: {str(e)}"


def main():
    # Main header with gradient background
    st.markdown("""
    <div class="main-header fade-in">
        <h1>🎯 AI Content Recommender</h1>
        <p>Get personalized website recommendations based on your interests and learning style</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Feature highlights
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div class="feature-card">
            <h3>🧠 Learning Style Analysis</h3>
            <p>AI analyzes your text to understand your preferred learning style</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="feature-card">
            <h3>✨ Smart Recommendations</h3>
            <p>Get personalized resource recommendations tailored to your goals</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="feature-card">
            <h3>🌐 Website Resources</h3>
            <p>Discover relevant websites, tutorials, and learning resources</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Initialize session state
    if 'gemini_recommender' not in st.session_state:
        # Try to initialize with environment variable
        api_key = os.getenv('GEMINI_API_KEY')
        st.session_state.gemini_recommender = GeminiContentRecommender(api_key)
    if 'content_recommender' not in st.session_state:
        st.session_state.content_recommender = ContentRecommender()
    if 'recommendation_history' not in st.session_state:
        st.session_state.recommendation_history = []
    
    # Check API key status
    api_key_configured = os.getenv('GEMINI_API_KEY') is not None
    if not api_key_configured:
        st.markdown("""
        <div class="stWarning">
            <h4>⚠️ API Key Required</h4>
            <p>Please create a <code>.env</code> file with your Gemini API key:</p>
            <code>GEMINI_API_KEY=your_api_key_here</code>
        </div>
        """, unsafe_allow_html=True)
    
    # Sidebar for settings
    with st.sidebar:
        st.markdown("""
        <div class="analytics-card">
            <h2>⚙️ Settings</h2>
        </div>
        """, unsafe_allow_html=True)
        
        # API key status
        if api_key_configured:
            st.success("✅ API key loaded from environment")
        else:
            st.error("❌ API key not found in environment")
            st.markdown("Create a `.env` file with:")
            st.code("GEMINI_API_KEY=your_api_key_here")
        
        st.markdown("---")
        
        # Content preferences
        st.markdown("""
        <div class="analytics-card">
            <h2>📊 Your Preferences</h2>
        </div>
        """, unsafe_allow_html=True)
        
        preferred_content = st.session_state.content_recommender.get_preferred_content_type()
        if preferred_content != "mixed":
            st.info(f"🎯 Preferred content type: **{preferred_content.title()}**")
        else:
            st.info("📊 No preferences yet - start getting recommendations!")
        
        # Feedback form
        st.markdown("### 📝 Rate Recommendations")
        with st.form("feedback_form"):
            content_type = st.selectbox(
                "📱 Content Type", 
                ["websites", "mixed"],
                help="What type of content did you just receive?"
            )
            rating = st.slider(
                "⭐ Rating", 
                1.0, 5.0, 3.0,
                help="How helpful were these recommendations?"
            )
            
            if st.form_submit_button("📤 Submit Rating", use_container_width=True):
                st.session_state.content_recommender.update_preference(content_type, rating)
                st.success("✅ Rating submitted! Thank you for improving recommendations.")
    
    # Main content area
    st.markdown("""
    <div class="feature-card">
        <h2>📄 Upload a file with your interests</h2>
        <p>Upload a text file describing what you want to learn, your questions, or interests. Our AI will analyze your content and recommend the best websites and learning resources for you.</p>
    </div>
    """, unsafe_allow_html=True)
    
    if not api_key_configured:
        st.markdown("""
        <div class="stWarning">
            <h4>⚠️ Setup Required</h4>
            <p>Please configure your Gemini API key in the .env file to get started.</p>
        </div>
        """, unsafe_allow_html=True)
    else:
        # File input section
        uploaded_file = st.file_uploader(
            "Choose a text file",
            type=['txt'],
            help="Upload a .txt file containing your interests, questions, or learning goals"
        )
        
        if uploaded_file is not None:
            # Extract text from file
            file_content = extract_text_from_file(uploaded_file)
            
            if file_content and not file_content.startswith("Error") and not file_content.startswith("Unsupported"):
                st.success("✅ File uploaded successfully!")
                
                # Display file content
                with st.expander("📄 View File Content", expanded=False):
                    st.text_area("File Content", file_content, height=200, label_visibility="collapsed")
                
                col1, col2 = st.columns([3, 1])
                with col2:
                    if st.button("🎯 Get Recommendations", type="primary", use_container_width=True):
                        with st.spinner("🔄 Analyzing your content..."):
                            # Analyze learning style
                            learning_style = st.session_state.gemini_recommender.analyze_learning_style(file_content)
                        
                        with st.spinner("🌐 Finding websites..."):
                            # Get website recommendations
                            website_recommendations = st.session_state.gemini_recommender.recommend_websites(
                                file_content, learning_style, num_sites=5
                            )
                        
                        # Store in history
                        recommendation_entry = {
                            "timestamp": datetime.now(),
                            "file_content": file_content[:200] + "..." if len(file_content) > 200 else file_content,
                            "learning_style": learning_style,
                            "website_recommendations": website_recommendations
                        }
                        st.session_state.recommendation_history.append(recommendation_entry)
                        
                        # Display results
                        st.success("✅ Recommendations generated!")
                        
                        # Learning Style Analysis
                        st.markdown("## 🧠 Learning Style Analysis")
                        st.info(f"**Your Learning Style:** {learning_style}")
                        
                        # Website Recommendations
                        st.markdown("## 🌐 Website Recommendations")
                        st.markdown(website_recommendations)
                        
                        # Success notification
                        st.balloons()
            
            elif file_content.startswith("Error") or file_content.startswith("Unsupported"):
                st.error(file_content)
        
        # Show examples if no file uploaded
        if uploaded_file is None:
            st.markdown("""
            <div class="analytics-card">
                <h4>💡 Example file content:</h4>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
I'm struggling with Python programming and need help with data structures. 
I feel confused about when to use lists vs dictionaries. I'm a beginner 
and prefer hands-on learning with practical examples. I want to understand 
the fundamentals before moving to more advanced topics.
                </pre>
            </div>
            """, unsafe_allow_html=True)
    
    # Recommendation History
    if st.session_state.recommendation_history:
        st.markdown("---")
        st.markdown("## 📚 Recent Recommendations")
        
        for i, entry in enumerate(reversed(st.session_state.recommendation_history[-3:])):
            with st.expander(f"📄 {entry['file_content'][:50]}... - {entry['timestamp'].strftime('%Y-%m-%d %H:%M')}", expanded=False):
                st.markdown("**File Content:**")
                st.write(entry['file_content'])
                st.markdown(f"**Learning Style:** {entry['learning_style']}")
                st.markdown("**🌐 Websites:**")
                st.write(entry['website_recommendations'][:200] + "..." if len(str(entry['website_recommendations'])) > 200 else entry['website_recommendations'])
    
    # Enhanced Footer
    st.markdown("""
    <div class="footer">
        <h3>🎯 AI Content Recommender</h3>
        <p>Built with ❤️ using Streamlit and Google Gemini AI</p>
        <p>Features: Learning Style Analysis | Website Suggestions | File Upload</p>
        <p style="font-size: 12px; opacity: 0.8; margin-top: 1rem;">
            Discover the perfect content for your learning journey with AI-powered recommendations
        </p>
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()