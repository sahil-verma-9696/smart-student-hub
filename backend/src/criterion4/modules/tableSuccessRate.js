const { drawTable } = require('../utils/table');
const { ensureSpace } = require('../utils/ensureSpace');
const { updateCursor } = require('../utils/cursor');

/**
 * Draw Section 4.2: Success Rate tables
 * 4.2.1 - Success Rate without Backlogs (25 marks)
 * 4.2.2 - Success Rate with Backlog (15 marks)
 */
module.exports.drawSuccessRateTables = function (doc, report, cursor, constants) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN, USABLE_WIDTH } = constants;
	const batches = report.batches || {};
	const batchYears = report.batchYears || {};
	const graduationStats = report.graduationStats || {};
	const totalGraduationStats = report.totalGraduationStats || {};

	// ========== Section 4.2 Header ==========
	doc.font('Helvetica-Bold').fontSize(11);
	ensureSpace(doc, 30, constants);
	doc.text('4.2. Success Rate in the stipulated period of the program (40)', MARGIN, doc.y);
	doc.moveDown(1);

	// ========== 4.2.1 Success Rate without Backlogs (25) ==========
	doc.font('Helvetica-Bold').fontSize(11);
	doc.text('4.2.1. Success rate without backlogs in any semester/year of study (25)', MARGIN, doc.y);
	doc.moveDown(0.5);

	// Formula
	doc.font('Helvetica-Oblique').fontSize(10);
	doc.text('SI = Number of students who have graduated from the program without backlog', MARGIN + 20, doc.y);
	doc.moveDown(0.2);
	doc.text('       Number of students admitted in the first year of that batch and admitted in', MARGIN + 20, doc.y);
	doc.moveDown(0.2);
	doc.text('       2nd year via lateral entry and separate division, if applicable', MARGIN + 20, doc.y);
	doc.moveDown(0.5);

	doc.font('Helvetica-Oblique').fontSize(10);
	doc.text('Average SI = Mean of Success Index (SI) for past three batches', MARGIN + 20, doc.y);
	doc.moveDown(0.3);
	doc.text('Success rate without backlogs in any year of study = 25 × Average SI', MARGIN + 20, doc.y);
	doc.moveDown(1);

	// Table 4.2.1 - Without Backlogs
	// Use LYG (Last Year Graduated) batches: CAYm4, CAYm5, CAYm6
	const lygKeys = ['CAYm4', 'CAYm5', 'CAYm6'];
	const lygLabels = lygKeys.map(k => {
		const year = batchYears[k] || k;
		return `Latest Year of\nGraduation, ${k.replace('CAYm', 'LYGm').replace('CAYm4', 'LYG')}\nBatch\n(${year})`;
	});

	const headers421 = [
		'Item',
		lygLabels[0] || 'LYG\n(2016-20)',
		lygLabels[1] || 'LYGm1\n(2015-19)',
		lygLabels[2] || 'LYGm2\n(2014-18)'
	];

	const colWidths = [200, 105, 105, 105];

	// Calculate SI values
	const siData = lygKeys.map(key => {
		const batch = batches[key]?.batch || {};
		const grad = graduationStats[key] || {};
		
		const N1 = batch.totalAdmitted || 0;
		const N2 = batch.lateralEntry || 0;
		const N3 = batch.separateDivision || 0;
		const x = N1 + N2 + N3;
		
		// Year IV graduates without backlog
		const y = parseInt(grad.yearIV) || 0;
		
		const si = x > 0 ? (y / x) : 0;
		
		return { x, y, si };
	});

	const avgSI = siData.reduce((sum, d) => sum + d.si, 0) / siData.length;

	const rows421 = [
		[
			'Number of students admitted in the corresponding 1st Year + admitted in 2nd year via lateral entry and separate division, if applicable (x)',
			siData[0]?.x || '',
			siData[1]?.x || '',
			siData[2]?.x || ''
		],
		[
			'Number of students who have graduated without backlogs in the stipulated period (y)',
			siData[0]?.y || '',
			siData[1]?.y || '',
			siData[2]?.y || ''
		],
		[
			'Success Index (SI)',
			siData[0]?.si?.toFixed(2) || '',
			siData[1]?.si?.toFixed(2) || '',
			siData[2]?.si?.toFixed(2) || ''
		],
		[
			'Average SI\n[ (SI1 + SI2 + SI3) / 3]',
			avgSI.toFixed(2),
			'',
			''
		]
	];

	drawTable(
		doc,
		{
			title: 'Table 4.2.1: Success Rate without Backlogs',
			headers: headers421,
			rows: rows421,
			colWidths,
			options: {
				headerHeight: 60,
				fontSizes: { title: 12, header: 9, row: 9 },
				firstColLeftPadding: 6,
				paddingTop: 6,
				paddingBottom: 6,
				bottomMargin: 0.5
			}
		},
		constants
	);

	// Assessment text
	doc.font('Helvetica').fontSize(10);
	const assessment421 = (25 * avgSI).toFixed(2);
	doc.text(`Assessment [25 * Average SI]: 25 * ${avgSI.toFixed(2)} = ${assessment421}`, MARGIN + 150, doc.y);
	doc.moveDown(1.5);

	// ========== 4.2.2 Success Rate with Backlog (15) ==========
	doc.font('Helvetica-Bold').fontSize(11);
	ensureSpace(doc, 50, constants);
	doc.text('4.2.2 Success rate with backlog in stipulated period of study (15)', MARGIN, doc.y);
	doc.moveDown(0.5);

	// Formula
	doc.font('Helvetica-Oblique').fontSize(10);
	doc.text('SI = Number of students who graduated from the program in the stipulated period of course duration', MARGIN + 20, doc.y);
	doc.moveDown(0.2);
	doc.text('       Number of students admitted in the first year of that batch and admitted in', MARGIN + 20, doc.y);
	doc.moveDown(0.2);
	doc.text('       2nd year via lateral entry and separate division, if applicable', MARGIN + 20, doc.y);
	doc.moveDown(0.5);

	doc.text('Average SI = mean of Success Index (SI) for past three batches', MARGIN + 20, doc.y);
	doc.moveDown(0.3);
	doc.text('Success rate = 15 × Average SI', MARGIN + 20, doc.y);
	doc.moveDown(1);

	// Calculate SI values for total graduation (with backlog)
	const siDataTotal = lygKeys.map(key => {
		const batch = batches[key]?.batch || {};
		const grad = totalGraduationStats[key] || {};
		
		const N1 = batch.totalAdmitted || 0;
		const N2 = batch.lateralEntry || 0;
		const N3 = batch.separateDivision || 0;
		const x = N1 + N2 + N3;
		
		// Year IV total graduates
		const y = parseInt(grad.yearIV) || 0;
		
		const si = x > 0 ? (y / x) : 0;
		
		return { x, y, si };
	});

	const avgSITotal = siDataTotal.reduce((sum, d) => sum + d.si, 0) / siDataTotal.length;

	const rows422 = [
		[
			'Number of students admitted in the corresponding 1st Year + admitted in 2nd year via lateral entry and separate division, if applicable (x)',
			siDataTotal[0]?.x || '',
			siDataTotal[1]?.x || '',
			siDataTotal[2]?.x || ''
		],
		[
			'Number of students who have graduated in the stipulated period (y)',
			siDataTotal[0]?.y || '',
			siDataTotal[1]?.y || '',
			siDataTotal[2]?.y || ''
		],
		[
			'Success Index (SI)',
			siDataTotal[0]?.si?.toFixed(3) || '',
			siDataTotal[1]?.si?.toFixed(2) || '',
			siDataTotal[2]?.si?.toFixed(3) || ''
		],
		[
			'Average Success Index\n[ (SI1 + SI2 + SI3) / 3]',
			avgSITotal.toFixed(2),
			'',
			''
		]
	];

	drawTable(
		doc,
		{
			title: 'Table 4.2.2: Success Rate with Backlog',
			headers: headers421,
			rows: rows422,
			colWidths,
			options: {
				headerHeight: 60,
				fontSizes: { title: 12, header: 9, row: 9 },
				firstColLeftPadding: 6,
				paddingTop: 6,
				paddingBottom: 6,
				bottomMargin: 0.5
			}
		},
		constants
	);

	// Assessment text
	doc.font('Helvetica').fontSize(10);
	const assessment422 = (15 * avgSITotal).toFixed(2);
	doc.text(`Assessment [15 * Average SI]: 15 * ${avgSITotal.toFixed(2)} = ${assessment422}`, MARGIN + 150, doc.y);
	doc.moveDown(1.5);

	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};