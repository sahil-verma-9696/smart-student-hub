from fastapi import FastAPI, Response
from api.models import StudentData
from api.services.file_processing import process_certificates
from api.services.analysis import analyze_student_data
from api.services.portfolio_gen import generate_portfolio, generate_analysis_pdf, generate_ats_portfolio
from api.services.latex_portfolio_gen import generate_latex_pdf # New import
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.post("/generate-portfolio/")
async def generate_portfolio_route(student: StudentData):
    """
    Generate a portfolio PDF for the student and return it.
    """
    # Extract text/content from uploaded certificates
    cert_content = await process_certificates(student.certificates or [])

    # Analyze student data along with certificates
    analysis = await analyze_student_data(student, cert_content)

    # Generate the portfolio PDF
    pdf_content = await generate_portfolio(student, analysis)

    # Return the generated PDF
    headers = {'Content-Disposition': 'attachment; filename="portfolio.pdf"'}
    return Response(content=pdf_content, media_type='application/pdf', headers=headers)

@app.post("/analyze-portfolio/")
async def analyze_portfolio_route(student: StudentData):
    """
    Analyze student data and return the analysis as a PDF.
    """
    # Extract text/content from uploaded certificates
    cert_content = await process_certificates(student.certificates or [])

    # Analyze student data along with certificates
    analysis = await analyze_student_data(student, cert_content)

    # Generate the analysis PDF
    pdf_content = await generate_analysis_pdf(analysis)

    # Return the generated PDF
    headers = {'Content-Disposition': 'attachment; filename="analysis.pdf"'}
    return Response(content=pdf_content, media_type='application/pdf', headers=headers)

@app.post("/generate-ats-portfolio/")
async def generate_ats_portfolio_route(student: StudentData):
    """
    Generate an ATS-friendly portfolio PDF for the student and return it.
    """
    # Extract text/content from uploaded certificates
    cert_content = await process_certificates(student.certificates or [])

    # Analyze student data along with certificates
    analysis = await analyze_student_data(student, cert_content, ats_friendly=True)

    # Generate the ATS-friendly portfolio PDF
    pdf_content = await generate_ats_portfolio(student, analysis)

    # Return the generated PDF
    headers = {'Content-Disposition': 'attachment; filename="ats_portfolio.pdf"'}
    return Response(content=pdf_content, media_type='application/pdf', headers=headers)

@app.post("/generate-latex-portfolio/")
async def generate_latex_portfolio_route(student: StudentData):
    """
    Generate a LaTeX-based portfolio PDF for the student and return it.
    """
    # Extract text/content from uploaded certificates
    cert_content = await process_certificates(student.certificates or [])

    # Analyze student data along with certificates
    analysis = await analyze_student_data(student, cert_content)

    # Convert Pydantic model to dictionary for easier handling in LaTeX template
    student_data_dict = student.dict()

    # Combine student data and analysis for the template
    template_data = {**student_data_dict, "portfolio_structure": analysis.get("portfolio_structure", [])}

    # Generate the LaTeX portfolio PDF
    pdf_content = generate_latex_pdf(template_data)

    # Return the generated PDF
    headers = {'Content-Disposition': 'attachment; filename="latex_portfolio.pdf"'}
    return Response(content=pdf_content, media_type='application/pdf', headers=headers)