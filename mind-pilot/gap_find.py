# gap_find.py
def calculate_gap(student, ideal):
    student_skills = student["profile"]["skills"]
    ideal_skills = ideal["ideal_skills"]
    education = student["profile"].get("education", "Not Provided")

    missing_skills = [skill for skill in ideal_skills if skill not in student_skills]
    strengths = [skill for skill in student_skills if skill in ideal_skills]

    skill_gap_percentage = round((len(missing_skills) / len(ideal_skills)) * 100, 2) if ideal_skills else 0

    student_projects = len(student.get("projects", []))
    project_gap = max(0, ideal["avg_projects"] - student_projects)
    project_gap_percentage = round((project_gap / ideal["avg_projects"]) * 100, 2) if ideal["avg_projects"] > 0 else 0

    student_achievements = len(student.get("achievements", []))
    achievement_gap = max(0, ideal["avg_achievements"] - student_achievements)
    achievement_gap_percentage = round((achievement_gap / ideal["avg_achievements"]) * 100, 2) if ideal["avg_achievements"] > 0 else 0

    overall_gap_percentage = round((skill_gap_percentage + project_gap_percentage + achievement_gap_percentage) / 3, 2)

    priority_learning_list = "\n".join(
        [f"{i+1}. {skill}" for i, skill in enumerate(missing_skills)]
    ) if missing_skills else "No learning required"

    return f"""
===== AI OUTPUT =====

🎯 SKILL GAP ANALYSIS REPORT

👤 Student: {student['profile']['name']}
🎓 Education: {education}

📌 SKILL STATS:
• Skills Student Has: {len(student_skills)}  
• Ideal Skills: {len(ideal_skills)}  
• Strengths: {', '.join(strengths) if strengths else 'None'}  
• Missing Skills: {', '.join(missing_skills) if missing_skills else 'No missing skills — great!'}

📊 GAP PERCENTAGES:
• Skill Gap: {skill_gap_percentage}%  
• Project Gap: {project_gap_percentage}%  
• Achievement Gap: {achievement_gap_percentage}%  
• 🔥 Overall Gap: {overall_gap_percentage}%

🚀 PRIORITY LEARNING LIST:
{priority_learning_list}
"""
