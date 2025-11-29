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
