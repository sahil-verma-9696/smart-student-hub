const { drawTable } = require('../utils/table');
const { ensureSpace } = require('../utils/ensureSpace');
const { updateCursor } = require('../utils/cursor');

/**
 * Draw Section 4.5a: Placement Details per year
 */
module.exports.drawPlacementDetailsTable = function (doc, report, cursor, constants, options = {}) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN, USABLE_WIDTH } = constants;
	const programInfo = report.programInfo || {};
	const departmentName = options.departmentName || programInfo.department || 'Computer Science & Engineering';
	const instituteName = options.instituteName || programInfo.instituteShortName || programInfo.instituteName || 'AIT';
	const placementDetails = report.placementDetails || {};
	const batchYears = report.batchYears || {};

	// Section header
	doc.font('Helvetica-Bold').fontSize(11);
	ensureSpace(doc, 30, constants);
	doc.text('4.5a. Provide the placement data in the below mentioned format with the name of the', MARGIN, doc.y);
	doc.text('program and the assessment year:', MARGIN, doc.y + 12);
	doc.moveDown(1.5);

	const headers = [
		'Sl',
		'Roll No',
		'Name',
		'Company',
		'Reference number'
	];

	const colWidths = [30, 80, 120, 100, 185];

	// Draw placement details for each year (LYG years)
	const placementYears = ['CAYm4', 'CAYm5', 'CAYm6'];

	placementYears.forEach(yearKey => {
		const yearLabel = batchYears[yearKey] || yearKey;
		const details = placementDetails[yearKey] || [];

		if (details.length === 0) return;

		// Year title with dynamic department and institute
		const deptShort = departmentName.split(' ').map(w => w[0]).join(''); // e.g., CSE
		doc.font('Helvetica-Bold').fontSize(11);
		ensureSpace(doc, 40, constants);
		doc.fillColor('white');
		doc.rect(MARGIN, doc.y, 515, 20).fill('#333');
		doc.fillColor('white');
		doc.text(`${deptShort} ${instituteName} ${yearLabel}`, MARGIN, doc.y + 5, { width: 515, align: 'center' });
		doc.fillColor('black');
		doc.y += 25;

		// Build rows
		const rows = details.map((d, idx) => [
			idx + 1,
			d.rollNo || '',
			d.name || '',
			d.company || '',
			d.referenceNumber || 'No Reference Mention'
		]);

		drawTable(
			doc,
			{
				title: '',
				headers,
				rows,
				colWidths,
				options: {
					headerHeight: 30,
					fontSizes: { title: 12, header: 9, row: 8 },
					firstColLeftPadding: 4,
					paddingTop: 4,
					paddingBottom: 4,
					bottomMargin: 1
				}
			},
			constants
		);

		doc.moveDown(1);
	});

	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};

