# Mind Pilot Integration - Quick Setup Guide

## What Changed

Mind Pilot now works with the logged-in student's actual data! Instead of using hardcoded mock data, it now:

1. ✅ **Authenticates users** - Only students with valid JWT can access
2. ✅ **Aggregates student data** - Fetches skills from activities, projects, and achievements
3. ✅ **Provides personalized features** - Skill analysis, roadmap, interview prep, gap finder, guidance
4. ✅ **Sends context to Python backend** - Enriches AI responses with student profile

## How It Works

### Before (Old Way)
```
Student → Mock Chatbot → Generic Responses
```

### After (New Way)
```
Student Logs In (JWT Token)
          ↓
   Mind Pilot Features
          ↓
   Get Student Data + Skills
          ↓
   Send to Python AI with Context
          ↓
   Personalized Responses Based on Skills
```

## Backend Setup

### 1. Dependencies Already Added ✅
The following are already configured in the module:
- `StudentService` - Fetches student data
- `Activity Model` - Queries student activities/skills
- `HttpService` - Communicates with Python backend

### 2. Environment Variables
Make sure `.env.development` has:
```
PYTHON_BASE_URL=http://127.0.0.1:8000
JWT_SECRET=your-secret
JWT_EXPIRES_IN_MILI=86400000
```

### 3. Verify Database
Ensure these collections exist:
- `students` - Student profiles
- `activities` - Student activities with skills
- `users` - User accounts

## Frontend Setup

### 1. Update Bot Component (Optional but Recommended)
Use the new endpoints in `Bot.jsx`:

```jsx
// Import auth service
import { getAuthToken, getAuthHeaders } from '../services/authService';

// Make authenticated requests
const response = await fetch('http://localhost:3000/mind-piolet/me/chat', {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify({
    message: userMessage,
    feature: 'skill',
    role: 'student'
  })
});
```

### 2. Create Auth Service (if not exists)
Create `src/services/authService.js`:

```javascript
export const getAuthToken = () => localStorage.getItem('auth_token');

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});
```

### 3. Store Token on Login
In your login component:

```jsx
const response = await loginAPI(email, password);
localStorage.setItem('auth_token', response.token);
```

## Testing the Integration

### Test Backend Endpoints

1. **Login first (get JWT token)**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password"}'
```

2. **Get skill profile**:
```bash
curl -X GET http://localhost:3000/mind-piolet/me/skills \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

3. **Chat with Mind Pilot**:
```bash
curl -X POST http://localhost:3000/mind-piolet/me/chat \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my Python skills?",
    "feature": "skill",
    "role": "student"
  }'
```

### Check Skills Are Aggregated
The skill profile should show:
- Student name, email, roll number
- Institute and academic details
- **Skills** - extracted from activities
- **Activities** - aggregated by type
- **Projects** - from activity data
- **Achievements** - recognized achievements

Example response:
```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
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
  ]
}
```

## Available Features

Mind Pilot now supports these features (per user request):

| Feature | Endpoint | Use Case |
|---------|----------|----------|
| **Skill Analysis** | `/me/chat?feature=skill` | Analyze current skills & improvements |
| **Roadmap** | `/me/chat?feature=roadmap` | Generate learning roadmap |
| **Interview Prep** | `/me/chat?feature=interview` | Practice interview questions |
| **Gap Finder** | `/me/chat?feature=gap-finder` | Identify missing skills |
| **Guidance** | `/me/chat?feature=guidance` | Get personalized career guidance |

## API Endpoints Summary

### Get Authenticated

```
POST /auth/login
→ Returns JWT token in response
```

### Mind Pilot Features (All Require JWT)

```
GET  /mind-piolet/me/skills          → Get skill profile only
GET  /mind-piolet/me/data            → Get full Mind Pilot data
POST /mind-piolet/me/chat            → Chat with Mind Pilot
```

### Legacy (No JWT needed)

```
GET  /mind-piolet/:id                → Get by ID (deprecated)
GET  /mind-piolet                    → Get mock data (deprecated)
POST /mind-piolet/chat               → Chat (deprecated)
```

## Skill Aggregation Logic

Skills are automatically extracted and aggregated from:

1. **Activities** - Any activity tagged with skills
2. **Projects** - Technologies used in projects
3. **Achievements** - Skills demonstrated in achievements

### Skill Levels
- **Beginner**: 1-2 occurrences
- **Intermediate**: 3-4 occurrences  
- **Advanced**: 5+ occurrences

### Activity Type Aggregation
- Counts activities by type (project, achievement, internship, etc.)
- Displays as `{ type: "project", count: 3 }`

## Data Flow

```
1. Student Logs In
   └─→ JWT Token Generated & Stored

2. Student Opens Mind Pilot
   └─→ Frontend sends request with JWT token

3. Backend Receives Request
   └─→ Validates JWT
   └─→ Extracts user ID from token
   └─→ Queries student, activities, achievements
   └─→ Aggregates skills from all sources
   └─→ Determines skill levels
   └─→ Builds StudentSkillProfile

4. Backend Sends to Python
   └─→ Includes: message + feature + studentProfile
   └─→ Python AI processes with context
   └─→ Returns personalized response

5. Response Sent to Frontend
   └─→ Display to student with recommendations
```

## Troubleshooting

### "User not authenticated" Error
- Ensure JWT token is passed in Authorization header
- Token format: `Bearer <token>`
- Check if token is expired

### "Student not found" Error
- User must be logged in as STUDENT role (not admin/faculty)
- Verify student record exists in database

### No Skills Shown
- Ensure student has activities with skills tagged
- Check activity schema includes skills field
- Verify activities exist for this student

### Python Backend Errors
- Ensure Python backend is running on configured URL
- Check `PYTHON_BASE_URL` environment variable
- Verify ngrok URL is active if using ngrok

## Next Steps

1. ✅ Update frontend to use authenticated endpoints
2. ✅ Test with real student accounts
3. ✅ Monitor skill aggregation accuracy
4. ✅ Add more activity types for better skill extraction
5. ✅ Implement caching for performance
6. ✅ Add progress tracking over time

## Documentation Files

- **Backend API Docs**: `/backend/src/mind-piolet/MIND_PILOT_API.md`
- **Frontend Integration Guide**: `/client/src/components/bot/MIND_PILOT_INTEGRATION.md`
- **This File**: Quick reference guide

## Support

For issues or questions:
1. Check the detailed API documentation
2. Review error responses from endpoints
3. Verify database has required data
4. Check environment variables are set
5. Ensure Python backend is running

---

**Status**: ✅ Ready to use!

All endpoints are implemented, authenticated, and ready for frontend integration.
