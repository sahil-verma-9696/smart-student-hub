# main.py
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), 'prompts'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from prompts.skill_analysis import analyze_skills
from prompts.roadmap_generator import generate_roadmap
from prompts.interview_preparation import interview_prep

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    role: str | None = None
    conversation: list[dict] | None = []
    message: str | None = None
    user: dict | None = None

@app.get("/")
def home():
    return {"message": "MindPilot backend running 🚀"}

# ----------------SKILL ----------------
@app.post("/skill")
async def skill_route(request: AnalysisRequest):
    if not request.user:
        return {"error": "⚠ User data missing!"}

    # Handle both userData and direct student data structures
    student = request.user.get("userData") or request.user.get("student") or request.user
    if not student or (isinstance(student, dict) and not student.get("name")):
        return {"error": "⚠ User data missing!"}

    result = analyze_skills(student, None)

    if not result:
        result = """
### 🧠 Skill Analysis
Strengths:
- Communication
- Basic coding ability

Areas to Improve:
- Practice more coding challenges
- Work on real projects
"""
    return {"result": result}

# ----------------ROADMAP ----------------
@app.post("/roadmap")
async def roadmap_route(request: AnalysisRequest):
    if not request.user:
        return {"error": "⚠ User data missing!"}
    if not request.role:
        return {"error": "⚠ Please provide role!"}

    # Handle both userData and direct student data structures
    student = request.user.get("userData") or request.user.get("student") or request.user
    if not student or (isinstance(student, dict) and not student.get("name")):
        return {"error": "⚠ User data missing!"}

    result = generate_roadmap(student, None, request.role)

    if not result:
        result = f"""
## 🚀 Roadmap for **{request.role}**

1️⃣ Learn fundamentals  
2️⃣ Build 2–3 projects  
3️⃣ Document work  
4️⃣ Prepare LinkedIn + Resume  
"""

    return {"result": result}

# ----------------INTERVIEW ----------------
@app.post("/interview")
async def interview_route(request: AnalysisRequest):
    if not request.user:
        return {"error": "⚠ User data missing!"}
    if not request.role:
        return {"error": "⚠ Please provide role!"}

    # Handle both userData and direct student data structures
    student = request.user.get("userData") or request.user.get("student") or request.user
    if not student or (isinstance(student, dict) and not student.get("name")):
        return {"error": "⚠ User data missing!"}

    result = interview_prep(student, request.role, request.conversation or [])

    if not result:
        result = f"""
### 🎤 Interview Prep – {request.role}

1. Tell me about yourself  
2. Why should we hire you?  
3. Explain a project you built  
4. What challenges did you face?
"""
    return {"result": result}

# ---------------- AUTO ----------------
@app.post("/analyze")
async def analyze_auto(request: AnalysisRequest):
    if not request.user:
        return {"error": "⚠ User data missing!"}

    # Handle both userData and direct student data structures
    student = request.user.get("userData") or request.user.get("student") or request.user
    if not student or (isinstance(student, dict) and not student.get("name")):
        return {"error": "⚠ User data missing!"}

    role = request.role or "software engineer"
    msg = (request.message or "").lower()

    if "skill" in msg:
        return {"result": "🧠 Skill analysis looks good."}

    if "roadmap" in msg:
        return {"result": f"🛣️ Here is your roadmap for becoming a {role}"}

    if "interview" in msg:
        return {"result": "🎤 Interview prep started!"}

    return {"result": "⚠ Please ask: skill / roadmap / interview"}
