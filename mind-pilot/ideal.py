# ideal.py (KEEP ONLY THIS HERE)
import json
from collections import Counter

def calculate_ideal_student(students):
    all_skills = []
    project_counts = []
    achievement_counts = []

    for student in students:
        all_skills.extend(student["profile"]["skills"])
        project_counts.append(len(student.get("projects", [])))
        achievement_counts.append(len(student.get("achievements", [])))

    avg_projects = sum(project_counts) / len(project_counts)
    avg_achievements = sum(achievement_counts) / len(achievement_counts)

    skill_counter = Counter(all_skills)
    ideal_skills = [skill for skill, count in skill_counter.items() if count >= 2]

    return {
        "ideal_skills": ideal_skills,
        "avg_projects": avg_projects,
        "avg_achievements": avg_achievements
    }
