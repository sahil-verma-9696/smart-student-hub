const { drawTable } = require('../utils/table');
const { ensureSpace } = require('../utils/ensureSpace');
const { updateCursor } = require('../utils/cursor');

/**
 * Draw Section 4.5: Placement, Higher Studies and Entrepreneurship (40)
 */
module.exports.drawPlacementTable = function (doc, report, cursor, constants) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN, USABLE_WIDTH } = constants;
	const batches = report.batches || {};
	const batchYears = report.batchYears || {};
	const placementStats = report.placementStats || {};

	// Section header
	doc.font('Helvetica-Bold').fontSize(11);
	ensureSpace(doc, 30, constants);
	doc.text('4.5. Placement, Higher Studies and Entrepreneurship (40)', MARGIN, doc.y);
	doc.moveDown(0.5);

	// Formula
	doc.font('Helvetica').fontSize(10);
	doc.text('Assessment Points = 40 × average placement', MARGIN, doc.y);
	doc.moveDown(1);

	// Use LYG batches for placement: CAYm4, CAYm5, CAYm6
	const lygKeys = ['CAYm4', 'CAYm5', 'CAYm6'];
	
	const headers = [
		'Item',
		`LGY\n(${batchYears['CAYm4'] || '2016-17'})`,
		`LGYm1\n(${batchYears['CAYm5'] || '2015-16'})`,
		`LGYm2\n(${batchYears['CAYm6'] || '2014-15'})`
	];

	const colWidths = [200, 105, 105, 105];

	// Build placement data
	const pData = lygKeys.map(key => {
		const stats = placementStats[key] || {};
		return {
			totalFinalYear: stats.totalFinalYear || 0,
			placed: stats.placed || 0,
			higherStudies: stats.higherStudies || 0,
			entrepreneur: stats.entrepreneur || 0,
			xyz: (stats.placed || 0) + (stats.higherStudies || 0) + (stats.entrepreneur || 0)
		};
	});

	// Calculate placement indices
	const placementIndices = pData.map(d => {
		return d.totalFinalYear > 0 ? (d.xyz / d.totalFinalYear) : 0;
	});

	const avgPlacement = placementIndices.reduce((sum, pi) => sum + pi, 0) / placementIndices.length;

	const rows = [
		[
			'Total number of final year students (N)',
			pData[0]?.totalFinalYear || '',
			pData[1]?.totalFinalYear || '',
			pData[2]?.totalFinalYear || ''
		],
		[
			'Number of students placed in companies or Govt. sector(x)',
			pData[0]?.placed || '',
			pData[1]?.placed || '',
			pData[2]?.placed || ''
		],
		[
			'Number of students admitted to higher studies with valid qualifying scores (GATE or equivalent State or National Level tests, GRE, GMAT etc.) (Y)',
			pData[0]?.higherStudies || '',
			pData[1]?.higherStudies || '',
			pData[2]?.higherStudies || ''
		],
		[
			'Number of students turned entrepreneur in Engineering/Technology(z)',
			pData[0]?.entrepreneur || '',
			pData[1]?.entrepreneur || '',
			pData[2]?.entrepreneur || ''
		],
		[
			'x + y + z =',
			pData[0]?.xyz || '',
			pData[1]?.xyz || '',
			pData[2]?.xyz || ''
		],
		[
			'Placement Index [ (x + y + z) / N]',
			placementIndices[0]?.toFixed(3) || '',
			placementIndices[1]?.toFixed(2) || '',
			placementIndices[2]?.toFixed(3) || ''
		]
	];

	drawTable(
		doc,
		{
			title: 'Table 4.5: Placement, Higher Studies and Entrepreneurship',
			headers,
			rows,
			colWidths,
			options: {
				headerHeight: 40,
				fontSizes: { title: 12, header: 9, row: 9 },
				firstColLeftPadding: 6,
				paddingTop: 6,
				paddingBottom: 6,
				bottomMargin: 0.5
			}
		},
		constants
	);

	// Note and Assessment
	doc.font('Helvetica').fontSize(9);
	doc.text('*Student placed after PQ was filled', MARGIN + 200, doc.y);
	doc.moveDown(0.5);
	
	doc.font('Helvetica-Bold').fontSize(10);
	doc.text(`Average Placement [(P1 + P2 + P3)/3]: ${avgPlacement.toFixed(2)}`, MARGIN + 150, doc.y);
	doc.moveDown(0.3);
	
	const assessmentScore = (40 * avgPlacement).toFixed(1);
	doc.text(`Assessment [40 * Average Placement]: 40 * ${avgPlacement.toFixed(2)} = ${assessmentScore}`, MARGIN + 100, doc.y);
	doc.moveDown(1.5);

	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};
