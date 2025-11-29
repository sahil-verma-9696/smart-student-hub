export const CSV_STUDENT_COLUMNS = [
  'name',
  'email',
  'phone',
  'branch',
  'year',
] as const;

export type CsvStudentRow = Record<
  (typeof CSV_STUDENT_COLUMNS)[number],
  string
>;

export const CSV_FIELD_MAP = {
  name: { csv: 'name', required: true },
  email: { csv: 'email', required: true },
  password: { csv: 'password', required: true },
  gender: { csv: 'gender', required: false },
  instituteId: { csv: 'instituteId', required: true },

  // contactInfo fields
  phone: { csv: 'phone', required: true },
  alternatePhone: { csv: 'alternatePhone', required: false },
  address: { csv: 'address', required: false },

  // In future, you can add more:
  // rollNo: { csv: 'roll_no', required: false },
  department: { csv: 'Department', required: false },
  backlogs: { csv: 'Backlogs', required: false }, // 🔥 NEW
};
