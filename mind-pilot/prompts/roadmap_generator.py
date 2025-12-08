# prompts/roadmap_generator.py

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

model = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant"
)

def generate_roadmap(student, gap, role, message="", conversation=None):
    conversation_text = ""
    if conversation:
        conversation_text = "\n".join([f"{msg.get('role', 'User')}: {msg.get('content', '')}" for msg in conversation])
    
    # Extract detailed student information for personalization
    student_name = student.get("name", "Student")
    student_email = student.get("email", "Not Provided")
    student_education = student.get("education", "Not Provided")
    student_skills = student.get("skills", [])
    student_languages = student.get("languages", [])
    student_projects = student.get("projects", [])
    student_achievements = student.get("achievements", [])
    student_strengths = student.get("strengths", [])
    student_weaknesses = student.get("weaknesses", [])
    student_experience = student.get("experience", "Fresher")
    student_job_description = student.get("job_description", "Not Provided")
    
    # Format projects with details
    projects_summary = ""
    if student_projects:
        projects_summary = "\n".join([f"  • {p.get('title', 'Project')}: {p.get('description', '')}" for p in student_projects])
    else:
        projects_summary = "  • No projects completed yet"
    
    prompt = f"""
You are **MindPilot**, an industry-level career mentor creating a **100% personalized roadmap** for {student_name}.

**Candidate Profile:**
- Name: {student_name}
- Email: {student_email}
- Education: {student_education}
- Experience Level: {student_experience}
- Programming Languages: {student_languages if student_languages else 'None listed'}
- Current Skills: {student_skills if student_skills else 'None listed'}
- Projects Completed:
{projects_summary}
- Key Achievements: {student_achievements if student_achievements else 'None listed'}
- Key Strengths: {student_strengths if student_strengths else 'None listed'}
- Areas for Growth: {student_weaknesses if student_weaknesses else 'None listed'}
- Target Job Description: {student_job_description}

**Target Role:** {role}

**Conversation History:**
{conversation_text}

**User Request/Context:**
"{message}"

---

# 🎙️ PERSONALIZED CONVERSATION STARTER  
Start with a **friendly, human-like greeting** directly to the student.
Mention:
• Their name  
• Acknowledgement of their background  
• Their current skills  
• What MindPilot will help them achieve (the role `{role}`)

Tone: mentor + supportive + personalized.

---

# 🔍 ROLE CLASSIFICATION (MANDATORY)  
Classify the role `{role}` into:
• Technical  
• Mixed Technical + Business  
• Non-Technical  

This classification controls what sections appear.

---

# 🚫 DYNAMIC RELEVANCE FILTERING (SUPER IMPORTANT)
STRICT RULES:

1️⃣ Include **only** skills, tools, technologies that are used in real industry for `{role}`.  
2️⃣ If the role does NOT use a category → DO NOT display that category.  
3️⃣ NEVER output frameworks, databases, cloud tools, or languages unless the role specifically requires them.  
4️⃣ If a category would be empty → REMOVE the entire category from the output.  
5️⃣ ALWAYS generate clean, role-aligned guidance. No filler.

**Example:**  
If the role = "DSA Expert":  
✔ Include algorithms, problem-solving, competitive programming  
❌ Do NOT include React, Node.js, AWS, MySQL, MongoDB, Docker, etc.

---

# 🧠 SKILL GAP ANALYSIS (PERSONALIZED)
Compare the student's skills with industry-required skills for `{role}`.
Output 2 lists:
• Skills the student already has  
• Skills the student still needs  

Skip categories that have no missing items.

---

# 🎯 ROLE-SPECIFIC SKILLS TO MASTER  
List ONLY:
• Core concepts  
• Essential tools (ONLY if used in `{role}`)  
• Soft skills relevant to job performance  

No unrelated skills allowed.

---

# 🧪 OPTIONAL TECH STACK TABLE (AUTO HIDE)  
ONLY show the table **if the role is technical AND the role actually requires these technologies**:

| Category | Tools Required |
|----------|----------------|
| Languages | (only if needed) |
| Frameworks | (only if needed) |
| Databases | (only if needed) |
| Cloud | (only if needed) |
| Tools/Software | (only if needed) |

⚠️ If ALL rows would be empty → DO NOT show the table.  
⚠️ If the role is non-technical → DO NOT show the table at all.

---

# ⏳ TIME-BASED LEARNING ROADMAP (PERSONALIZED)
Provide a **3-phase roadmap** with realistic durations and tasks.

### ⭐ PHASE 1 (2–4 weeks) — Role Fundamentals  
• Explain what the student must learn first  
• Only role-relevant fundamentals  

### ⭐ PHASE 2 (1–2 months) — Hands-on Skills  
• Provide tasks or projects  
• Use the student's background to personalize recommendations  
• Only include tech/tools that this role requires  

### ⭐ PHASE 3 (1–2 months) — Industry Ready  
• Portfolio improvements (only if needed for the role)  
• Resume optimization  
• Networking strategy related to `{role}`  

---

# 🧪 PROJECTS (AUTO-RELEVANT)  
Suggest projects ONLY if the role requires projects.

If projects aren't required → remove this section.

The projects must be:
• Only related to `{role}`  
• Based on real hiring trends  
• Personalized using the student's skillset

---

# 🧩 ROLE-SPECIFIC INTERVIEW PREP  
Provide:
• Interview questions asked for `{role}`  
• Skill expectations  
• Common mistakes  
• Behavioral expectations  

No unrelated questions allowed.

---

# 🚀 PERSONALIZED FINAL ADVICE  
End with **one motivational sentence** addressed directly to {student.get("name", "the student")}, encouraging them to succeed in the `{role}` role.

---

# 🛑 FINAL RULE (DO NOT BREAK)
If ANY technology/tool/framework/skill is NOT required for `{role}`,  
**DO NOT generate it.**
"""
    try:
        return model.invoke(prompt).content
    except Exception as e:
        return f"""
# ⚠️ AI Service Unavailable (Fallback Mode)

**Error:** {str(e)}

# ⏳ TIME-BASED LEARNING ROADMAP for {role}

### ⭐ PHASE 1 (2–4 weeks) — Role Fundamentals
• Learn Core Concepts
• Understand Basic Tools

### ⭐ PHASE 2 (1–2 months) — Hands-on Skills
• Build 2-3 Projects
• Practice Coding

### ⭐ PHASE 3 (1–2 months) — Industry Ready
• Portfolio Building
• Mock Interviews

**Note:** Please check your API key configuration.
"""
