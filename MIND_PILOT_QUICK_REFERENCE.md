# Mind Pilot - Quick Reference Card

## ⚡ Quick Overview

**What is it?** Mind Pilot now intelligently analyzes a logged-in student's skills and activities, then provides personalized AI-powered recommendations.

**How does it work?**
1. Student logs in → JWT token generated
2. Student opens Mind Pilot → Selects a feature
3. Backend fetches student data & activities → Aggregates skills
4. Backend calls Python AI with student context → Personalized response
5. Frontend displays response with recommendations

---

## 🔑 Key Endpoints (ALL Require JWT)

### Get Student Skills
```
GET /mind-piolet/me/skills
Authorization: Bearer <JWT_TOKEN>

Response: StudentSkillProfile {
  studentId, name, email, rollNumber,
  institute, academicDetails,
  skills, activities, projects, achievements
}
```

### Chat with Mind Pilot
```
POST /mind-piolet/me/chat
Authorization: Bearer <JWT_TOKEN>

Body: {
  message: "How to improve Python?",
  feature: "skill",  // skill, roadmap, interview, gap-finder, guidance
  role: "student"
}

Response: { result, recommendations }
```

### Get Full Mind Pilot Data
```
GET /mind-piolet/me/data
Authorization: Bearer <JWT_TOKEN>

Response: {
  skillProfile: {...},
  mindPioletData: {...}
}
```

---

## 📚 Skill Levels (Automatic)

| Frequency | Level | Example |
|-----------|-------|---------|
| 1-2 times | 🟢 Beginner | First project |
| 3-4 times | 🟡 Intermediate | Multiple projects |
| 5+ times | 🔴 Advanced | Mastery |

Skills are extracted from activities, projects, achievements automatically.

---

## 🎯 Five Features Explained

| Feature | Use | Endpoint |
|---------|-----|----------|
| **Skill Analysis** | Analyze current skills, find improvements | `/skill` |
| **Roadmap** | Generate personalized learning path | `/roadmap` |
| **Interview Prep** | Practice interviews based on skills | `/interview` |
| **Gap Finder** | Find missing skills for target role | `/skill` |
| **Guidance** | Get career guidance | `/skill` |

---

## 🔐 Authentication

### Get Token
```javascript
// 1. Login
fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
.then(r => r.json())
.then(data => localStorage.setItem('token', data.token))
```

### Use Token
```javascript
// 2. Add to all Mind Pilot requests
fetch('/mind-piolet/me/skills', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

---

## 📊 Data Aggregation Flow

```
Activities
  ↓ (extract skills from each)
Skill Count {
  Python: 7,
  JavaScript: 4,
  React: 3
}
  ↓ (determine levels)
Skills [
  { name: "Python", level: "advanced", frequency: 7 },
  { name: "JavaScript", level: "intermediate", frequency: 4 }
]
```

---

## 🛠️ Frontend Integration (Quick)

### 1. Create Auth Service
```javascript
// src/services/authService.js
export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
});
```

### 2. Create Mind Pilot Service
```javascript
// src/services/mindPilotService.js
export const chatWithMindPilot = async (message, feature) => {
  const response = await fetch('/mind-piolet/me/chat', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message, feature })
  });
  return response.json();
};
```

### 3. Use in Component
```jsx
// In Bot.jsx
const handleSend = async () => {
  const response = await chatWithMindPilot(message, selectedFeature);
  displayResponse(response.result);
};
```

---

## 🚀 Testing Commands

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"pass123"}'
```

Copy the `token` from response.

### Get Skills
```bash
curl -X GET http://localhost:3000/mind-piolet/me/skills \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

### Chat
```bash
curl -X POST http://localhost:3000/mind-piolet/me/chat \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How to improve?",
    "feature": "skill"
  }'
```

---

## ❌ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | No/invalid JWT | Login again, check token format |
| 404 Not Found | User not a student | Create student account |
| 400 Bad Request | Missing field | Check request body |
| Python error | Backend down | Verify PYTHON_BASE_URL |
| No skills shown | No activities | Create activities first |

---

## 📁 Key Files

### Backend
- `backend/src/mind-piolet/mind-piolet.service.ts` - Core logic
- `backend/src/mind-piolet/mind-piolet.controller.ts` - Endpoints
- `backend/src/mind-piolet/mind-piolet.module.ts` - Dependencies

### Documentation
- `MIND_PILOT_API.md` - Full API docs
- `MIND_PILOT_INTEGRATION.md` - Frontend guide
- `MIND_PILOT_ARCHITECTURE.md` - Diagrams
- `MIND_PILOT_SETUP.md` - Setup guide

---

## 🔧 Environment Variables

```env
# .env.development
PYTHON_BASE_URL=http://127.0.0.1:8000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN_MILI=86400000
```

---

## 📈 Response Examples

### Skill Profile Response
```json
{
  "studentId": "507f...",
  "name": "John Doe",
  "skills": [
    {
      "name": "Python",
      "level": "advanced",
      "frequency": 7
    }
  ],
  "projects": [
    {
      "name": "AI Chatbot",
      "techStack": ["Python", "TensorFlow"]
    }
  ]
}
```

### Chat Response
```json
{
  "result": "Based on your advanced Python skills...",
  "recommendations": [
    "Learn machine learning frameworks",
    "Build real-world ML projects"
  ]
}
```

---

## ✅ Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Service | ✅ Done | Production ready |
| Backend Controller | ✅ Done | JWT protected |
| Database Integration | ✅ Done | Skill aggregation working |
| Frontend Services | 📋 To-do | Create auth & mind-pilot services |
| Bot Component | 📋 To-do | Update to use new endpoints |
| Documentation | ✅ Done | Complete API & setup docs |

---

## 🎓 Features Powered by Student Data

Once frontend is updated, students get:

- ✅ **Personalized Skill Analysis** (based on their activities)
- ✅ **Custom Learning Roadmaps** (tailored to current skills)
- ✅ **Smart Interview Prep** (questions matching their background)
- ✅ **Targeted Gap Analysis** (specific missing skills)
- ✅ **Career Guidance** (based on their profile)

---

## 📞 Support

### Check Logs
```bash
# Backend logs
# Check console/Docker logs for errors

# Frontend logs
# Open browser DevTools → Console tab
```

### Verify Setup
1. ✅ Backend running on port 3000
2. ✅ Python backend running on port 8000
3. ✅ MongoDB connected
4. ✅ JWT token stored in localStorage
5. ✅ All endpoints responding

### Read Docs
1. For API details: `MIND_PILOT_API.md`
2. For frontend integration: `MIND_PILOT_INTEGRATION.md`
3. For setup: `MIND_PILOT_SETUP.md`
4. For architecture: `MIND_PILOT_ARCHITECTURE.md`

---

## 🎯 Next Steps

1. ✅ Backend complete - ready to use
2. 📋 Update `Bot.jsx` to use new endpoints
3. 📋 Create `authService.js`
4. 📋 Create `mindPilotService.js`
5. 📋 Test with real student account
6. 📋 Deploy to production

---

**Created**: December 2024
**Status**: Backend Ready, Frontend Pending
**Version**: 1.0
