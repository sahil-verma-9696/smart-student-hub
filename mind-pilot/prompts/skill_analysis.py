# prompts/skill_analysis.py
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()  # Load API from .env file

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

def analyze_skills(student, gap):
    prompt = f"""
You are a **Professional Skill Assessment AI**.
Analyze the student's skills and suggest a **practical growth plan**.

📌 **Student Data Provided:**
{student}

📉 **Gaps Identified (AI-calculated):**
{gap}

---
# ⚠ IMPORTANT FORMAT RULES – FOLLOW STRICTLY
- MUST use clear headings ONLY  
- MUST use bullet points (•) or tables  
- MUST NOT use paragraphs  
- MUST use line breaks (\n)  
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

    return model.invoke(prompt).content
