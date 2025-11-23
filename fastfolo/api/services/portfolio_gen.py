from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import os
import uuid
import asyncio
import io

async def generate_portfolio(student, analysis_data: dict):
    """
    Generate a PDF portfolio for the student.
    
    student: Pydantic model (StudentData)
    analysis_data: dict containing analysis and portfolio_structure
    """
    env = Environment(loader=FileSystemLoader('./api/templates'))
    template = env.get_template("portfolio_template.html")

    # Convert Pydantic model to dict
    student_dict = student.dict()

    html_content = template.render(
        name=student_dict.get("name", ""),
        email=student_dict.get("email", ""),
        phone=student_dict.get("phone", ""),
        linkedin=student_dict.get("linkedin", ""),
        github=student_dict.get("github", ""),
        portfolio_structure=analysis_data.get("portfolio_structure", []),
        analysis=analysis_data.get("analysis", {})
    )

    pdf_buffer = io.BytesIO()
    await asyncio.to_thread(HTML(string=html_content).write_pdf, pdf_buffer)
    pdf_buffer.seek(0)

    return pdf_buffer.getvalue()

async def generate_analysis_pdf(analysis_data: dict):
    """
    Generate a PDF for the analysis.
    
    analysis_data: dict containing analysis and portfolio_structure
    """
    env = Environment(loader=FileSystemLoader('./api/templates'))
    template = env.get_template("analysis_template.html")

    html_content = template.render(analysis=analysis_data.get("analysis", {}))

    pdf_buffer = io.BytesIO()
    await asyncio.to_thread(HTML(string=html_content).write_pdf, pdf_buffer)
    pdf_buffer.seek(0)

    return pdf_buffer.getvalue()

async def generate_ats_portfolio(student, analysis_data: dict):
    """
    Generate an ATS-friendly PDF portfolio for the student.
    
    student: Pydantic model (StudentData)
    analysis_data: dict containing analysis and portfolio_structure
    """
    env = Environment(loader=FileSystemLoader('./api/templates'))
    template = env.get_template("ats_template.html")

    # Convert Pydantic model to dict
    student_dict = student.dict()

    html_content = template.render(
        name=student_dict.get("name", ""),
        email=student_dict.get("email", ""),
        phone=student_dict.get("phone", ""),
        linkedin=student_dict.get("linkedin", ""),
        github=student_dict.get("github", ""),
        portfolio_structure=analysis_data.get("portfolio_structure", [])
    )

    pdf_buffer = io.BytesIO()
    await asyncio.to_thread(HTML(string=html_content).write_pdf, pdf_buffer)
    pdf_buffer.seek(0)

    return pdf_buffer.getvalue()