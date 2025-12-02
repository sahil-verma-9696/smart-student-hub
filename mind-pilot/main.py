# main.py
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), 'prompts'))

import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import logic
from ideal import calculate_ideal_student
from gap_find import calculate_gap
from prompts.skill_analysis import analyze_skills
from prompts.roadmap_generator import generate_roadmap
from prompts.interview_preparation import interview_prep

BASE_DIR = Path(__file__).resolve().parent
app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------ Input Model ------
class AnalysisRequest(BaseModel):
    role: str | None = None
    conversation: list[dict] | None = []
    message: str | None = None   # only required for /analyze

# ------ Utility to load student ------
def load_student_data():
    """Load student & gap data safely"""
    try:
        with open(BASE_DIR / "self.json", "r", encoding="utf-8") as f:
            student = json.load(f)
        with open(BASE_DIR / "students.json", "r", encoding="utf-8") as f:
            students = json.load(f)
    except Exception as e:
        return None, None, f"Error loading data: {e}"

    ideal = calculate_ideal_student(students)
    gap = calculate_gap(student, ideal)
    return student, gap, None

# ------ Default Route ------
@app.get("/")
def home():
    return {"message": "MindPilot backend running 🚀"}

# ==================================================
#        SEPARATE FEATURE ROUTES (POSTMAN READY)
# ==================================================

# 1️⃣ Skill Analysis
@app.post("/skill")
async def skill_route(request: AnalysisRequest):
    student, gap, err = load_student_data()
    if err:
        return {"error": err}
    result = analyze_skills(student, gap)  # no role needed
    return {"result": result}

# 2️⃣ Roadmap (role REQUIRED)
@app.post("/roadmap")
async def roadmap_route(request: AnalysisRequest):
    if not request.role:
        return {"error": "⚠ Please provide role field!"}

    student, gap, err = load_student_data()
    if err:
        return {"error": err}

    result = generate_roadmap(student, gap, request.role)
    return {"result": result}

# 3️⃣ Interview Prep (role REQUIRED)
@app.post("/interview")
async def interview_route(request: AnalysisRequest):
    if not request.role:
        return {"error": "⚠ Please provide role field!"}

    student, gap, err = load_student_data()
    if err:
        return {"error": err}

    result = interview_prep(student, request.role, request.conversation or [])
    return {"result": result}

# ==================================================
#   OLD /analyze (OPTIONAL - KEEPS FRONTEND SAFE)
# ==================================================
@app.post("/analyze")
async def analyze_auto(request: AnalysisRequest):
    student, gap, err = load_student_data()
    if err:
        return {"error": err}

    role = request.role or "software engineer"
    msg = (request.message or "").lower()

    if "skill" in msg or "gap" in msg:
        result = analyze_skills(student, gap)
    elif "roadmap" in msg or "path" in msg:
        result = generate_roadmap(student, gap, role)
    elif "interview" in msg:
        result = interview_prep(student, role, request.conversation or [])
    else:
        result = "⚠ Tell me: skill / roadmap / interview"

    return {"result": result}
