const { drawTable } = require('../utils/table');

module.exports.drawGraduatedTable = function (doc, report, cursor, constants, options = {}) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { title = '', dataKey = 'graduationStats' } = options;
	const graduation = report[dataKey] || {};
	const batchYears = report.batchYears || {};
	const batches = report.batches || {};

	// Headers matching reference format
	const headers = [
		'Year of Entry',
		'N1+N2+N3\n(as defined above)',
		'I Year',
		'II Year',
		'III Year',
		'IV Year'
	];

	// Use all 7 years (CAY → CAYm6)
	const keys = ['CAY', 'CAYm1', 'CAYm2', 'CAYm3', 'CAYm4', 'CAYm5', 'CAYm6'];

	// Determine which year columns should be shaded (unavailable data)
	const getUnavailableYearCols = (keyIndex) => {
		// keyIndex 0 = CAY (just enrolled, no data at all)
		// keyIndex 1 = CAYm1 (1st year, only Year I)
		// keyIndex 2 = CAYm2 (2nd year, Years I & II)
		// keyIndex 3 = CAYm3 (3rd year, Years I, II, III)
		// keyIndex 4+ = CAYm4+ (4th year or graduated, all years)
		const availableYears = Math.min(Math.max(keyIndex, 0), 4);
		const unavailableCols = [];
		// Year columns are at index 2 (I), 3 (II), 4 (III), 5 (IV)
		for (let year = availableYears + 1; year <= 4; year++) {
			unavailableCols.push(year + 1);
		}
		return unavailableCols;
	};

	// Build shaded cells set for unavailable data
	const shadedCells = new Set();
	let rowIndex = 0;

	// Build rows
	const rows = keys
		.map((key, keyIndex) => {
			const d = graduation[key];
			if (!d) return null;
			
			// Get academic year from batchYears - format as (2020-21)
			const yearLabel = `(${batchYears[key] || key})`;
			
			// Get batch data for N1+N2+N3 breakdown
			const batch = batches[key]?.batch || {};
			const N1 = batch.totalAdmitted ?? 0;
			const N2 = batch.lateralEntry ?? 0;
			const N3 = batch.separateDivision ?? 0;
			const total = N1 + N2 + N3;
			// Format as "48+0+2" like in reference
			const n1n2n3Display = total > 0 ? `${N1}+${N2}+${N3}` : '';
			
			// Add shaded cells for unavailable year data
			const unavailableCols = getUnavailableYearCols(keyIndex);
			unavailableCols.forEach(col => {
				shadedCells.add(`${rowIndex}:${col}`);
			});
			
			rowIndex++;
			
			const availableYears = Math.min(Math.max(keyIndex, 0), 4);
			
			return [
				yearLabel,
				n1n2n3Display,
				availableYears >= 1 ? (d.yearI ?? '') : '',
				availableYears >= 2 ? (d.yearII ?? '') : '',
				availableYears >= 3 ? (d.yearIII ?? '') : '',
				availableYears >= 4 ? (d.yearIV ?? '') : ''
			];
		})
		.filter(Boolean);

	// Column widths
	const colWidths = [100, 110, 75, 75, 75, 80];

	// Header shaded cells for "Number of students who have successfully graduated" columns
	const headerShadedCells = new Set();

	return drawTable(
		doc,
		{
			title,
			headers,
			rows,
			colWidths,
			options: {
				headerHeight: 50,
				fontSizes: { title: 11, header: 9, row: 9 },
				firstColLeftPadding: 6,
				paddingTop: 6,
				paddingBottom: 6,
				shadedCells,
				headerShadedCells,
				bottomMargin: 1.5
			}
		},
		constants
	);
};
