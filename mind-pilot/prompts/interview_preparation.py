# prompts/interview_preparation.py

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

def interview_prep(student, role, conversation):
    prompt = f"""
You are an **Industry-Level Role-Specific Interview Preparation AI**.
Generate **ONLY relevant interview preparation content** for the role:
🎯 **Target Job Role: {role}**

---

## 🚨 STRICT RULES — MUST FOLLOW
1. First determine if the role is:
   - **Technical / Semi-Technical / Non-Technical**
2. Then classify it into EXACT category:
   Web Dev / Backend / Frontend / AI–ML / Data / Cybersecurity / Testing /
   Cloud / DevOps / UI-UX / Business Analyst / HR / Marketing / Finance / Management
3. Based on classification →
   **ONLY show sections that make sense for that role**
4. If ANY section does not apply → **SKIP IT COMPLETELY**
5. If role is unclear → return:
   **"Please specify exact domain (e.g., Data Analyst / HR Manager / UI-UX Designer)"**
6. NEVER generate irrelevant content. NEVER assume.

---

## 🔍 ROLE ANALYSIS (COMPULSORY FIRST)
| Role Type | Technical? | Why this category |
|-----------|-------------|-------------------|
|           | YES / NO    | Brief reason      |

❗ If role is Non-Technical → DO NOT include coding, tech-stack, DSA, or projects.

---

## 🧠 CORE SKILLS REQUIRED (ONLY ROLE-SPECIFIC)
•  
•  
•  

👉 If the role is **non-tech**, focus on:
• Case study solving  
• Market knowledge  
• Teamwork / communication  
• Critical thinking  

---

## ⚙ TECH STACK (ONLY IF TECHNICAL ROLE)
FORMAT MUST BE:
| Category   | Tools |
|------------|-------|
| Languages  |       |
| Frameworks |       |
| Databases  |       |
| Cloud (if needed) | |
| Testing Tools |     |

❌ **If {role} does NOT need coding — skip this section COMPLETELY**

---

## 📚 BEST RESOURCES (ONLY ROLE-SPECIFIC)
| Purpose | Best Resource |
|---------|----------------|
| Basics |                |
| Advanced |              |
| Mock Tests |            |
| Practice |              |

⚠ Do NOT include random platforms.
⚠ NO more than 6 resources.

---

## 🧪 PRACTICAL PREPARATION (PROJECTS OR CASE-STUDY)
IF TECHNICAL → Provide:
• Beginner project  
• Intermediate project  
• Industry-level project  

IF NON-TECH → Provide:
• Case-study analysis  
• Presentation topic  
• Strategy task / simulated interview  

---

## 🧩 REAL INTERVIEW EXPECTATIONS (FOR THIS ROLE ONLY)
Recruiters will check:
•  
•  
Common fresher mistakes:
•  

---

## 🧠 LAST 2 WEEKS PREPARATION (INTERVIEW MODE)
| Week | Focus |
|------|-------|
| 1 | Core revision |
| 2 | Mock interview |
| 3 | Resume & LinkedIn polish |
| 4 | Communication & HR prep |

---

## 🏁 FINAL CAREER-WINNING ADVICE  
**Format must be:**

"To become a successful {role}, you must …" **(finish in one powerful sentence).**

---

## 🛑 IMPORTANT — CONTENT VALIDATION RULE
**Before sending final answer — check:**
- Does every section relate to {role}?
- Remove unnecessary sections  
- Final output MUST look like a professional interview mentor  

"""
    return model.invoke(prompt).content
