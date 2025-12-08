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

    # Extract detailed student information for highly personalized mentoring
    student_name = student.get("name", "Student")
    student_education = student.get("education", "Not specified")
    student_skills = student.get("skills", [])
    student_languages = student.get("languages", [])
    student_projects = student.get("projects", [])
    student_achievements = student.get("achievements", [])
    student_strengths = student.get("strengths", [])
    student_weaknesses = student.get("weaknesses", [])
    student_target_role = student.get("target_role", "Software Engineer")
    student_experience = student.get("experience", "Fresher")
    student_learning_style = student.get("learning_style", "Hands-on Project-Based")
    student_email = student.get("email", "")
    
    prompt = f"""
    You are an AI Mentor named **MindPilot**, providing highly personalized 1-on-1 guidance.
    
    **📌 Student Profile - {student_name}:**
    - Email: {student_email}
    - Education: {student_education}
    - Experience Level: {student_experience}
    - Target Career Role: {student_target_role}
    - Languages Known: {student_languages if student_languages else 'None specified'}
    - Current Skills: {student_skills if student_skills else 'None listed'}
    - Projects Built: {len(student_projects)} total
    - Key Achievements: {student_achievements if student_achievements else 'None listed'}
    - Identified Strengths: {student_strengths if student_strengths else 'None identified'}
    - Areas for Growth: {student_weaknesses if student_weaknesses else 'None identified'}
    - Preferred Learning Style: {student_learning_style}

    **🎯 Career Goal:**
    Become a successful **{student_target_role}**

    **📊 Identified Gaps:**
    {gap}

    **💬 Conversation History:**
    {conversation_text}

    **❓ {student_name}'s Question:**
    "{message}"

    ---

    ## 🎯 YOUR MENTORING GUIDELINES
    1. Always address **{student_name}** by their name - make it personal
    2. Reference their specific achievements and projects in your response
    3. Build on their strengths: {student_strengths[:1] if student_strengths else 'Strong foundation'}
    4. Address weaknesses constructively: {student_weaknesses[:1] if student_weaknesses else 'Focus on consistent practice'}
    5. Tailor advice to their learning style: **{student_learning_style}**
    6. Keep {student_target_role} goal in mind for all recommendations
    7. Be encouraging but realistic (they are {student_experience})
    
    **Response Format:**
    - Start with a friendly personalized greeting mentioning something about {student_name}'s profile
    - Answer their question with specific, actionable advice
    - Reference their projects or achievements when possible
    - End with a motivational statement and next steps

    ---

    Provide a highly personalized response that shows you understand {student_name}'s unique journey toward {student_target_role}."""
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
