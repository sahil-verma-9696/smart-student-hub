import CreateInstituteDto from '../dto/create-institute.dto';
import { InstituteDocument } from '../schemas/institute.schema';

export interface IInstituteService {
  /**
   * Create a new institute.
   * Handles only institute-level data (name, code, address, etc.).
   * Does NOT create admin or users here.
   */
  createInstitute(dto: CreateInstituteDto): Promise<InstituteDocument>;

  /**
   * Fetch institute details using institute ID.
   */
  getInstituteById(instituteId: string): Promise<InstituteDocument>;

  /**
   * Add a new department to an institute.
   * Example departments: CSE, ECE, Mechanical, Civil.
   */
  // addDepartment(
  //   instituteId: string,
  //   dto: CreateDepartmentDto,
  // ): Promise<Department>;

  /**
   * Get all departments under a specific institute.
   */
  // getDepartments(instituteId: string): Promise<Department[]>;

  /**
   * Add a new course under a department.
   * Example: B.Tech CSE, BCA, MCA, M.Tech.
   */
  // addCourse(departmentId: string, dto: CreateCourseDto): Promise<Course>;

  /**
   * Get all courses under a specific department.
   */
  // getCoursesByDepartment(departmentId: string): Promise<Course[]>;

  /**
   * Create a new subject (independent entity).
   * Example: DSA, DBMS, AI, Mathematics.
   * Subjects are created once and then assigned to courses/departments.
   */
  // createSubject(dto: CreateSubjectDto): Promise<Subject>;

  /**
   * Assign a subject to a course.
   * Example: Add DBMS subject to B.Tech CSE 3rd semester.
   */
  // assignSubjectToCourse(courseId: string, subjectId: string): Promise<Course>;

  /**
   * Assign a subject to a department.
   * Example: DSA belongs to CSE Department.
   * Helps with higher-level mappings.
   */
  // assignSubjectToDepartment(
  //   departmentId: string,
  //   subjectId: string,
  // ): Promise<Department>;

  /**
   * Add an admin reference to an institute.
   * This is used when AdminService.joinInstitute() is called.
   * Updates institute.admins[].
   */
  addAdminToInstitute(
    instituteId: string,
    adminId: string,
  ): Promise<InstituteDocument>;
}
