/**
 * E2E Tests for Activity and ActivityType CRUD Operations
 * 
 * Run with: npm run test:e2e -- activity
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('Activity & ActivityType (e2e)', () => {
  let app: INestApplication;
  let activityModel: any;
  let activityTypeModel: any;
  let studentModel: any;
  let facultyModel: any;
  let userModel: any;

  // Test IDs
  const testInstituteId = new Types.ObjectId().toString();
  const testInstituteId2 = new Types.ObjectId().toString();
  
  let testAdminToken = '';
  let testFacultyToken = '';
  let testStudentToken = '';
  let testStudent2Token = '';
  
  let testAdminId = '';
  let testFacultyId = '';
  let testStudentId = '';
  let testStudent2Id = '';
  
  let createdActivityTypeId = '';
  let createdPrimitiveTypeId = '';
  let createdActivityId = '';
  let privateActivityId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    // Get models for direct DB access in tests
    activityModel = moduleFixture.get(getModelToken('Activity'));
    activityTypeModel = moduleFixture.get(getModelToken('ActivityType'));
    studentModel = moduleFixture.get(getModelToken('Student'));
    facultyModel = moduleFixture.get(getModelToken('Faculty'));
    userModel = moduleFixture.get(getModelToken('User'));
  });

  afterAll(async () => {
    // Cleanup test data
    await activityModel?.deleteMany({ title: /^Test/ });
    await activityTypeModel?.deleteMany({ key: /^test-/ });
    await app.close();
  });

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const createTestUser = async (role: string, instituteId: string) => {
    // In real tests, you'd create actual users and get JWT tokens
    // This is a placeholder - implement based on your auth service
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        userId: `test-${role}-${Date.now()}`,
        name: `Test ${role}`,
        email: `test-${role}-${Date.now()}@test.com`,
        password: 'password123',
        gender: 'male',
        role: role,
        contactInfo: { phone: '1234567890' },
        instituteId: instituteId
      });
    return response.body;
  };

  // ============================================
  // ACTIVITY TYPE TESTS
  // ============================================

  describe('ActivityType CRUD', () => {
    describe('POST /activity-types', () => {
      it('should allow admin to create a custom activity type', async () => {
        const dto = {
          key: 'test-workshop-' + Date.now(),
          name: 'Test Workshop Attendance',
          description: 'Testing workshop activity type',
          category: 'ACADEMIC',
          minCredits: 1,
          maxCredits: 5,
          formSchema: [
            {
              key: 'workshop_name',
              label: 'Workshop Name',
              type: 'text',
              required: true
            }
          ]
        };

        const response = await request(app.getHttpServer())
          .post('/activity-types')
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send(dto)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.key).toBe(dto.key);
        expect(response.body.status).toBe('approved');
        expect(response.body.isPrimitive).toBe(false);
        
        createdActivityTypeId = response.body._id;
      });

      it('should allow student to propose a new activity type (status: submitted)', async () => {
        const dto = {
          key: 'test-blog-' + Date.now(),
          name: 'Test Blog Writing',
          description: 'Student proposed activity type',
          category: 'OTHER',
          minCredits: 1,
          maxCredits: 3,
          formSchema: [
            {
              key: 'blog_url',
              label: 'Blog URL',
              type: 'url',
              required: true
            }
          ]
        };

        const response = await request(app.getHttpServer())
          .post('/activity-types')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send(dto)
          .expect(201);

        expect(response.body.status).toBe('submitted');
        expect(response.body.isPrimitive).toBe(false);
      });

      it('should reject duplicate key', async () => {
        const dto = {
          key: 'test-workshop-duplicate',
          name: 'Duplicate Test',
          category: 'ACADEMIC'
        };

        // Create first
        await request(app.getHttpServer())
          .post('/activity-types')
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send(dto)
          .expect(201);

        // Try to create duplicate
        await request(app.getHttpServer())
          .post('/activity-types')
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send(dto)
          .expect(409);
      });
    });

    describe('GET /activity-types', () => {
      it('should return approved activity types for students', async () => {
        const response = await request(app.getHttpServer())
          .get('/activity-types')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        
        // All returned types should be approved
        response.body.data.forEach((type: any) => {
          expect(type.status).toBe('approved');
        });
      });

      it('should return pending types for admin', async () => {
        const response = await request(app.getHttpServer())
          .get('/activity-types/pending')
          .set('Authorization', `Bearer ${testAdminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should filter by category', async () => {
        const response = await request(app.getHttpServer())
          .get('/activity-types')
          .query({ category: 'ACADEMIC' })
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        response.body.data.forEach((type: any) => {
          expect(type.category).toBe('ACADEMIC');
        });
      });
    });

    describe('PATCH /activity-types/:id', () => {
      it('should allow admin to update custom type', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/activity-types/${createdActivityTypeId}`)
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send({ minCredits: 2, maxCredits: 8 })
          .expect(200);

        expect(response.body.minCredits).toBe(2);
        expect(response.body.maxCredits).toBe(8);
      });

      it('should not allow student to update activity types', async () => {
        await request(app.getHttpServer())
          .patch(`/activity-types/${createdActivityTypeId}`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({ minCredits: 5 })
          .expect(403);
      });

      it('should not allow modifying primitive type formSchema', async () => {
        // Skip if no primitive type exists
        if (!createdPrimitiveTypeId) return;

        await request(app.getHttpServer())
          .patch(`/activity-types/${createdPrimitiveTypeId}`)
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send({ 
            formSchema: [{ key: 'new', label: 'New', type: 'text', required: false }] 
          })
          .expect(403);
      });
    });

    describe('POST /activity-types/:id/approve', () => {
      it('should allow admin to approve pending activity type', async () => {
        // First create a pending type
        const createResponse = await request(app.getHttpServer())
          .post('/activity-types')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({
            key: 'test-pending-' + Date.now(),
            name: 'Pending Type',
            category: 'OTHER'
          });

        const pendingTypeId = createResponse.body._id;

        const response = await request(app.getHttpServer())
          .post(`/activity-types/${pendingTypeId}/approve`)
          .set('Authorization', `Bearer ${testAdminToken}`)
          .expect(200);

        expect(response.body.status).toBe('approved');
      });

      it('should not allow faculty to approve activity types', async () => {
        await request(app.getHttpServer())
          .post(`/activity-types/${createdActivityTypeId}/approve`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .expect(403);
      });
    });

    describe('DELETE /activity-types/:id', () => {
      it('should allow admin to delete custom type', async () => {
        // Create a type to delete
        const createResponse = await request(app.getHttpServer())
          .post('/activity-types')
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send({
            key: 'test-to-delete-' + Date.now(),
            name: 'To Delete',
            category: 'OTHER'
          });

        await request(app.getHttpServer())
          .delete(`/activity-types/${createResponse.body._id}`)
          .set('Authorization', `Bearer ${testAdminToken}`)
          .expect(200);
      });

      it('should not allow deleting primitive types', async () => {
        if (!createdPrimitiveTypeId) return;

        await request(app.getHttpServer())
          .delete(`/activity-types/${createdPrimitiveTypeId}`)
          .set('Authorization', `Bearer ${testAdminToken}`)
          .expect(403);
      });
    });
  });

  // ============================================
  // ACTIVITY TESTS
  // ============================================

  describe('Activity CRUD', () => {
    describe('POST /activities', () => {
      it('should allow student to create public activity', async () => {
        const dto = {
          activityTypeId: createdActivityTypeId,
          title: 'Test Public Activity',
          description: 'Testing activity creation',
          isPublic: true,
          skills: ['Testing', 'NodeJS'],
          details: {
            workshop_name: 'Test Workshop'
          }
        };

        const response = await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send(dto)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe(dto.title);
        expect(response.body.status).toBe('PENDING');
        expect(response.body.isPublic).toBe(true);
        
        createdActivityId = response.body._id;
      });

      it('should allow student to create private activity', async () => {
        const dto = {
          activityTypeId: createdActivityTypeId,
          title: 'Test Private Activity',
          description: 'Private activity test',
          isPublic: false,
          skills: ['Private Skill'],
          details: {
            workshop_name: 'Private Workshop'
          }
        };

        const response = await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send(dto)
          .expect(201);

        expect(response.body.isPublic).toBe(false);
        privateActivityId = response.body._id;
      });

      it('should not allow faculty to create activities', async () => {
        await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({
            activityTypeId: createdActivityTypeId,
            title: 'Faculty Activity',
            isPublic: true
          })
          .expect(403);
      });

      it('should not allow admin to create activities', async () => {
        await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send({
            activityTypeId: createdActivityTypeId,
            title: 'Admin Activity',
            isPublic: true
          })
          .expect(403);
      });

      it('should reject invalid activity type', async () => {
        await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({
            activityTypeId: new Types.ObjectId().toString(),
            title: 'Invalid Type Activity',
            isPublic: true
          })
          .expect(404);
      });
    });

    describe('GET /activities', () => {
      it('should return student\'s own activities including private', async () => {
        const response = await request(app.getHttpServer())
          .get('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        
        // Should include the private activity
        const privateActivity = response.body.data.find(
          (a: any) => a._id === privateActivityId
        );
        expect(privateActivity).toBeDefined();
      });

      it('should filter activities by status', async () => {
        const response = await request(app.getHttpServer())
          .get('/activities')
          .query({ status: 'PENDING' })
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        response.body.data.forEach((activity: any) => {
          expect(activity.status).toBe('PENDING');
        });
      });

      it('should support pagination', async () => {
        const response = await request(app.getHttpServer())
          .get('/activities')
          .query({ page: 1, limit: 5 })
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('page', 1);
        expect(response.body).toHaveProperty('limit', 5);
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('totalPages');
      });
    });

    describe('GET /activities/:id', () => {
      it('should allow student to view own activity', async () => {
        const response = await request(app.getHttpServer())
          .get(`/activities/${createdActivityId}`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        expect(response.body._id).toBe(createdActivityId);
      });

      it('should allow student to view own private activity', async () => {
        const response = await request(app.getHttpServer())
          .get(`/activities/${privateActivityId}`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        expect(response.body._id).toBe(privateActivityId);
      });

      it('should not allow faculty to view private activity', async () => {
        await request(app.getHttpServer())
          .get(`/activities/${privateActivityId}`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .expect(403);
      });

      it('should not allow admin to view private activity', async () => {
        await request(app.getHttpServer())
          .get(`/activities/${privateActivityId}`)
          .set('Authorization', `Bearer ${testAdminToken}`)
          .expect(403);
      });

      it('should not allow other student to view activity', async () => {
        await request(app.getHttpServer())
          .get(`/activities/${createdActivityId}`)
          .set('Authorization', `Bearer ${testStudent2Token}`)
          .expect(403);
      });
    });

    describe('PATCH /activities/:id', () => {
      it('should allow student to update own pending activity', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/activities/${createdActivityId}`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({ title: 'Updated Test Activity' })
          .expect(200);

        expect(response.body.title).toBe('Updated Test Activity');
      });

      it('should not allow updating approved activity', async () => {
        // First approve the activity
        await request(app.getHttpServer())
          .post(`/activities/${createdActivityId}/approve`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({ creditsAwarded: 3 });

        // Try to update
        await request(app.getHttpServer())
          .patch(`/activities/${createdActivityId}`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({ title: 'Should Fail' })
          .expect(400);
      });

      it('should not allow faculty to update activities', async () => {
        await request(app.getHttpServer())
          .patch(`/activities/${privateActivityId}`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({ title: 'Faculty Update' })
          .expect(403);
      });
    });

    describe('POST /activities/:id/approve', () => {
      let pendingActivityId: string;

      beforeEach(async () => {
        // Create a new pending activity for each test
        const response = await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({
            activityTypeId: createdActivityTypeId,
            title: 'Test Activity for Approval ' + Date.now(),
            isPublic: true,
            details: { workshop_name: 'Test' }
          });
        pendingActivityId = response.body._id;
      });

      it('should allow faculty to approve activity', async () => {
        const response = await request(app.getHttpServer())
          .post(`/activities/${pendingActivityId}/approve`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({ 
            creditsAwarded: 4,
            remarks: 'Good work!'
          })
          .expect(200);

        expect(response.body.status).toBe('APPROVED');
        expect(response.body.creditsEarned).toBe(4);
      });

      it('should allow admin to approve activity', async () => {
        const response = await request(app.getHttpServer())
          .post(`/activities/${pendingActivityId}/approve`)
          .set('Authorization', `Bearer ${testAdminToken}`)
          .send({ creditsAwarded: 3 })
          .expect(200);

        expect(response.body.status).toBe('APPROVED');
      });

      it('should not allow student to approve activities', async () => {
        await request(app.getHttpServer())
          .post(`/activities/${pendingActivityId}/approve`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({ creditsAwarded: 5 })
          .expect(403);
      });

      it('should cap credits to maxCredits', async () => {
        const response = await request(app.getHttpServer())
          .post(`/activities/${pendingActivityId}/approve`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({ creditsAwarded: 100 }) // Way above max
          .expect(200);

        // Should be capped to maxCredits of the activity type
        expect(response.body.creditsEarned).toBeLessThanOrEqual(10);
      });
    });

    describe('POST /activities/:id/reject', () => {
      let pendingActivityId: string;

      beforeEach(async () => {
        const response = await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({
            activityTypeId: createdActivityTypeId,
            title: 'Test Activity for Rejection ' + Date.now(),
            isPublic: true,
            details: { workshop_name: 'Test' }
          });
        pendingActivityId = response.body._id;
      });

      it('should allow faculty to reject activity with reason', async () => {
        const response = await request(app.getHttpServer())
          .post(`/activities/${pendingActivityId}/reject`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({ reason: 'Insufficient evidence provided' })
          .expect(200);

        expect(response.body.status).toBe('REJECTED');
      });

      it('should require rejection reason', async () => {
        await request(app.getHttpServer())
          .post(`/activities/${pendingActivityId}/reject`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({}) // No reason
          .expect(400);
      });

      it('should not allow student to reject activities', async () => {
        await request(app.getHttpServer())
          .post(`/activities/${pendingActivityId}/reject`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({ reason: 'Self rejection' })
          .expect(403);
      });
    });

    describe('DELETE /activities/:id', () => {
      it('should allow student to delete pending activity', async () => {
        const createResponse = await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({
            activityTypeId: createdActivityTypeId,
            title: 'Test Activity to Delete',
            isPublic: true,
            details: { workshop_name: 'Delete Test' }
          });

        await request(app.getHttpServer())
          .delete(`/activities/${createResponse.body._id}`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);
      });

      it('should not allow deleting approved activity', async () => {
        // Create and approve
        const createResponse = await request(app.getHttpServer())
          .post('/activities')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .send({
            activityTypeId: createdActivityTypeId,
            title: 'Approved Activity',
            isPublic: true,
            details: { workshop_name: 'Approved' }
          });

        await request(app.getHttpServer())
          .post(`/activities/${createResponse.body._id}/approve`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .send({ creditsAwarded: 2 });

        // Try to delete
        await request(app.getHttpServer())
          .delete(`/activities/${createResponse.body._id}`)
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(400);
      });

      it('should not allow faculty to delete activities', async () => {
        await request(app.getHttpServer())
          .delete(`/activities/${privateActivityId}`)
          .set('Authorization', `Bearer ${testFacultyToken}`)
          .expect(403);
      });
    });

    describe('GET /activities/stats/summary', () => {
      it('should return activity statistics', async () => {
        const response = await request(app.getHttpServer())
          .get('/activities/stats/summary')
          .set('Authorization', `Bearer ${testStudentToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('PENDING');
        expect(response.body).toHaveProperty('APPROVED');
        expect(response.body).toHaveProperty('REJECTED');
      });
    });
  });
});
