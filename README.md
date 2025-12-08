
# Users

POST : /users Create a new user
PATCH : /users/:id Update an existing user
DELETE : /users/:id Delete a user
GET : /users Get all users
GET : /users/:id Get a user

# Admins

POST : /admins Create a new admin
PATCH : /admins/:id Update an existing admin
DELETE : /admins/:id Delete an admin
GET : /admins Get all admins
GET : /admins/:id Get an admin  


# Students

POST : /students Create a new student
PATCH : /students/:id Update an existing student
DELETE : /students/:id Delete a student
GET : /students Get all students
GET : /students/:id Get a student
GET : /students/:id/activities Get all activities for a student

# Faculties

POST : /faculties Create a new faculty
PATCH : /faculties/:id Update an existing faculty
DELETE : /faculties/:id Delete a faculty
GET : /faculties Get all faculties
GET : /faculties/:id Get a faculty

GET : /faculties/:id/

# Activities

POST : /activities Create a new activity
PATCH : /activities/:id Update an existing activity
DELETE : /activities/:id Delete an activity
GET : /activities Get all activities
GET : /activities/:id Get an activity

# Auth

POST : /auth/login login a user using email + password  
POST : /auth/register-institute register a new institute along with its first admin

# Institutes

POST : /institutes Create a new institute
PATCH : /institutes/:id Update an existing institute
DELETE : /institutes/:id Delete an institute
GET : /institutes Get all institutes
GET : /institutes/:id Get an institute

GET : /institutes/:id/faculties Get all faculties for an institute
GET : /institutes/:id/students Get all students for an institute
GET : /institutes/:id/admins Get all admins for an institute
GET : /institutes/:id/activities Get all activities for an institute