# Smart Student Hub

## Backend_setup

1. set terminal to backend directory
```bash
cd backend
```

1. install the dependency that present in package.json (first time and when ever sync with branch)
```bash
npm install
```

### Create .env.production and .env.development 
and ask those secret from owner or maintainer

3. for development 
```bash
npm run dev
```

4. for production 
```bash
npm start
```





## Frontend_setup

1. set terminal to frontend directory
```bash
cd frontend
```

### Run this command only time 

```bash
mkdir certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout certs/key.pem -out certs/cert.pem -days 365 -subj "/CN=localhost"
```

### Create .env.production and .env.development 
and ask those secret from owner or maintainer

2. install the dependency that present in package.json (first time and when ever sync with branch)
```bash
npm install
```


3. for development 
```bash
npm run dev
```

4. for production 
```bash
npm start
```


{
    "data": {
        "institute": {
            "institute_name": "new technology",
            "institute_type": "government",
            "official_email": "ab@gmail.com",
            "official_phone": "08090768937",
            "address_line1": "208 Lal bangla ",
            "city": "kanpur",
            "state": "Uttar Pradesh",
            "pincode": "208009",
            "is_affiliated": true,
            "affiliation_university": "aktu",
            "affiliation_id": "809098",
            "_id": "6922ed4a5664d6c0ef1a862e",
            "createdAt": "2025-11-23T11:17:30.926Z",
            "updatedAt": "2025-11-23T11:17:30.926Z",
            "__v": 0
        },
        "admin": {
            "basicUserDetails": "6922ed4b5664d6c0ef1a8630",
            "_id": "6922ed4b5664d6c0ef1a8633",
            "createdAt": "2025-11-23T11:17:31.352Z",
            "updatedAt": "2025-11-23T11:17:31.352Z",
            "__v": 0
        },
        "user": {
            "userId": "6922ed4a5664d6c0ef1a862e",
            "name": "ajays",
            "email": "an@gmail.com",
            "passwordHash": "$2b$10$xphNIo8CrcjepGDF10Ivz.M2kE8PYKTDrZ29gkEXWXDuu4ezp49dS",
            "role": "admin",
            "gender": "male",
            "contactInfo": {
                "phone": "08090768936",
                "alternatePhone": "08090768934",
                "address": "208 Lal bangla harjendra "
            },
            "instituteId": "6922ed4a5664d6c0ef1a862e",
            "adminId": null,
            "studentId": null,
            "facultyId": null,
            "_id": "6922ed4b5664d6c0ef1a8630",
            "createdAt": "2025-11-23T11:17:31.033Z",
            "updatedAt": "2025-11-23T11:17:31.033Z",
            "__v": 0
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjkyMmVkNGI1NjY0ZDZjMGVmMWE4NjMwIiwiaW5zdGl0dXRlX2lkIjoiNjkyMmVkNGE1NjY0ZDZjMGVmMWE4NjJlIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYzODk2NjUxLCJleHAiOjE3NjM5ODMwNTF9.3rteQlrcA6OE5qaQNOBGgc9y6PYj_56zVSQFLb3sy_I",
        "expires_in": "86400000",
        "msg": "Institute Successfully Registered"
    },
    "meta": {
        "timestamp": "2025-11-23T11:17:31.518Z",
        "path": "/auth/institute/register"
    }
}
token
: 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjkyMmVkNGI1NjY0ZDZjMGVmMWE4NjMwIiwiaW5zdGl0dXRlX2lkIjoiNjkyMmVkNGE1NjY0ZDZjMGVmMWE4NjJlIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYzODk2NjUxLCJleHAiOjE3NjM5ODMwNTF9.3rteQlrcA6OE5qaQNOBGgc9y6PYj_56zVSQFLb3sy_I"