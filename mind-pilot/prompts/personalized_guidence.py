import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

def personalized_guidance(student, gap, message, conversation=None):
    conversation_text = ""
    if conversation:
        conversation_text = "\n".join([f"{msg.get('role', 'User')}: {msg.get('content', '')}" for msg in conversation])

    prompt = f"""
    You are an AI Mentor named **MindPilot**.
    
    Student Profile:
    {student}

    Gaps Identified:
    {gap}

    Conversation History:
    {conversation_text}

    User Query: "{message}"

    Provide a helpful, personalized response to the user's query based on their profile and gaps.
    If the query is general, provide custom guidance on:
    - Learning strategy
    - Daily/weekly routine
    - Mindset & motivation
    - Mistakes to avoid
    - Best career advice
    """
    try:
        return model.invoke(prompt).content
    except Exception as e:
        return f"""
# ⚠️ AI Service Unavailable (Fallback Mode)

**Error:** {str(e)}

**Response to:** "{message}"

As an AI Mentor, I recommend focusing on your core strengths and addressing the identified gaps.
Since I cannot process your specific query right now, here is some general advice:
- **Consistency is key.** Code every day.
- **Build projects.** Theory is not enough.
- **Network.** Connect with peers and mentors.

**Note:** Please check your API key configuration.
"""
