# Mind Pilot API Documentation

## Overview

The Mind Pilot integration now automatically aggregates the logged-in student's data and skills, enabling all Mind Pilot features to work with the student's actual academic and activity history.

## Features

Mind Pilot provides the following features for authenticated students:

1. **Skill Analysis** - Analyzes student's skills based on activities and projects
2. **Roadmap Generator** - Creates personalized learning roadmaps
3. **Interview Preparation** - Prepares students for interviews based on their skills
4. **Gap Finder** - Identifies skill gaps compared to target roles
5. **Personalized Guidance** - Provides personalized career and learning guidance

## Authentication

All Mind Pilot endpoints (except legacy ones) require JWT authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get Student's Mind Pilot Data

**Endpoint:** `GET /mind-piolet/me/data`

**Authentication:** Required (JWT)

**Description:** Retrieves aggregated Mind Pilot data including student profile, skills, activities, projects, and achievements.

**Request Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Response:**
```json
{
  "skillProfile": {
    "studentId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "CS-001",
    "institute": "ABC University",
    "academicDetails": {
      "department": "Computer Science",
      "semester": 5,
      "cgpa": 8.5
    },
    "skills": [
      {
        "name": "Python",
        "level": "advanced",
        "frequency": 7
      },
      {
        "name": "JavaScript",
        "level": "intermediate",
        "frequency": 4
      }
    ],
    "activities": [
      {
        "type": "project",
        "count": 3
      },
      {
        "type": "achievement",
        "count": 2
      }
    ],
    "achievements": [
      {
        "title": "Hackathon Winner",
        "description": "Won CodeWarriors hackathon 2024",
        "date": "2024-11-15"
      }
    ],
    "projects": [
      {
        "name": "Student Hub API",
        "description": "RESTful API for student management",
        "techStack": ["Node.js", "MongoDB", "Express"],
        "date": "2024-10-20"
      }
    ]
  },
  "mindPioletData": {
    // Data from Python backend
  }
}
```

---

### 2. Chat with Mind Pilot

**Endpoint:** `POST /mind-piolet/me/chat`

**Authentication:** Required (JWT)

**Description:** Chat with Mind Pilot using the student's skill context. Supports different features for targeted assistance.

**Request Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How can I improve my Python skills?",
  "role": "student",
  "feature": "skill"
}
```

**Query Parameters:**
- `feature` (required): One of `skill`, `roadmap`, `interview`, `gap-finder`, `guidance`
- `role` (optional): User's role context. Default: `user`
- `message` (required): The message/question for Mind Pilot

**Response:**
```json
{
  "result": "Based on your current Python proficiency level with 7 projects completed...",
  "recommendations": [
    "Advanced topics to learn",
    "Projects to build",
    "Courses to take"
  ]
}
```

---

### 3. Get Student's Skill Profile

**Endpoint:** `GET /mind-piolet/me/skills`

**Authentication:** Required (JWT)

**Description:** Retrieves only the aggregated skill profile of the logged-in student without calling the Python backend.

**Request Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Response:**
```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "CS-001",
  "institute": "ABC University",
  "academicDetails": {
    "department": "Computer Science",
    "semester": 5,
    "cgpa": 8.5
  },
  "skills": [
    {
      "name": "Python",
      "level": "advanced",
      "frequency": 7
    }
  ],
  "activities": [...],
  "achievements": [...],
  "projects": [...]
}
```

---

## How Skills Are Aggregated

The system automatically aggregates student skills from:

1. **Activities** - Activities tagged with specific skills
2. **Projects** - Technologies used in projects
3. **Achievements** - Skills demonstrated in achievements

### Skill Levels

Skill levels are determined by frequency:

- **Beginner**: 1-2 occurrences
- **Intermediate**: 3-4 occurrences
- **Advanced**: 5+ occurrences

---

## How Features Map to Python Endpoints

The frontend feature selection is mapped to Python backend endpoints:

| Feature | Python Endpoint |
|---------|-----------------|
| skill | `/skill` |
| roadmap | `/roadmap` |
| interview | `/interview` |
| gap-finder | `/skill` |
| guidance | `/skill` |

---

## Frontend Integration

### Using in React Component (Bot.jsx)

```jsx
// After user logs in, store their token
localStorage.setItem('token', loginResponse.token);

// Make Mind Pilot requests
const response = await fetch('http://localhost:3000/mind-piolet/me/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    message: userMessage,
    feature: 'skill',
    role: 'student'
  })
});

const data = await response.json();
```

---

## Environment Variables

Configure these in `.env.development`:

```
# Python backend URL
PYTHON_BASE_URL=http://127.0.0.1:8000

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN_MILI=86400000
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200 OK** - Successful request
- **400 Bad Request** - Invalid input or missing required fields
- **401 Unauthorized** - Missing or invalid JWT token
- **404 Not Found** - Student not found
- **500 Internal Server Error** - Server error

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "message and feature are required",
  "error": "Bad Request"
}
```

---

## Data Flow

```
Frontend (React)
    ↓ (JWT Token)
Backend (NestJS) - Mind Pilot Controller
    ↓
Mind Pilot Service
    ├→ StudentService (fetch student data)
    ├→ ActivityModel (fetch activities & skills)
    └→ Aggregate skill profile
       ↓
Python Backend (Flask/FastAPI)
    ↓ (skill profile + message)
AI/LLM Processing
    ↓
Response back to Frontend
```

---

## Legacy Endpoints (Deprecated)

These endpoints still work but don't use student context:

- `POST /mind-piolet/chat` - Legacy chat endpoint
- `GET /mind-piolet/:id` - Get data by student ID
- `GET /mind-piolet` - Get mock data

**Note:** Use the new authenticated endpoints for better results with student context.

---

## Testing the API

### Using cURL

```bash
# Get JWT token first
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Use token to get skill profile
curl -X GET http://localhost:3000/mind-piolet/me/skills \
  -H "Authorization: Bearer <token>"

# Chat with Mind Pilot
curl -X POST http://localhost:3000/mind-piolet/me/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my skills?",
    "feature": "skill",
    "role": "student"
  }'
```

### Using Postman

1. Set up environment variables:
   - `base_url`: http://localhost:3000
   - `token`: (set after login)

2. Create Login request:
   - Method: POST
   - URL: `{{base_url}}/auth/login`
   - Body: `{"email":"student@example.com","password":"password123"}`
   - In Tests tab: `pm.environment.set("token", pm.response.json().token)`

3. Create Mind Pilot request:
   - Method: GET or POST
   - URL: `{{base_url}}/mind-piolet/me/skills` or `/me/chat`
   - Headers: `Authorization: Bearer {{token}}`

---

## Performance Notes

- Skill profile aggregation queries all activities for a student
- For large datasets, consider implementing pagination or caching
- Consider indexing `activities.student` field in MongoDB for faster queries

---

## Future Enhancements

1. Add caching layer for skill profiles
2. Implement skill progress tracking
3. Add recommendations based on industry trends
4. Real-time skill updates from activity completion
5. Skill verification through assessments
