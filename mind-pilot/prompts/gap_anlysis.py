# prompts/gap_analysis.py

import json

def build_gap_analysis_prompt(self_student, all_students):
    return f"""
You are an expert mentor analyzing gaps between a student and the cohort.

Compare student with others and return JSON:
{{
  "strengths": [],
  "skill_gaps": [],
  "project_gaps": [],
  "achievement_gaps": [],
  "priority_actions": []
}}

Student:
{json.dumps(self_student, indent=2)}

Cohort:
{json.dumps(all_students, indent=2)}
"""
