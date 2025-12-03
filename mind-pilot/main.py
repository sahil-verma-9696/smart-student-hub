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

# ==================================================
#   NGROK ROUTES FOR POSTMAN TESTING
# ==================================================

def get_student_by_id(student_id: str):
    """Load student data by ID from students.json"""
    try:
        with open(BASE_DIR / "students.json", "r", encoding="utf-8") as f:
            students = json.load(f)
        
        # Try to parse as int index
        try:
            idx = int(student_id)
            if 0 <= idx < len(students):
                return students[idx], None
        except ValueError:
            pass
        
        # Default to first student if ID not found
        return students[0] if students else None, None
    except Exception as e:
        return None, f"Error loading student: {e}"

@app.post("/py/student/{student_id}/get-mindpiolet")
async def ngrok_mindpilot_post(student_id: str, request: AnalysisRequest):
    """Ngrok-compatible POST endpoint for MindPilot chat"""
    
    # Fetch student data from the GET ngrok endpoint
    import httpx
    
    try:
        async with httpx.AsyncClient() as client:
            # Call the ngrok GET endpoint (without /py prefix)
            get_url = f"https://cb0510e92b7f.ngrok-free.app/student/{student_id}/mind-piolet-data"
            print(f"DEBUG: Fetching student data from: {get_url}")
            
            response = await client.get(
                get_url,
                headers={"ngrok-skip-browser-warning": "true"},
                timeout=10.0
            )
            
            print(f"DEBUG: Response status: {response.status_code}")
            print(f"DEBUG: Response body: {response.text[:200]}")
            
            if response.status_code != 200:
                return {"error": f"Failed to fetch student data: {response.status_code}", "url": get_url}
            
            response_json = response.json()
            
            # Handle wrapped response (e.g., {"data": {...}})
            if "data" in response_json:
                student = response_json["data"]
            else:
                student = response_json
            
            print(f"DEBUG: Student data keys: {student.keys() if isinstance(student, dict) else 'not a dict'}")
            
    except Exception as e:
        return {"error": f"Error fetching student data from ngrok: {str(e)}"}
    
    if not student:
        return {"error": "Student not found"}
    
    # Load all students for ideal calculation (still from local file)
    try:
        with open(BASE_DIR / "students.json", "r", encoding="utf-8") as f:
            students = json.load(f)
        ideal = calculate_ideal_student(students)
        gap = calculate_gap(student, ideal)
    except Exception as e:
        return {"error": f"Error calculating gap: {e}"}
    
    role = request.role or "software engineer"
    msg = (request.message or "").lower()
    
    # Route to appropriate analysis
    if "skill" in msg or "gap" in msg:
        result = analyze_skills(student, gap, msg, request.conversation)
    elif "roadmap" in msg or "path" in msg:
        result = generate_roadmap(student, gap, role, msg, request.conversation)
    elif "interview" in msg:
        result = interview_prep(student, role, request.conversation or [], msg)
    else:
        result = analyze_skills(student, gap, msg, request.conversation)  # Default to skill analysis
    
    return {"result": result}

@app.get("/student/{student_id}/mind-piolet-data")
@app.get("/py/student/{student_id}/mind-piolet-data")
async def ngrok_mindpilot_get(student_id: str):
    """Ngrok-compatible GET endpoint for student data - returns local data"""
    student, err = get_student_by_id(student_id)
    if err:
        return {"error": err}
    
    if not student:
        return {"error": "Student not found"}
    
    return student

