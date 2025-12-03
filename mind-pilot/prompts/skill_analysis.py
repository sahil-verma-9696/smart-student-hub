# prompts/skill_analysis.py
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

def analyze_skills(student, gap, message="", conversation=None):
    conversation_text = ""
    if conversation:
        conversation_text = "\n".join([f"{msg.get('role', 'User')}: {msg.get('content', '')}" for msg in conversation])

    prompt = f"""
You are **MindPilot**, an expert career advisor.

**Student Profile:**
- Name: {student.get("profile", {}).get("name", "Student")}
- Age: {student.get("profile", {}).get("age", "N/A")}
- Education: {student.get("profile", {}).get("education", "N/A")}
- Current Skills: {student.get("profile", {}).get("skills", [])}
- Interests: {student.get("profile", {}).get("interests", [])}

**Gap Analysis:**
{gap}

**Conversation History:**
{conversation_text}

**User Request/Context:**
"{message}"

(If the user request is specific, prioritize it. Otherwise, perform a standard skill analysis.)

---

# ⚠ CRITICAL INSTRUCTION
YOU MUST START YOUR RESPONSE WITH:
"Hi {student.get("profile", {}).get("name", "Student")}! 👋"

Then provide the analysis below.

---

# ⚠ IMPORTANT FORMAT RULES – FOLLOW STRICTLY
- MUST use clear headings ONLY  
- MUST use bullet points (•) or tables  
- MUST NOT use paragraphs  
- MUST use line breaks (\\n)  
- Response should look like a REAL chatbot answer  

---

# 💪 CURRENT STRENGTHS  
List ONLY skills where the student performs well:
•  
•  
•

---

# ⚠ WEAK AREAS / GAPS  
List ONLY areas that *need improvement*:
•  
•  
•

---

# 📌 QUICK IMPROVEMENT TIPS (MICRO LEARNING)  
• One-line advice per skill  
• Only short courses / resources  
• Mention platforms in brackets (Coursera, YT, Udemy)  
• Max 5 bullets  

---

# 📚 BEST COURSES & RESOURCES  
| Skill | Resource Name | Platform | Duration |
|-------|----------------|----------|----------|
|       |                |          |          |
|       |                |          |          |

---

# 📆 RECOMMENDED LEARNING SCHEDULE  
👉 *Based on student's current level*  
| Week | Focus Area | Expected Result |
|------|-------------|-----------------|
| 1-2  |             |                 |
| 3-4  |             |                 |
| 5-6  |             |                 |

---

# 🚀 90-DAY GROWTH STRATEGY (BEGINNER → ADVANCED)  

### 🔹 PHASE 1 — FOUNDATIONS (Days 1–30)  
Focus: Strong basics only  
•  
•  
Resources:

### 🔸 PHASE 2 — PRACTICE MODE (Days 31–60)  
Focus: Projects & Exercises  
•  
•  
Project Ideas:
• Mini Project:
• Resume Project:

### 🔥 PHASE 3 — JOB READY MODE (Days 61–90)  
Focus: Industry / Resume Level  
•  
•  
Checklist Before Interview:
• Explain 2 projects  
• Self-test weekly  
• Optimize LinkedIn  

---

# 🧠 FINAL PERSONALIZED ADVICE  
End with **ONE powerful tip** based on this student’s data.
(Single sentence, motivational)
"""

    try:
        return model.invoke(prompt).content
    except Exception as e:
        return f"""
# ⚠️ AI Service Unavailable (Fallback Mode)

**Error:** {str(e)}

### 💪 CURRENT STRENGTHS
• Java
• DSA
• SQL

### ⚠ WEAK AREAS / GAPS
• System Design
• Advanced Cloud Concepts

### 📌 QUICK IMPROVEMENT TIPS
• Practice System Design on Exponent (YouTube)
• Build a cloud-native project

### 🚀 90-DAY GROWTH STRATEGY
• Phase 1: Master Fundamentals
• Phase 2: Build Projects
• Phase 3: Mock Interviews

**Note:** Please check your API key configuration.
"""
