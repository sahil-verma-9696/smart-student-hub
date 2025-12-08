const { updateCursor } = require('../utils/cursor');

module.exports.drawHeader = function (doc, report, cursor, constants) {
  const { MARGIN, USABLE_WIDTH } = constants;
  const score = 150;

  doc.x = cursor.x;
  doc.y = cursor.y;

  const topY = doc.y;
  const paddingTop = 6;
  const paddingBottom = 6;

  doc.moveTo(MARGIN, topY)
    .lineTo(MARGIN + USABLE_WIDTH, topY)
    .stroke();

  const labelY = topY + paddingTop;

  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('CRITERION 4', MARGIN + 6, labelY, {
    width: USABLE_WIDTH * 0.3
  });

  doc.font('Helvetica-Bold').fontSize(12);
  const centerWidth = USABLE_WIDTH * 0.5;
  doc.text(
    "STUDENTS' PERFORMANCE",
    MARGIN + (USABLE_WIDTH - centerWidth) / 2,
    labelY - 1,
    { width: centerWidth, align: 'center' }
  );

  doc.font('Helvetica-Bold').fontSize(10);
  doc.text(String(score), MARGIN + USABLE_WIDTH - 50, labelY, {
    width: 50,
    align: 'right'
  });

  doc.y = topY + paddingTop + 18 + paddingBottom;
  updateCursor(doc);

  return { x: doc.x, y: doc.y };
};
