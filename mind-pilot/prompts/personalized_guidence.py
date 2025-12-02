import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

def personalized_guidance(student, gap):
    prompt = f"""
    You are an AI Mentor.

    Student Profile:
    {student}

    Gaps:
    {gap}

    Give a very personal custom guidance:
    - Learning strategy
    - Daily/weekly routine
    - Mindset & motivation
    - Mistakes to avoid
    - Best career advice
    """
    return model.invoke(prompt).content
