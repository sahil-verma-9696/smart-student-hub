import { ClientSession } from 'mongoose';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { AdminDocument } from '../schema/admin.schema';

export interface IAdminService {
  /**
   * Create a new Admin.
   * - Calls UserService.createUser() to create base user with role = 'admin'
   * - Creates Admin record with reference to userBasicDetails
   * - Does NOT assign institute here unless required by your flow
   */
  createAdmin(
    dto: CreateAdminDto,
    session?: ClientSession,
  ): Promise<AdminDocument>;

  /**
   * Assign an admin to an institute.
   * - Updates admin.institute
   * - Calls InstituteService.addAdminToInstitute() to maintain bidirectional consistency
   * This function orchestrates the relationship.
   */
  joinInstitute(adminId: string, instituteId: string): Promise<AdminDocument>;

  /**
   * Fetch a specific admin using admin ID.
   * Helpful for domain-level operations.
   */
  getAdminById(adminId: string): Promise<AdminDocument>;

  /**
   * Get all admins belonging to a specific institute.
   * Useful for institute dashboards.
   */
  getAdminsByInstitute(instituteId: string): Promise<AdminDocument[]>;

  /**
   * Update admin-specific data.
   * This updates ONLY admin profile fields (NOT user fields).
   * For example: special permissions, admin type, metadata, etc.
   */
  updateAdmin(adminId: string, dto: UpdateAdminDto): Promise<AdminDocument>;

  /**
   * Remove admin from system.
   * - Delete admin profile
   * - Optionally call UserService.deleteUser()
   */
  deleteAdmin(adminId: string): Promise<void>;
}
