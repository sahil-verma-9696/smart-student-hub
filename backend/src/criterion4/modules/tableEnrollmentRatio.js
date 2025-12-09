const { drawTable } = require('../utils/table');
const { ensureSpace } = require('../utils/ensureSpace');
const { updateCursor } = require('../utils/cursor');

module.exports.drawEnrollmentRatioTable = function (doc, report, cursor, constants) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN, USABLE_WIDTH } = constants;
	const batches = report.batches || {};
	const batchYears = report.batchYears || {};

	// Section header
	doc.font('Helvetica-Bold').fontSize(11);
	ensureSpace(doc, 30, constants);
	doc.text('4.1 Enrolment Ratio (20)', MARGIN, doc.y);
	doc.moveDown(0.5);

	// Formula text
	doc.font('Helvetica').fontSize(10);
	doc.text('Enrolment Ratio = N1/N', MARGIN, doc.y);
	doc.moveDown(0.8);

	// Table header
	const headers = [
		'',
		'N1 (From Table 4.1)',
		'N (From Table 4.1)',
		'Enrollment Ratio[(N1/N)*100]'
	];

	const colWidths = [100, 130, 130, 155];

	// Get last 3 years data (CAY, CAYm1, CAYm2)
	const enrollmentYears = ['CAY', 'CAYm1', 'CAYm2'];
	const rows = [];
	const ratios = [];

	enrollmentYears.forEach(key => {
		const batch = batches[key]?.batch || {};
		const yearLabel = batchYears[key] || key;
		// N1 = Total admitted in first year (not including lateral entry)
		const N1 = batch.totalAdmitted || 0;
		const N = batch.sanctionedIntake || 60;
		// Enrollment Ratio = (N1/N) * 100
		const ratio = N > 0 ? ((N1 / N) * 100) : 0;
		ratios.push(ratio);

		rows.push([`(${yearLabel})`, N1, N, ratio.toFixed(0) + '%']);
	});

	// Calculate average of the three ratios
	const avgRatio = ratios.length > 0 ? (ratios.reduce((a, b) => a + b, 0) / ratios.length).toFixed(2) : 0;

	const result = drawTable(
		doc,
		{
			title: 'Table 4.1: Enrolment Ratio',
			headers,
			rows,
			colWidths,
			options: {
				headerHeight: 36,
				fontSizes: { title: 12, header: 9, row: 9 },
				firstColLeftPadding: 6,
				paddingTop: 6,
				paddingBottom: 6,
				bottomMargin: 0.5
			}
		},
		constants
	);

	// Average and Assessment text below table
	doc.font('Helvetica').fontSize(10);
	doc.text(`Average [ (ER1 + ER2 + ER3) / 3]: ${avgRatio}%`, MARGIN, doc.y + 5);
	doc.moveDown(0.3);
	
	const assessmentScore = (parseFloat(avgRatio) >= 90 ? 20 : (parseFloat(avgRatio) / 100 * 20)).toFixed(2);
	doc.text(`Assessment: ${assessmentScore}`, MARGIN + 300, doc.y - 14);
	doc.moveDown(1.5);

	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};
