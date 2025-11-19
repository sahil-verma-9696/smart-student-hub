from api.models import StudentData
from typing import List
import google.generativeai as genai
import os
import json
import re

# Configure the Gemini API key
genai.configure(api_key=os.environ.get("GEMINI_API_KEY")) # type: ignore

async def analyze_student_data(student: StudentData, cert_data: List[dict], ats_friendly: bool = False):
    """Analyze student data using the Gemini Pro model."""
    if not os.environ.get("GEMINI_API_KEY"):
        raise ValueError("GEMINI_API_KEY not found in environment variables.")

    # Create a prompt for the model
    prompt = f"""
    Analyze the following student data and provide a professional analysis for their portfolio.
    The student's data is:
    - Name: {student.name}
    - Email: {student.email}
    - Phone: {student.phone}
    - LinkedIn: {student.linkedin}
    - GitHub: {student.github}
    - Education: {student.education}
    - Projects: {student.projects}
    - Achievements: {student.achievements}
    - Skills: {student.skills}
    - Work Experience: {student.work_experience}

    The following is the content extracted from their certificates, which may include marksheets.
    Analyze this content to identify key achievements, skills, and academic performance (e.g., relevant courses, grades).
    Incorporate this information into the portfolio analysis and structure.
    {cert_data}
    """

    if student.job_role and student.job_role != 'Default':
        prompt += f"""
    The student has specified the following job role: {student.job_role}.
    You MUST only include skills, projects, and achievements relevant to this job role.
    """

    if student.job_description:
        prompt += f"""
    The portfolio should be tailored for the following job description:
    {student.job_description}
    """

    prompt += """
    Please provide an analysis and portfolio structure in the following JSON format.
    """

    if ats_friendly:
        prompt += """
    The portfolio should be ATS-friendly. This means it should have a single-column layout and use standard section titles.
    The `section_type` should always be 'list'.
    ```json
    {{
        "analysis": {{
            "score": <a score out of 1.0 based on the job description>,
            "suggestions": ["<suggestion 1>", "<suggestion 2>"],
            "strengths": ["<strength 1>", "<strength 2>"],
            "recommendations": ["<recommendation 1>", "<recommendation 2>"]
        }},
        "portfolio_structure": [
            {{
                "section_title": "<standard section title>",
                "section_type": "list",
                "section_items": ["<item 1>", "<item 2>"]
            }}
        ]
    }}
    ```
    """
    else:
        prompt += """
    ```json
    {{
        "analysis": {{
            "score": <a score out of 1.0 based on the job description>,
            "suggestions": ["<suggestion 1>", "<suggestion 2>"],
            "strengths": ["<strength 1>", "<strength 2>"],
            "recommendations": ["<recommendation 1>", "<recommendation 2>"]
        }},
        "portfolio_structure": [
            {{
                "section_title": "<section title>",
                "section_type": "<'list' or 'grid'>",
                "section_items": ["<item 1>", "<item 2>"]
            }}
        ]
    }}
    ```
    """

    # Call the Gemini API
    model = genai.GenerativeModel('gemini-2.5-flash') # type: ignore
    response = await model.generate_content_async(prompt)

    # Parse the response
    try:
        # Extract the JSON part from the response
        json_match = re.search(r'```json\n(.*?)\n```', response.text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
            analysis = json.loads(json_str)
        else:
            # Fallback for cases where the model does not return valid JSON
            analysis = {
                "analysis": {
                    "score": 0.0,
                    "suggestions": ["Could not parse the model's response. The model did not return valid JSON."],
                    "strengths": [],
                    "recommendations": []
                },
                "portfolio_structure": []
            }
    except json.JSONDecodeError:
        # Handle cases where the model does not return valid JSON
        analysis = {
            "analysis": {
                "score": 0.0,
                "suggestions": ["Could not parse the model's response. Invalid JSON format."],
                "strengths": [],
                "recommendations": []
            },
            "portfolio_structure": []
        }

    # Filter out the "Contact Information" section from the portfolio structure
    if "portfolio_structure" in analysis:
        analysis["portfolio_structure"] = [
            section for section in analysis["portfolio_structure"]
            if section.get("section_title", "").lower() != "contact information"
        ]

    return analysis