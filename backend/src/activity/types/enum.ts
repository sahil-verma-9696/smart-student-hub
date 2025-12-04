/**
 * @description Upload activity status
 */
export enum ACTIVITY_STATUS {
  PENDING = 'pending', // under_review
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

/**
 * @description  activity type
 */
export enum ACTIVITY_VERIFICATION_STATUS {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ACTIVITY_TYPES {
  CUSTOM = 'custom',
  WORKSHOP = 'workshop',
  HACKATHON = 'hackathon',
  DEFAULT = 'default',
}
