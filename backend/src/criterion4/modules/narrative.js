const { ensureSpace } = require('../utils/ensureSpace');
const { updateCursor } = require('../utils/cursor');
const { generateAINarrative, generateTemplateNarrative, extractMetrics } = require('../services/aiNarrativeGenerator');

/**
 * Draw the AI-generated narrative section (async version)
 * @param {Object} doc - PDFKit document
 * @param {Object} report - Report data
 * @param {Object} cursor - Current cursor position
 * @param {Object} constants - Layout constants
 * @param {Object} options - Additional options (departmentName, instituteName, programName, affiliatingUniversity, useAI)
 * @returns {Promise<Object>} Updated cursor position
 */
module.exports.drawNarrative = async function (doc, report, cursor, constants, options = {}) {
	doc.x = cursor.x;
	doc.y = cursor.y;

	const { MARGIN, USABLE_WIDTH } = constants;
	const { 
		departmentName = 'Computer Science & Engineering', 
		instituteName = 'AIT',
		programName = 'B.Tech (CSE)',
		affiliatingUniversity = 'AKTU, Lucknow',
		useAI = false 
	} = options;

	let narrative;
	
	if (useAI) {
		try {
			narrative = await generateAINarrative(report, { departmentName, instituteName, programName, affiliatingUniversity });
		} catch (error) {
			console.error('AI narrative generation failed:', error);
			const metrics = extractMetrics(report);
			narrative = generateTemplateNarrative(metrics, departmentName, instituteName, programName, affiliatingUniversity);
		}
	} else {
		const metrics = extractMetrics(report);
		narrative = generateTemplateNarrative(metrics, departmentName, instituteName, programName, affiliatingUniversity);
	}

	drawNarrativeText(doc, narrative, constants);
	updateCursor(doc);

	return { x: doc.x, y: doc.y };
};

/**
 * Synchronous version for non-async contexts (uses template-based generation)
 */
module.exports.drawNarrativeSync = function (doc, report, cursor, constants, options = {}) {
	doc.x = cursor.x;
	doc.y = cursor.y;

	const { 
		departmentName = 'Computer Science & Engineering', 
		instituteName = 'AIT',
		programName = 'B.Tech (CSE)',
		affiliatingUniversity = 'AKTU, Lucknow'
	} = options;

	const metrics = extractMetrics(report);
	const narrative = generateTemplateNarrative(metrics, departmentName, instituteName, programName, affiliatingUniversity);

	drawNarrativeText(doc, narrative, constants);
	updateCursor(doc);

	return { x: doc.x, y: doc.y };
};

/**
 * Helper function to draw narrative text with proper formatting
 */
function drawNarrativeText(doc, narrative, constants) {
	const { MARGIN, USABLE_WIDTH } = constants;
	const lineHeight = 14;

	// Split narrative into paragraphs
	const paragraphs = narrative.split('\n\n').filter(p => p.trim());
	
	doc.font('Helvetica').fontSize(10);

	for (const para of paragraphs) {
		const trimmedPara = para.trim();
		
		// Check if it's a bullet point
		if (trimmedPara.startsWith('•') || trimmedPara.startsWith('-') || trimmedPara.startsWith('*')) {
			const bulletText = trimmedPara.replace(/^[•\-\*]\s*/, '');
			const bulletHeight = doc.heightOfString(bulletText, { width: USABLE_WIDTH - 20 });
			
			ensureSpace(doc, bulletHeight + 4, constants);
			
			// Draw bullet and text
			const bulletY = doc.y;
			doc.text('•', MARGIN + 5, bulletY);
			doc.text(bulletText, MARGIN + 20, bulletY, { 
				width: USABLE_WIDTH - 25,
				align: 'justify',
				lineGap: 2
			});
			doc.moveDown(0.3);
		} else {
			// Regular paragraph
			const paraHeight = doc.heightOfString(trimmedPara, { width: USABLE_WIDTH });
			ensureSpace(doc, paraHeight + 4, constants);
			
			doc.text(trimmedPara, MARGIN, doc.y, {
				width: USABLE_WIDTH,
				align: 'justify',
				lineGap: 2
			});
			doc.moveDown(0.5);
		}
	}

	doc.moveDown(0.5);
}
