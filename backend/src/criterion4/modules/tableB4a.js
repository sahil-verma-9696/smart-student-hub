const { drawTable } = require('../utils/table');

module.exports.drawB4a = function (doc, report, cursor, constants, options = {}) {
  if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
    doc.x = cursor.x;
    doc.y = cursor.y;
  }

  const programInfo = report.programInfo || {};
  const { departmentName = 'Computer Science & Engineering', instituteName = 'AIT' } = options;
  const dept = options.departmentName || programInfo.department || departmentName;
  const inst = options.instituteName || programInfo.instituteShortName || programInfo.instituteName || instituteName;
  const batchYears = report.batchYears || {};

  // Build dynamic headers with actual years - 7 columns for 7 years (CAY to CAYm6)
  const headers = [
    'Item (Information to be provided cumulatively for all the shifts with explicit headings, wherever applicable)',
    `CAY\n(${batchYears.CAY || '2025-24'})`,
    `CAYm1\n(${batchYears.CAYm1 || '2024-23'})`,
    `CAYm2\n(${batchYears.CAYm2 || '2023-22'})`,
    `CAYm3\n(${batchYears.CAYm3 || '2022-21'})`,
    `CAYm4\n(${batchYears.CAYm4 || '2021-20'})`,
    `CAYm5\n(${batchYears.CAYm5 || '2020-19'})`,
    `CAYm6\n(${batchYears.CAYm6 || '2019-18'})`
  ];

  // 7 years of data (CAY to CAYm6) - reduced first column width, distributed to year columns
  const colWidths = [150, 52, 52, 52, 52, 52, 52, 53];

  const keys = ['CAY', 'CAYm1', 'CAYm2', 'CAYm3', 'CAYm4', 'CAYm5', 'CAYm6'];

  const makeRow = (label, picker) => [
    label,
    ...keys.map(k => {
      const b = report.batches?.[k]?.batch ?? {};
      return picker(b);
    })
  ];

  const rows = [
    makeRow('Sanctioned intake of the program (N)', b => b.sanctionedIntake ?? ''),
    makeRow('Total number of students admitted in first year minus number of students migrated to other programs/ institutions plus no. of students migrated to this program (N1)', b => b.totalAdmitted ?? ''),
    makeRow('Number of students admitted in 2nd year in the same batch via lateral entry (N2)', b => b.lateralEntry ?? ''),
    makeRow('Separate Division students, if applicable (N3)', b => b.separateDivision ?? ''),
    makeRow('Total number of students admitted in the Program (N1 + N2 + N3)', b => {
      const N1 = b.totalAdmitted ?? 0;
      const N2 = b.lateralEntry ?? 0;
      const N3 = b.separateDivision ?? 0;
      return N1 + N2 + N3 || '';
    })
  ];

  // Row colors matching reference image - tan/orange for specific rows
  const rowColors = {
    1: '#F4B183',  // N1 row - tan/orange
    2: '#F4B183',  // N2 row - tan/orange
    3: '#F4B183',  // N3 row - tan/orange
    4: '#F4B183'   // Total row - tan/orange
  };

  return drawTable(
    doc,
    {
      title: `Table B.4a: Student Admitted in the Department of ${dept}, ${inst} in Last 7 Years`,
      headers,
      rows,
      colWidths,
      options: {
        headerHeight: 70,
        headerBgColor: '#4472C4',   // Blue header background
        headerTextColor: 'white',    // White header text
        rowColors: rowColors,
        fontSizes: { title: 12, header: 9, row: 9 },
        firstColLeftPadding: 4,
        paddingTop: 6,
        paddingBottom: 6,
        bottomMargin: 1.5
      }
    },
    constants
  );
};
