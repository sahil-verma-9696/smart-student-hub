# Student Portfolio API Documentation


# To start the web application, you need to run both the backend and the frontend servers.

### 1. Make sure you have all the required dependencies installed by running:
   pip install -r requirements.txt

### 2. Open two separate terminals or command prompts.

### 3. In the first terminal, start the backend FastAPI server with the following command:
    uvicorn api.main:app --reload

   # The backend will be running at http://localhost:8000.

### 4. In the second terminal, start the frontend Flask application with the following command:
   # python test_app/main.py

   ### The frontend will be running at http://localhost:5000.

# 5. Open your web browser and navigate to http://localhost:5000 to use the application.



## Base URL

`http://localhost:8000`

## Endpoints

### 1. Generate Modern Portfolio

*   **Method:** `POST`
*   **Generate Portfolio:** `http://localhost:8000/generate-portfolio/`
*   **Path:** `/generate-portfolio/`
*   **Description:** Generates a modern, visually appealing portfolio as a PDF.
*   **Request Body:** See [StudentData JSON Format](#studentdata-json-format).
*   **Response:** A PDF file (`application/pdf`).

### 2. Generate ATS-Friendly Portfolio

*   **Method:** `POST`
*   **Generate ATS-Friendly Portfolio:** `http://localhost:8000/generate-ats-portfolio/`
*   **Path:** `/generate-ats-portfolio/`
*   **Description:** Generates an ATS-friendly portfolio as a PDF, optimized for resume parsers.
*   **Request Body:** See [StudentData JSON Format](#studentdata-json-format).
*   **Response:** A PDF file (`application/pdf`).

### 3. Get Analysis PDF

*   **Method:** `POST`
*   **Analyze Portfolio:** `http://localhost:8000/analyze-portfolio/`
*   **Path:** `/analyze-portfolio/`
*   **Description:** Generates a PDF file containing the analysis of the student's data, including score, suggestions, strengths, and recommendations.
*   **Request Body:** See [StudentData JSON Format](#studentdata-json-format).
*   **Response:** A PDF file (`application/pdf`).

## StudentData JSON Format

All endpoints expect a JSON object with the following structure:

```json
{
    "name": "string",
    "email": "string",
    "phone": "string" (optional),
    "linkedin": "string" (optional),
    "github": "string" (optional),
    "projects": ["string"] (optional),
    "achievements": ["string"] (optional),
    "skills": ["string"] (optional),
    "certificates": [
      {
        "path": "string",
        "type": "string" // 'pdf', 'doc', 'image', or 'txt'
      }
    ] (optional),
    "education": ["string"] (optional),
    "work_experience": ["string"] (optional),
    "job_description": "string" (optional)
}
```
### Postman Usage:
## POST
All API endpoints are `POST` requests to `http://localhost:8000/{endpoint_path}`.
The request body should be a JSON object conforming to the `StudentData` schema provided above.

- **Generate Portfolio:** `http://localhost:8000/generate-portfolio/`
- **Analyze Portfolio:** `http://localhost:8000/analyze-portfolio/`
- **Generate ATS-Friendly Portfolio:** `http://localhost:8000/generate-ats-portfolio/`
