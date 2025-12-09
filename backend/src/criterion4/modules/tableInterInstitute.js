const { drawTable } = require('../utils/table');
const { ensureSpace } = require('../utils/ensureSpace');
const { updateCursor } = require('../utils/cursor');

/**
 * Draw Section 4.6.3: Inter-Institute Students' Participation
 * Includes: A. Events Outside State, B. Events Within State, C. Prize Winners
 */
module.exports.drawInterInstituteEventsTable = function (doc, report, cursor, constants, options = {}) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN, USABLE_WIDTH, BOTTOM_LIMIT } = constants;
	const { departmentName = 'Information Technology' } = options;
	const interInstituteEvents = report.interInstituteEvents || {};

	// Check if we have any data at all
	const eventsOutsideState = interInstituteEvents.outsideState || [];
	const eventsWithinState = interInstituteEvents.withinState || [];
	const prizeWinners = interInstituteEvents.prizeWinners || [];
	
	const hasAnyData = eventsOutsideState.length > 0 || eventsWithinState.length > 0 || prizeWinners.length > 0;
	if (!hasAnyData) {
		return { x: doc.x, y: doc.y };
	}

	// Check if we need a new page for section header + table title + first table header
	// Section header (2 lines) + table title + section A header + table header ≈ 120px
	const sectionHeaderHeight = 40; // Section header with description
	const tableTitleHeight = 20; // Table title
	const firstSectionHeaderHeight = 18; // Section A header
	const tableHeaderHeight = 44; // Standard table header
	const minSpaceNeeded = sectionHeaderHeight + tableTitleHeight + firstSectionHeaderHeight + tableHeaderHeight + 20;
	ensureSpace(doc, minSpaceNeeded, constants);

	// Section header
	doc.font('Helvetica-Bold').fontSize(11);
	doc.text('4.6.3  Participation in inter-institute events by students of the program of study       (10)', MARGIN, doc.y);
	doc.moveDown(0.3);

	doc.font('Helvetica').fontSize(9);
	doc.text('(The department shall provide at able indicating those publications, which received awards in the events/', MARGIN, doc.y);
	doc.text('conferences organized by other institutes.)', MARGIN, doc.y + 10);
	doc.moveDown(1.5);

	// Table title
	doc.font('Helvetica-Bold').fontSize(11);
	doc.text("Table 4.6.3a: Inter-Institute Students' Participation", MARGIN, doc.y, { width: USABLE_WIDTH, align: 'center' });
	doc.moveDown(1);

	// ========== A. Events Outside State ==========
	if (eventsOutsideState.length > 0) {
		// Section A header
		doc.font('Helvetica-Bold').fontSize(10);
		doc.fillColor('black');
		const headerY = doc.y;
		doc.rect(MARGIN, headerY, 515, 18).fill('#EEEEEE');
		doc.fillColor('black');
		doc.text('A. Event Outside State', MARGIN, headerY + 4, { width: 515, align: 'center' });
		doc.y = headerY + 22;

		const headersA = ['S. No.', 'Roll Number', 'Name of Student', 'Event', 'Venue', 'Date', 'Remarks'];
		const colWidthsA = [35, 70, 90, 110, 80, 60, 70];

		const rowsA = eventsOutsideState.map((e, idx) => [
			idx + 1,
			e.rollNo || '',
			e.name || '',
			e.event || '',
			e.venue || '',
			e.date || '',
			e.remarks || ''
		]);

		drawTable(doc, {
			title: '',
			headers: headersA,
			rows: rowsA,
			colWidths: colWidthsA,
			options: {
				headerHeight: 28,
				fontSizes: { title: 10, header: 8, row: 8 },
				firstColLeftPadding: 4,
				paddingTop: 4,
				paddingBottom: 4,
				bottomMargin: 0.3
			}
		}, constants);
	}

	// ========== B. Events Within State ==========
	if (eventsWithinState.length > 0) {
		doc.moveDown(0.8);
		
		// Section B header
		doc.font('Helvetica-Bold').fontSize(10);
		const headerYB = doc.y;
		doc.rect(MARGIN, headerYB, 515, 18).fill('#EEEEEE');
		doc.fillColor('black');
		doc.text('B. Events within State', MARGIN, headerYB + 4, { width: 515, align: 'center' });
		doc.y = headerYB + 22;

		const headersB = ['S. No.', 'Roll No', 'Name of Student', 'Event', 'Venue', 'Date', 'Remarks'];
		const colWidthsB = [35, 80, 85, 105, 75, 60, 75];

		const rowsB = eventsWithinState.map((e, idx) => [
			idx + 1,
			e.rollNo || '',
			e.name || '',
			e.event || '',
			e.venue || '',
			e.date || '',
			e.remarks || ''
		]);

		drawTable(doc, {
			title: '',
			headers: headersB,
			rows: rowsB,
			colWidths: colWidthsB,
			options: {
				headerHeight: 28,
				fontSizes: { title: 10, header: 8, row: 8 },
				firstColLeftPadding: 4,
				paddingTop: 4,
				paddingBottom: 4,
				bottomMargin: 0.3
			}
		}, constants);
	}

	// ========== C. Prize Winners ==========
	if (prizeWinners.length > 0) {
		doc.moveDown(0.8);
		
		// Section C header
		doc.font('Helvetica-Bold').fontSize(10);
		const headerYC = doc.y;
		doc.rect(MARGIN, headerYC, 515, 18).fill('#EEEEEE');
		doc.fillColor('black');
		doc.text('C. Prize Winners in Various Events', MARGIN, headerYC + 4, { width: 515, align: 'center' });
		doc.y = headerYC + 22;

		const headersC = ['S. No', 'Roll no', "Student's Name", 'Event', 'VENUE', 'DATE', 'Remarks'];
		const colWidthsC = [35, 80, 85, 100, 75, 60, 80];

		const rowsC = prizeWinners.map((e, idx) => [
			idx + 1,
			e.rollNo || '',
			e.name || '',
			e.event || '',
			e.venue || '',
			e.date || '',
			e.remarks || ''
		]);

		drawTable(doc, {
			title: '',
			headers: headersC,
			rows: rowsC,
			colWidths: colWidthsC,
			options: {
				headerHeight: 28,
				fontSizes: { title: 10, header: 8, row: 8 },
				firstColLeftPadding: 4,
				paddingTop: 4,
				paddingBottom: 4,
				bottomMargin: 0.5
			}
		}, constants);
	}

	// Department footer
	doc.moveDown(0.5);
	doc.font('Helvetica-BoldOblique').fontSize(10);
	doc.text(`Department of ${departmentName}`, MARGIN + 250, doc.y);
	doc.moveDown(1.5);

	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};

/**
 * Draw Coding Competitions table
 */
module.exports.drawCodingCompetitionsTable = function (doc, report, cursor, constants) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN } = constants;
	const codingCompetitions = report.codingCompetitions || [];

	if (codingCompetitions.length === 0) {
		return { x: doc.x, y: doc.y };
	}

	const headers = ['', 'Name', 'Event', 'Venue', 'Date', 'Remarks'];
	const colWidths = [30, 90, 140, 80, 70, 105];

	const rows = codingCompetitions.map((c, idx) => [
		idx + 1,
		c.name || '',
		c.event || '',
		c.venue || '',
		c.date || '',
		c.remarks || ''
	]);

	drawTable(doc, {
		title: 'CODING COMPETITIONS',
		headers,
		rows,
		colWidths,
		options: {
			headerHeight: 28,
			fontSizes: { title: 12, header: 9, row: 8 },
			firstColLeftPadding: 4,
			paddingTop: 4,
			paddingBottom: 4,
			bottomMargin: 1.5
		}
	}, constants);

	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};

/**
 * Draw University Merit List table
 */
module.exports.drawUniversityMeritTable = function (doc, report, cursor, constants, options = {}) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN } = constants;
	const programInfo = report.programInfo || {};
	const departmentName = options.departmentName || programInfo.department || 'Computer Science & Engineering';
	const instituteName = options.instituteName || programInfo.instituteShortName || programInfo.instituteName || 'AIT';
	const universityMerit = report.universityMerit || [];

	if (universityMerit.length === 0) {
		return { x: doc.x, y: doc.y };
	}

	const headers = ['S. No', 'Roll NO', 'Name', 'Session', '%', 'Rank'];
	const colWidths = [40, 90, 130, 80, 60, 115];

	const rows = universityMerit.map((m, idx) => [
		idx + 1,
		m.rollNo || '',
		m.name || '',
		m.session || '',
		m.percentage || '',
		m.rank || ''
	]);

	drawTable(doc, {
		title: `Table 4.6.3b: University Merit List of Department of ${departmentName}, ${instituteName}`,
		headers,
		rows,
		colWidths,
		options: {
			headerHeight: 28,
			fontSizes: { title: 11, header: 9, row: 9 },
			firstColLeftPadding: 4,
			paddingTop: 4,
			paddingBottom: 4,
			bottomMargin: 1.5
		}
	}, constants);

	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};

/**
 * Draw Closure Statement
 */
module.exports.drawClosureStatement = function (doc, report, cursor, constants, options = {}) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const { MARGIN, USABLE_WIDTH } = constants;
	const programInfo = report.programInfo || {};
	const departmentName = options.departmentName || programInfo.department || 'Computer Science & Engineering';
	const instituteName = options.instituteName || programInfo.instituteShortName || programInfo.instituteName || 'AIT';
	const batches = report.batches || {};

	// Calculate dynamic values for closure
	const enrollmentYears = ['CAY', 'CAYm1', 'CAYm2'];
	const ratios = enrollmentYears.map(key => {
		const batch = batches[key]?.batch || {};
		const N1 = batch.totalAdmitted || 0;
		const N = batch.sanctionedIntake || 60;
		return N > 0 ? (N1 / N) * 100 : 0;
	});
	const avgEnrollment = (ratios.reduce((a, b) => a + b, 0) / ratios.length).toFixed(2);

	// Calculate success index range from graduation stats
	const graduationStats = report.graduationStats || {};
	const lygKeys = ['CAYm4', 'CAYm5', 'CAYm6'];
	const siValues = lygKeys.map(key => {
		const batch = batches[key]?.batch || {};
		const grad = graduationStats[key] || {};
		const total = (batch.totalAdmitted || 0) + (batch.lateralEntry || 0) + (batch.separateDivision || 0);
		const graduated = parseInt(grad.yearIV) || 0;
		return total > 0 ? (graduated / total) * 100 : 0;
	}).filter(v => v > 0);

	const minSI = siValues.length > 0 ? Math.min(...siValues).toFixed(0) : 61;
	const maxSI = siValues.length > 0 ? Math.max(...siValues).toFixed(0) : 85;

	// Section header
	doc.font('Helvetica-Bold').fontSize(11);
	
	// Check if we need a new page for closure statement
	// Estimate: header (20px) + text paragraph (60-80px) + spacing
	const closureHeaderHeight = 20;
	const closureTextEstimate = 80; // Estimated height for closure paragraph
	ensureSpace(doc, closureHeaderHeight + closureTextEstimate, constants);
	
	doc.text('Closure Statement:', MARGIN, doc.y);
	doc.moveDown(0.5);

	// Closure text
	doc.font('Helvetica').fontSize(10);
	const closureText = `The enrollment ratio of Department of ${departmentName}, ${instituteName} is ${avgEnrollment} % as an average of last 3 years with success index ranging from ${minSI}% to ${maxSI}% in final year. The department hosts lots of activities to reinforce learning. The program level student professional society organizes various events for their multidimensional learning. "IT BITS" the biannual newsletter of the Department of ${departmentName} publishes all the activities hosted by the program and the institute.`;

	doc.text(closureText, MARGIN, doc.y, {
		width: USABLE_WIDTH,
		align: 'justify',
		lineGap: 2
	});

	doc.moveDown(2);
	updateCursor(doc);
	return { x: doc.x, y: doc.y };
};
