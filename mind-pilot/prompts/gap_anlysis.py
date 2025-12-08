# prompts/gap_analysis.py

import json

def build_gap_analysis_prompt(self_student, all_students):
    # Extract student name for personalization
    student_name = self_student.get("name", "Student")
    student_target_role = self_student.get("target_role", "Software Engineer")
    
    return f"""
You are an expert mentor analyzing **{student_name}**'s gaps compared to the cohort.

**Analyzing for:** {student_name} (Target Role: {student_target_role})

Your task: Compare {student_name}'s profile with the cohort and return a PERSONALIZED JSON analysis.

Response format:
{{
  "strengths": ["List specific strengths {student_name} has compared to cohort"],
  "skill_gaps": ["Specific skills {student_name} needs to develop"],
  "project_gaps": ["Types of projects {student_name} should build"],
  "achievement_gaps": ["Achievements to work towards for {student_target_role}"],
  "priority_actions": ["Top 3 actionable steps specifically for {student_name}"]
}}

**{student_name}'s Profile:**
{json.dumps(self_student, indent=2)}

**Cohort Comparison Data:**
{json.dumps(all_students, indent=2)}

**Important:** 
- Make all insights specific to {student_name}
- Consider their experience level and target role
- Provide actionable, motivating insights
- Reference {student_name} by name in the response
"""
