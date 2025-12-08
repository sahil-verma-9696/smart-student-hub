# prompts/interview_preparation.py

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

def interview_prep(student, role, conversation, message=""):
    # Extract student details for highly personalized interview prep
    student_name = student.get("name", "Student")
    student_education = student.get("education", "Not Provided")
    student_skills = student.get("skills", [])
    student_projects = student.get("projects", [])
    student_achievements = student.get("achievements", [])
    student_experience = student.get("experience", "Fresher")
    student_strengths = student.get("strengths", [])
    
    # Format projects for reference
    projects_list = ""
    if student_projects:
        projects_list = "\n".join([f"    • {p.get('title', 'Project')}: {p.get('description', '')}" for p in student_projects[:3]])  # Top 3
    
    prompt = f"""
You are an **Industry-Level Role-Specific Interview Preparation AI** preparing {student_name} for interviews.

🎯 **Target Job Role: {role}**
👤 **Candidate: {student_name}**
   - Education: {student_education}
   - Experience Level: {student_experience}
   - Skills: {student_skills if student_skills else 'None listed'}
   - Key Strengths: {student_strengths if student_strengths else 'None identified'}

📋 **Candidate's Portfolio:**
   - Projects:
{projects_list if projects_list else '     No projects yet'}
   - Achievements: {student_achievements if student_achievements else 'None listed'}

**User Request/Context:**
"{message}"

---

## 📌 PERSONALIZATION RULES
- Address {student_name} by name when giving advice
- Reference their specific projects and achievements in examples
- Consider their experience level ({student_experience}) when suggesting interview difficulty
- Build confidence by highlighting their strengths: {student_strengths}

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
    try:
        return model.invoke(prompt).content
    except Exception as e:
        return f"""
# ⚠️ AI Service Unavailable (Fallback Mode)

**Error:** {str(e)}

## 🧠 CORE SKILLS REQUIRED for {role}
• Skill 1
• Skill 2
• Skill 3

## 🧩 REAL INTERVIEW EXPECTATIONS
• Expect technical questions
• Expect behavioral questions

## 🧠 LAST 2 WEEKS PREPARATION
• Week 1: Revision
• Week 2: Mocks

**Note:** Please check your API key configuration.
"""
