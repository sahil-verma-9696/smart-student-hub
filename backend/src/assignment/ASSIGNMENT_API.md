# Assignment API Documentation

## Overview
The Assignment module manages the mapping between Activities and Faculty members. Each activity can only be assigned to one faculty member, but a faculty can have multiple activities assigned to them.

## Architecture
- **AssignmentController**: Intentionally empty - all routes handled by Admin and Faculty controllers
- **AssignmentService**: Contains all business logic for assignment operations
- **Admin Routes**: Full CRUD operations for managing assignments
- **Faculty Routes**: Read-only access to view their assigned activities

---

## Admin Routes (Prefix: `/admin`)

### 1. Assign Single Activity
**POST** `/admin/assignment`

Assigns a single activity to a faculty member.

**Body:**
```json
{
  "activityId": "mongoId",
  "facultyId": "mongoId",
  "instituteId": "mongoId"
}
```

**Response:**
```json
{
  "_id": "assignmentId",
  "activityId": { ...populated activity },
  "facultyId": { ...populated faculty },
  "instituteId": "mongoId",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

### 2. Bulk Assign Activities
**POST** `/admin/assignment/bulk`

Assigns multiple activities to a single faculty member in one operation.

**Body:**
```json
{
  "activityIds": ["mongoId1", "mongoId2", "mongoId3"],
  "facultyId": "mongoId",
  "instituteId": "mongoId"
}
```

**Response:**
```json
{
  "status": "success" | "partial" | "failed",
  "total": 3,
  "assigned": 2,
  "alreadyAssigned": 1,
  "failed": 0,
  "successes": [
    { "activityId": "mongoId1", "assignmentId": "mongoId" },
    { "activityId": "mongoId2", "assignmentId": "mongoId" }
  ],
  "alreadyAssigned": [
    { "activityId": "mongoId3", "currentFacultyId": "mongoId" }
  ],
  "failures": []
}
```

---

### 3. Reassign Activity
**PATCH** `/admin/assignment/reassign`

Reassigns an activity from one faculty to another.

**Body:**
```json
{
  "activityId": "mongoId",
  "newFacultyId": "mongoId"
}
```

**Response:**
```json
{
  "_id": "assignmentId",
  "activityId": { ...populated activity },
  "facultyId": { ...populated new faculty },
  "instituteId": "mongoId",
  "updatedAt": "timestamp"
}
```

---

### 4. Get All Assignments
**GET** `/admin/assignment?facultyId=xxx&instituteId=xxx&activityId=xxx`

Retrieves assignments with optional filters.

**Query Parameters:**
- `facultyId` (optional): Filter by faculty
- `instituteId` (optional): Filter by institute
- `activityId` (optional): Filter by activity

**Response:**
```json
[
  {
    "_id": "assignmentId",
    "activityId": {
      "_id": "activityId",
      "title": "Activity Title",
      "student": {
        "basicUserDetails": { "name": "Student Name" }
      }
    },
    "facultyId": {
      "basicUserDetails": { "name": "Faculty Name" }
    },
    "instituteId": "mongoId"
  }
]
```

---

### 5. Get Assignment by Activity ID
**GET** `/admin/assignment/activity/:activityId`

Gets the assignment details for a specific activity.

**Response:**
```json
{
  "_id": "assignmentId",
  "activityId": { ...populated activity },
  "facultyId": { ...populated faculty },
  "instituteId": "mongoId"
}
```

Or `null` if not assigned.

---

### 6. Unassign Activity
**DELETE** `/admin/assignment/activity/:activityId`

Removes the faculty assignment from an activity.

**Response:**
```json
{
  "message": "Activity unassigned successfully"
}
```

---

### 7. Get Faculty Assignment Counts
**GET** `/admin/assignment/faculty-counts/:instituteId`

Gets aggregated counts of activities assigned to each faculty in an institute.

**Response:**
```json
[
  {
    "facultyId": "mongoId",
    "count": 5,
    "name": "Faculty Name",
    "email": "faculty@example.com",
    "department": "Computer Science"
  }
]
```

---

## Faculty Routes (Prefix: `/faculty`)

### 1. Get My Assigned Activities
**GET** `/faculty/:facultyId/assignments?instituteId=xxx`

Retrieves all activities assigned to a specific faculty member.

**Query Parameters:**
- `instituteId` (optional): Filter by institute

**Response:**
```json
[
  {
    "_id": "assignmentId",
    "activityId": {
      "_id": "activityId",
      "title": "Activity Title",
      "description": "Activity Description",
      "status": "pending",
      "student": {
        "basicUserDetails": {
          "name": "Student Name",
          "email": "student@example.com"
        }
      }
    },
    "facultyId": {
      "basicUserDetails": {
        "name": "Faculty Name"
      }
    },
    "instituteId": "mongoId",
    "createdAt": "timestamp"
  }
]
```

---

### 2. Get Assignment by Activity ID
**GET** `/faculty/assignment/activity/:activityId`

Gets the assignment details for a specific activity (same as admin route but accessible to faculty).

**Response:** Same as admin route #5

---

## Service Methods

### AssignmentService Methods:

1. **assignActivity(dto: CreateAssignmentDto)**: Assign single activity
2. **bulkAssignActivities(dto: BulkAssignDto)**: Bulk assign activities
3. **reassignActivity(dto: ReassignActivityDto)**: Reassign to different faculty
4. **getActivitiesByFacultyId(facultyId, instituteId?)**: Get activities by faculty
5. **getAssignments(query: QueryAssignmentDto)**: Get assignments with filters
6. **getAssignmentByActivityId(activityId)**: Get assignment for specific activity
7. **unassignActivity(activityId)**: Remove assignment
8. **getFacultyAssignmentCounts(instituteId)**: Get aggregated counts

---

## DTOs

### CreateAssignmentDto
```typescript
{
  activityId: string | Types.ObjectId;
  facultyId: string | Types.ObjectId;
  instituteId: string | Types.ObjectId;
}
```

### BulkAssignDto
```typescript
{
  activityIds: string[] | Types.ObjectId[];
  facultyId: string | Types.ObjectId;
  instituteId: string | Types.ObjectId;
}
```

### ReassignActivityDto
```typescript
{
  activityId: string | Types.ObjectId;
  newFacultyId: string | Types.ObjectId;
}
```

### QueryAssignmentDto
```typescript
{
  facultyId?: string;
  instituteId?: string;
  activityId?: string;
}
```

---

## Error Handling

### Common Errors:

1. **ConflictException (409)**: Activity already assigned to a faculty
2. **NotFoundException (404)**: Assignment not found / Faculty not found / Activity not found
3. **BadRequestException (400)**: Invalid ObjectId format

---

## Usage Examples

### Admin: Bulk Assign Activities
```bash
POST /admin/assignment/bulk
{
  "activityIds": ["673abc...", "674def..."],
  "facultyId": "675ghi...",
  "instituteId": "676jkl..."
}
```

### Admin: Reassign Activity
```bash
PATCH /admin/assignment/reassign
{
  "activityId": "673abc...",
  "newFacultyId": "677mno..."
}
```

### Faculty: View My Assignments
```bash
GET /faculty/675ghi.../assignments?instituteId=676jkl...
```
