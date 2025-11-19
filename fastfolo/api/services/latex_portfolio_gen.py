import os
import subprocess
import uuid
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import tempfile
import shutil

# Define the base directory for templates
BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = BASE_DIR / "templates"

def generate_latex_pdf(student_data: dict) -> bytes:
    """
    Generates a LaTeX-based resume PDF from student data.

    Args:
        student_data (dict): A dictionary containing student information.

    Returns:
        bytes: The content of the generated PDF file.
    """
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template("latex_template.tex")

    # Render the LaTeX template with student data
    rendered_latex = template.render(
        name=student_data.get("name", "N/A"),
        email=student_data.get("email", "N/A"),
        phone=student_data.get("phone", "N/A"),
        linkedin=student_data.get("linkedin", "N/A"),
        github=student_data.get("github", "N/A"),
        portfolio_structure=student_data.get("portfolio_structure", [])
    )

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = Path(temp_dir)
        unique_id = uuid.uuid4().hex
        tex_filename = f"{unique_id}_resume.tex"
        pdf_filename = f"{unique_id}_resume.pdf"
        
        tex_filepath = temp_dir_path / tex_filename
        pdf_filepath = temp_dir_path / pdf_filename

        # Write the rendered LaTeX to a .tex file
        with open(tex_filepath, "w", encoding="utf-8") as f:
            f.write(rendered_latex)

        # Compile the .tex file to PDF using pdflatex
        try:
            # Run pdflatex twice to ensure all cross-references are resolved
            subprocess.run(
                ["pdflatex", "-output-directory", str(temp_dir_path), str(tex_filepath)],
                check=True,
                capture_output=True,
                text=True
            )
            subprocess.run(
                ["pdflatex", "-output-directory", str(temp_dir_path), str(tex_filepath)],
                check=True,
                capture_output=True,
                text=True
            )
        except subprocess.CalledProcessError as e:
            print(f"Error compiling LaTeX: {e.stderr}")
            raise RuntimeError(f"LaTeX compilation failed: {e.stderr}")

        with open(pdf_filepath, "rb") as f:
            pdf_content = f.read()

    return pdf_content
