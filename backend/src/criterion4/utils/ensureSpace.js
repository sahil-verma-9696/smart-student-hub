const { updateCursor } = require('./cursor');

module.exports.ensureSpace = function (doc, requiredHeight, constants) {
  const { MARGIN, BOTTOM_LIMIT } = constants;

  // Add a small buffer to ensure we don't cut things off
  const buffer = 10;
  
  if (doc.y + requiredHeight + buffer > BOTTOM_LIMIT) {
    doc.addPage();
    doc.x = MARGIN;
    doc.y = MARGIN;
    updateCursor(doc);
  }
};
