const { drawTable } = require('../utils/table');

module.exports.drawSecondYearAPITable = function (doc, report, cursor, constants) {
	if (cursor && typeof cursor.x === 'number' && typeof cursor.y === 'number') {
		doc.x = cursor.x;
		doc.y = cursor.y;
	}

	const headers = [
		'Metric',
		'CAY',
		'CAYm1',
		'CAYm2'
	];

	const colWidths = [200, 100, 100, 100];

	const api = report.secondYearPerformance || {};

	const rows = [
		[
			'Appeared for examination',
			api.CAY?.appeared ?? '',
			api.CAYm1?.appeared ?? '',
			api.CAYm2?.appeared ?? ''
		],
		[
			'Passed in examination',
			api.CAY?.passed ?? '',
			api.CAYm1?.passed ?? '',
			api.CAYm2?.passed ?? ''
		],
		[
			'Pass percentage',
			api.CAY?.passPercentage ?? '',
			api.CAYm1?.passPercentage ?? '',
			api.CAYm2?.passPercentage ?? ''
		],
		[
			'Year',
			api.CAY?.label || '',
			api.CAYm1?.label || '',
			api.CAYm2?.label || ''
		]
	];

	return drawTable(
		doc,
		{
			title: 'Table B.4d: Second Year Student Performance (API)',
			headers,
			rows,
			colWidths,
			options: {
				headerHeight: 44,
				fontSizes: { title: 12, header: 9, row: 9 },
				bottomMargin: 1.5
			}
		},
		constants
	);
};
