module.exports.getTextHeight = function (doc, text, width, options = {}) {
  const fontSize = options.fontSize || doc.fontSize();
  const font = options.font || 'Helvetica';

  doc.font(font).fontSize(fontSize);

  const textStr = String(text ?? '');
  
  // Calculate height using PDFKit's heightOfString
  const height = doc.heightOfString(textStr, {
    width,
    align: options.align || 'left'
  });
  
  // Add extra padding for multi-line text to prevent clipping
  const lineCount = (textStr.match(/\n/g) || []).length + 1;
  const extraPadding = lineCount > 1 ? 2 : 0;
  
  return height + extraPadding;
};
