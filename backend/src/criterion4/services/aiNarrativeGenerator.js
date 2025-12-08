/**
 * AI Narrative Generator for NBA Criterion 4 Report
 * Uses OpenAI API (or compatible) to generate contextual narratives from table data
 */

const https = require('https');

// Configuration - set your API key in .env file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'api.openai.com';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

/**
 * Generate narrative using AI based on report data
 * @param {Object} report - The report data object
 * @param {Object} options - Options for generation
 * @returns {Promise<string>} Generated narrative
 */
async function generateAINarrative(report, options = {}) {
	const { 
		departmentName = 'Computer Science & Engineering', 
		instituteName = 'AIT',
		programName = 'B.Tech (CSE)',
		affiliatingUniversity = 'AKTU, Lucknow'
	} = options;

	// Extract key metrics from report data
	const metrics = extractMetrics(report);
	
	// Build prompt for AI
	const prompt = buildPrompt(metrics, departmentName, instituteName, programName, affiliatingUniversity);
	
	// If no API key, use fallback template-based generation
	if (!OPENAI_API_KEY) {
		console.log('No OPENAI_API_KEY found, using template-based narrative generation');
		return generateTemplateNarrative(metrics, departmentName, instituteName, programName, affiliatingUniversity);
	}

	try {
		const response = await callOpenAI(prompt);
		return response;
	} catch (error) {
		console.error('AI generation failed, falling back to template:', error.message);
		return generateTemplateNarrative(metrics, departmentName, instituteName, programName, affiliatingUniversity);
	}
}

/**
 * Extract key metrics from report data for narrative generation
 */
function extractMetrics(report) {
	const batches = report.batches || {};
	const batchYears = report.batchYears || {};
	
	// Sanctioned intake
	const cayBatch = batches.CAY?.batch || {};
	const sanctionedIntake = cayBatch.sanctionedIntake || 60;
	
	// Calculate enrollment ratios for last 3 years
	// Enrollment Ratio = N1/N (only totalAdmitted, not including lateral entry)
	const enrollmentData = [];
	const ratios = [];
	['CAY', 'CAYm1', 'CAYm2'].forEach(key => {
		const batch = batches[key]?.batch || {};
		const N1 = batch.totalAdmitted || 0;  // Only first year admitted
		const N = batch.sanctionedIntake || sanctionedIntake;
		const ratio = N > 0 ? ((N1 / N) * 100) : 0;
		ratios.push(ratio);
		enrollmentData.push({
			year: batchYears[key] || key,
			N1,
			N,
			ratio: ratio.toFixed(1)
		});
	});

	// Average enrollment ratio = (ER1 + ER2 + ER3) / 3
	const avgEnrollment = ratios.length > 0 
		? (ratios.reduce((a, b) => a + b, 0) / ratios.length).toFixed(2)
		: 0;

	// Graduation stats
	const graduationStats = report.graduationStats || {};
	const totalGraduationStats = report.totalGraduationStats || {};
	
	// Second year performance
	const secondYearPerf = report.secondYearPerformance || {};
	const avgPassPercentage = calculateAvgPassPercentage(secondYearPerf);

	// Placement stats
	const placementStats = report.placementStats || {};
	const avgPlacement = calculateAvgPlacement(placementStats);

	// Count years of data
	const yearsOfData = Object.keys(batches).length;

	return {
		sanctionedIntake,
		enrollmentData,
		avgEnrollment,
		yearsOfData,
		avgPassPercentage,
		avgPlacement,
		hasGraduationData: Object.keys(graduationStats).length > 0,
		hasPlacementData: Object.keys(placementStats).length > 0
	};
}

function calculateAvgPassPercentage(secondYearPerf) {
	const values = Object.values(secondYearPerf)
		.map(v => parseFloat(String(v.passPercentage || '0').replace('%', '')))
		.filter(v => !isNaN(v) && v > 0);
	
	if (values.length === 0) return 0;
	return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
}

function calculateAvgPlacement(placementStats) {
	const values = Object.values(placementStats)
		.map(v => v.studentsPlaced || 0)
		.filter(v => v > 0);
	
	if (values.length === 0) return 0;
	return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/**
 * Build prompt for AI model
 */
function buildPrompt(metrics, departmentName, instituteName, programName, affiliatingUniversity) {
	return `You are writing a professional academic report for NBA (National Board of Accreditation) accreditation. Generate a formal narrative introduction for Criterion 4 (Students' Performance) section.

CONTEXT:
- Department: ${departmentName}
- Program: ${programName}
- Institute: ${instituteName}
- Affiliating University: ${affiliatingUniversity}
- Sanctioned Intake: ${metrics.sanctionedIntake} students
- Years of Data: ${metrics.yearsOfData} years
- Average Enrollment Ratio: ${metrics.avgEnrollment}%
- Recent Enrollment Data: ${JSON.stringify(metrics.enrollmentData)}
- Average Pass Percentage (2nd Year): ${metrics.avgPassPercentage}%
- Average Students Placed: ${metrics.avgPlacement}

REQUIREMENTS:
1. Write 4-6 paragraphs introducing the Students' Performance section
2. Mention the sanctioned intake and enrollment trends
3. Reference the tables that follow (Table B.4a, Table 4b, Table 4c, etc.)
4. Use formal academic language suitable for accreditation documents
5. Include bullet points for section references
6. Keep it factual and data-driven
7. Format should match NBA SAR (Self Assessment Report) style

Generate the narrative text only, no headers or titles:`;
}

/**
 * Call OpenAI API
 */
function callOpenAI(prompt) {
	return new Promise((resolve, reject) => {
		const data = JSON.stringify({
			model: OPENAI_MODEL,
			messages: [
				{
					role: 'system',
					content: 'You are an expert academic writer specializing in NBA accreditation documents for engineering institutions in India.'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			temperature: 0.7,
			max_tokens: 1000
		});

		const options = {
			hostname: OPENAI_BASE_URL,
			port: 443,
			path: '/v1/chat/completions',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${OPENAI_API_KEY}`,
				'Content-Length': Buffer.byteLength(data)
			}
		};

		const req = https.request(options, (res) => {
			let body = '';
			res.on('data', chunk => body += chunk);
			res.on('end', () => {
				try {
					const json = JSON.parse(body);
					if (json.error) {
						reject(new Error(json.error.message));
					} else {
						const content = json.choices?.[0]?.message?.content || '';
						resolve(content.trim());
					}
				} catch (e) {
					reject(e);
				}
			});
		});

		req.on('error', reject);
		req.write(data);
		req.end();
	});
}

/**
 * Generate narrative using templates (fallback when no AI API)
 */
function generateTemplateNarrative(metrics, departmentName, instituteName, programName, affiliatingUniversity) {
	const { sanctionedIntake, enrollmentData, avgEnrollment, avgPassPercentage, avgPlacement, yearsOfData } = metrics;

	// Build enrollment trend description
	const enrollmentTrend = enrollmentData.map(e => 
		`${e.year}: ${e.ratio}% (${e.N1} out of ${e.N} students)`
	).join(', ');

	const narrative = `The ${programName} program offered by the Department of ${departmentName} at ${instituteName}, affiliated to ${affiliatingUniversity}, has an approved sanctioned intake of ${sanctionedIntake} students. In addition to regular intake, students are admitted through lateral entry in the second year. Criterion 4 furnishes comprehensive information about the program intake, admitted students in each session, and academic performance of current and last three pass-out batches. This information is presented in Table B.4a, Table 4b, and Table 4c respectively. The program intake has been ${sanctionedIntake} students since the last five years.

Section 4.1 represents enrollment ratio, which is more than ${avgEnrollment}% since the last three years. Based on this, the following sections provide related information:

• Section 4.2.1 and 4.2.2 showcase success rates in stipulated period without backlog and with backlog respectively.

• Section 4.3 and 4.4 represent academic performances of the students in third year and second year.

• Section 4.5 contains information about placements, higher studies, and students who opted for entrepreneurship.

• Section 4.6.1 provides details of various engineering events organized in the institute under the flagship of professional societies/chapters of the Department of ${departmentName}.

• Section 4.6.2 gives details about the technical newsletter of the department. Section 4.6.3 shows records of student participation in various inter-institute events.`;

	return narrative;
}

module.exports = {
	generateAINarrative,
	generateTemplateNarrative,
	extractMetrics
};
