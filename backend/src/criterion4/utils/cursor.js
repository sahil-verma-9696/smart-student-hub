const globalCursor = {
  x: null,
  y: null
};

module.exports.updateCursor = function (doc) {
  doc._docY = doc.y;
  doc._docX = doc.x;

  globalCursor.x = doc.x;
  globalCursor.y = doc.y;
};

module.exports.getGlobalCursor = function () {
  return { x: globalCursor.x, y: globalCursor.y };
};

module.exports.setGlobalCursor = function (cursor) {
  if (!cursor) return;
  if (typeof cursor.x === 'number') globalCursor.x = cursor.x;
  if (typeof cursor.y === 'number') globalCursor.y = cursor.y;
};

