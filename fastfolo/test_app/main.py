from flask import Flask, render_template, request, url_for, abort
import requests
import os
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Create an uploads directory if it doesn't exist
if not os.path.exists("test_app/uploads"):
    os.makedirs("test_app/uploads")

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/generate-portfolio", methods=["POST"])
@app.route("/generate-ats-portfolio", methods=["POST"])
@app.route("/analyze-portfolio", methods=["POST"])
def generate():
    # Handle certificate uploads
    certificates_dict = {}
    total_size = 0
    max_size = 10 * 1024 * 1024  # 10MB

    # Process new files
    for file in request.files.getlist("certificates"):
        if file.filename:
            total_size += file.content_length
            if total_size > max_size:
                return abort(400, 'Total file size should not exceed 10MB.')
            
            filename = secure_filename(file.filename)
            file_path = os.path.join("test_app/uploads", filename)
            file.save(file_path)
            file_type = filename.split('.')[-1]
            certificates_dict[file_path] = {"path": file_path, "type": file_type}

    # Process previously uploaded files
    for file_path in request.form.getlist("uploaded_file_paths"):
        if file_path not in certificates_dict:
            file_type = file_path.split('.')[-1]
            certificates_dict[file_path] = {"path": file_path, "type": file_type}

    certificates = list(certificates_dict.values())

    student_data = {
        "name": request.form.get("name"),
        "email": request.form.get("email"),
        "phone": request.form.get("phone"),
        "linkedin": request.form.get("linkedin"),
        "github": request.form.get("github"),
        "education": request.form.get("education", "").split(','),
        "projects": request.form.get("projects", "").split(','),
        "achievements": request.form.get("achievements", "").split(','),
        "skills": request.form.get("skills", "").split(','),
        "job_description": request.form.get("job_description"),
        "job_role": request.form.get("job_role"),
        "certificates": certificates
    }

    uploaded_files = [cert['path'] for cert in certificates]

    endpoint = request.path
    response = requests.post(f"http://localhost:8000{endpoint}", json=student_data)

    if response.headers.get('Content-Type') != 'application/pdf':
        return render_template("index.html", error="Failed to generate PDF. Please check the backend logs for more details.", student_data=student_data)

    filename = f"{uuid.uuid4().hex}.pdf"
    output_path = os.path.join("test_app/static", filename)
    with open(output_path, "wb") as f:
        f.write(response.content)

    pdf_file = url_for('static', filename=filename)
    return render_template("index.html", pdf_file=pdf_file, uploaded_files=uploaded_files, student_data=student_data)

if __name__ == "__main__":
    app.run(port=5000)
