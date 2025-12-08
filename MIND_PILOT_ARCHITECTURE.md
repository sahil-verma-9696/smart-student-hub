# Mind Pilot Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Bot.jsx / Mind Pilot Component                           │   │
│  │ ┌────────────────────────────────────────────────────┐   │   │
│  │ │ 1. User Logs In                                   │   │   │
│  │ │    └─→ JWT Token Stored in localStorage           │   │   │
│  │ │ 2. Select Mind Pilot Feature                      │   │   │
│  │ │    └─→ skill, roadmap, interview, etc.            │   │   │
│  │ │ 3. Send Message with Auth Header                  │   │   │
│  │ │    └─→ Authorization: Bearer <token>              │   │   │
│  │ └────────────────────────────────────────────────────┘   │   │
│  └────────────┬───────────────────────────────────────────────┘   │
│               │ HTTP Request (with JWT Token)                      │
└───────────────┼────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│            Backend (NestJS) - Mind Pilot Module                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Mind Pilot Controller                                   │   │
│  │ ┌────────────────────────────────────────────────────┐   │   │
│  │ │ POST /mind-piolet/me/chat                          │   │   │
│  │ │ ├─ @UseGuards(JwtAuthGuard)                        │   │   │
│  │ │ ├─ Extract User ID from JWT                        │   │   │
│  │ │ ├─ Validate Message & Feature                      │   │   │
│  │ │ └─ Call Service                                    │   │   │
│  │ │                                                     │   │   │
│  │ │ GET /mind-piolet/me/skills                         │   │   │
│  │ │ ├─ @UseGuards(JwtAuthGuard)                        │   │   │
│  │ │ └─ Return Skill Profile                            │   │   │
│  │ │                                                     │   │   │
│  │ │ GET /mind-piolet/me/data                           │   │   │
│  │ │ ├─ @UseGuards(JwtAuthGuard)                        │   │   │
│  │ │ └─ Return Full Mind Pilot Data                     │   │   │
│  │ └────────────────────────────────────────────────────┘   │   │
│  └────────────┬─────────────────────────────────────────────┘   │
│               │ Pass to Service with userId                      │
└───────────────┼─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│          Mind Pilot Service - Data Aggregation Layer             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ aggregateStudentSkillProfile(userId)                   │   │
│  │                                                         │   │
│  │ Step 1: Fetch Student Data                            │   │
│  │ ├─ StudentService.getByUserId(userId)                 │   │
│  │ └─ Populate: basicUserDetails, institute, academic    │   │
│  │                                                         │   │
│  │ Step 2: Fetch Activities                              │   │
│  │ ├─ ActivityModel.find({ student: studentId })         │   │
│  │ └─ Get all activities for this student                │   │
│  │                                                         │   │
│  │ Step 3: Extract Skills                                │   │
│  │ ├─ Loop through activities                            │   │
│  │ ├─ Extract: activity.skills[]                         │   │
│  │ └─ Count frequency of each skill                      │   │
│  │                                                         │   │
│  │ Step 4: Determine Skill Levels                        │   │
│  │ ├─ Frequency 1-2   → Beginner                         │   │
│  │ ├─ Frequency 3-4   → Intermediate                     │   │
│  │ └─ Frequency 5+    → Advanced                         │   │
│  │                                                         │   │
│  │ Step 5: Extract Projects & Achievements               │   │
│  │ ├─ Filter activities by type                          │   │
│  │ ├─ type: 'project'     → projects[]                   │   │
│  │ └─ type: 'achievement' → achievements[]               │   │
│  │                                                         │   │
│  │ Step 6: Build StudentSkillProfile                     │   │
│  │ └─ {                                                  │   │
│  │     studentId, name, email, rollNumber,              │   │
│  │     institute, academicDetails,                       │   │
│  │     skills[], activities[], projects[], achievements  │   │
│  │   }                                                   │   │
│  └───────────────┬──────────────────────────────────────┘   │
│  ┌───────────────▼──────────────────────────────────────┐   │
│  │ chatWithMindPilot(userId, message, feature)          │   │
│  │                                                       │   │
│  │ 1. Aggregate student skill profile (above)           │   │
│  │ 2. Select Python endpoint based on feature:          │   │
│  │    ├─ 'skill'      → /skill                          │   │
│  │    ├─ 'roadmap'    → /roadmap                        │   │
│  │    ├─ 'interview'  → /interview                      │   │
│  │    ├─ 'gap-finder' → /skill                          │   │
│  │    └─ 'guidance'   → /skill                          │   │
│  │ 3. Call Python backend with:                         │   │
│  │    ├─ message                                        │   │
│  │    ├─ feature                                        │   │
│  │    ├─ studentProfile (enriched context)              │   │
│  │    └─ role                                           │   │
│  │ 4. Return response from Python                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  └────────────┬──────────────────────────────────────────┘   │
└───────────────┼───────────────────────────────────────────────┘
                │ HTTP POST with Student Context
                ▼
┌─────────────────────────────────────────────────────────────────┐
│        Python Backend (Flask/FastAPI) - AI Processing            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Endpoints:                                               │   │
│  │ ├─ POST /skill       → Skill Analysis with LLM          │   │
│  │ ├─ POST /roadmap     → Roadmap Generation with LLM       │   │
│  │ ├─ POST /interview   → Interview Prep with LLM           │   │
│  │ └─ POST /guidance    → Career Guidance with LLM          │   │
│  │                                                          │   │
│  │ Process:                                                │   │
│  │ 1. Receive: { message, studentProfile, feature }        │   │
│  │ 2. Extract: studentProfile.skills, projects, etc.       │   │
│  │ 3. Process with LLM/AI                                 │   │
│  │ 4. Generate contextual response                        │   │
│  │ 5. Return: { result, recommendations }                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────────┘
                 │ JSON Response
                 ▼
        Response Sent Back to Frontend
```

## Request-Response Flow

### Flow 1: Get Skill Profile Only

```
┌─────────────┐
│ Frontend    │
│ GET /me/    │
│ skills      │
└──────┬──────┘
       │ + JWT Token
       ▼
┌──────────────────────┐
│ Controller           │
│ Validate JWT         │
│ Extract userId       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Service                      │
│ aggregateStudentSkillProfile │
│ ├─ Fetch Student             │
│ ├─ Fetch Activities          │
│ ├─ Extract & Count Skills    │
│ └─ Return Profile            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Frontend             │
│ StudentSkillProfile  │
│ Display Skills       │
└──────────────────────┘
```

### Flow 2: Chat with AI

```
┌─────────────────┐
│ Frontend        │
│ POST /me/chat   │
│ {message, feat} │
└────────┬────────┘
         │ + JWT Token
         ▼
┌──────────────────────────┐
│ Controller               │
│ Validate JWT & Input     │
│ Extract userId           │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Service.chatWithMindPilot           │
│ 1. aggregateStudentSkillProfile     │
│ 2. Select Python endpoint by feature│
│ 3. Build request:                   │
│    ├─ message                       │
│    ├─ studentProfile                │
│    ├─ feature                       │
│    └─ role                          │
└────────┬────────────────────────────┘
         │ HTTP POST with profile
         ▼
┌──────────────────────────────┐
│ Python Backend               │
│ Process with AI/LLM          │
│ Return personalized response │
└────────┬─────────────────────┘
         │ JSON response
         ▼
┌──────────────────────────────┐
│ Frontend                     │
│ Display AI Response          │
│ Show Recommendations         │
└──────────────────────────────┘
```

## Data Model

### Student Skill Profile

```
StudentSkillProfile {
  
  // Student Identity
  studentId: string
  name: string
  email: string
  rollNumber: string
  
  // Institution
  institute: string
  academicDetails: {
    department: string
    semester: number
    cgpa: number
  }
  
  // Skills (Extracted from Activities)
  skills: [
    {
      name: string
      level: "beginner" | "intermediate" | "advanced"
      frequency: number (1-2: beginner, 3-4: intermediate, 5+: advanced)
    }
  ]
  
  // Activity Summary
  activities: [
    {
      type: string (project, achievement, internship, etc.)
      count: number
    }
  ]
  
  // Achievements
  achievements: [
    {
      title: string
      description: string
      date: string (ISO format)
    }
  ]
  
  // Projects
  projects: [
    {
      name: string
      description: string
      techStack: string[]
      date: string (ISO format)
    }
  ]
}
```

## Database Query Flow

```
Frontend Request
        ↓
Database Access Pattern:
        ↓
┌─────────────────────────────────────┐
│ 1. Find Student                     │
│    students.findOne({               │
│      basicUserDetails: userId       │
│    }).populate([...])               │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 2. Find Student Activities          │
│    activities.find({                │
│      student: studentId             │
│    })                               │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 3. Extract Skills from Activities   │
│    Loop activities                  │
│    Extract: skills[], techStack[]   │
│    Count frequency                  │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 4. Build Profile                    │
│    Combine all data                 │
│    Calculate skill levels           │
│    Group by type                    │
└─────────────┬───────────────────────┘
              ↓
Return StudentSkillProfile
```

## Error Handling Flow

```
Request
  ├─ Missing JWT Token
  │   └─ → 401 Unauthorized
  │
  ├─ Invalid JWT Token
  │   └─ → 401 Unauthorized
  │
  ├─ Student Not Found
  │   └─ → 404 Not Found
  │
  ├─ Missing Parameters (message, feature)
  │   └─ → 400 Bad Request
  │
  ├─ Invalid Feature
  │   └─ → 400 Bad Request
  │
  ├─ Database Error
  │   └─ → 500 Internal Server Error
  │
  └─ Python Backend Error
      └─ → 500 Internal Server Error (with details)
```

## Feature-to-Endpoint Mapping

```
Mind Pilot Feature    Python Endpoint    Use Case
──────────────────────────────────────────────────────────
Skill Analysis    →   POST /skill       Analyze & improve skills
Roadmap Provider  →   POST /roadmap     Generate learning path
Interview Prep    →   POST /interview   Practice interviews
Gap Finder        →   POST /skill       Find missing skills
Guidance          →   POST /skill       Career guidance
```

## Security Flow

```
Frontend
    │ (username + password)
    ▼
Auth Controller
    │ Validate credentials
    ▼
Generate JWT Token
    │
    └─→ Return Token
        (Frontend stores in localStorage)
    
Next Requests:
    │ (include JWT in Authorization header)
    ▼
Mind Pilot Controller
    │ @UseGuards(JwtAuthGuard)
    ├─ Validate Token
    ├─ Extract User ID
    ├─ Verify Not Expired
    └─ Allow Access or Return 401
```

## Deployment Architecture

```
┌─────────────────────────────┐
│   Production Environment    │
├─────────────────────────────┤
│                             │
│ ┌───────────────────────┐   │
│ │  Frontend (React)     │   │
│ │  Hosted on Vercel    │   │
│ │  or Similar          │   │
│ └───────┬───────────────┘   │
│         │                   │
│         │ HTTPS Requests    │
│         ▼                   │
│ ┌───────────────────────┐   │
│ │ Backend (NestJS)      │   │
│ │ Mind Pilot Module     │   │
│ │ with Auth            │   │
│ └───────┬───────────────┘   │
│         │                   │
│         │ HTTP/HTTPS        │
│         ▼                   │
│ ┌───────────────────────┐   │
│ │ MongoDB               │   │
│ │ (students, activities,│   │
│ │  users, etc.)        │   │
│ └───────────────────────┘   │
│         │                   │
│         │ (separate service)│
│         ▼                   │
│ ┌───────────────────────┐   │
│ │ Python Backend        │   │
│ │ (Flask/FastAPI)       │   │
│ │ AI/LLM Processing     │   │
│ └───────────────────────┘   │
│                             │
└─────────────────────────────┘
```

## Performance Considerations

```
Request Path Analysis:
    
Request → Controller (1ms)
        ↓
        → JWT Validation (2ms)
        ↓
        → StudentService.getByUserId (10-50ms)
        ↓    [depends on DB connection & indexes]
        ↓
        → ActivityModel.find (10-100ms)
        ↓    [depends on number of activities & DB indexes]
        ↓
        → Skill Aggregation (5-20ms)
        ↓    [in-memory operation]
        ↓
        → Profile Building (1-5ms)
        ↓
        → [IF calling Python Backend]
        ├─ HTTP Request to Python (100-2000ms)
        │  └─ AI Processing (variable)
        ↓
        → Return Response (1ms)

Total Time: 50ms - 2.2 seconds
(Most time spent in DB queries & Python processing)

Optimization Tips:
- Add indexes on activities.student field
- Implement caching for skill profiles
- Use pagination for large activity sets
- Consider denormalizing skill data
```

---

This architecture is designed to be:
- **Scalable**: Can handle many students
- **Secure**: JWT protected, user context maintained
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features
