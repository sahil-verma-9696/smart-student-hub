const { getTextHeight } = require('./text');
const { updateCursor } = require('./cursor');

module.exports.drawTable = function drawTable(doc, params, constants) {
  const {
    title,
    headers,
    rows,
    colWidths,
    options
  } = params;

  const MARGIN = constants.MARGIN;
  const BOTTOM_LIMIT = constants.BOTTOM_LIMIT;
  const PAGE_BOTTOM_MARGIN = 50; // Safety margin from page bottom

  const opt = Object.assign({
    headerHeight: 44,
    paddingTop: 8,
    paddingBottom: 8,
    shadedCells: new Set(),
    headerShadedCells: new Set(),
    rowColors: {},
    headerBgColor: '#4472C4',
    headerTextColor: 'white',
    firstColLeftPadding: 4,
    fontSizes: { title: 12, header: 9, row: 9 },
    borderWidth: 0.8,
    titleSpacing: 6,
    repeatHeaderOnNewPage: false
  }, options || {});

  // Pre-calculate ALL row heights first
  doc.font('Helvetica').fontSize(opt.fontSizes.row);
  const rowHeights = rows.map(row => {
    const cellHeights = row.map((cell, i) => {
      const cellText = String(cell ?? '');
      const textHeight = getTextHeight(doc, cellText, colWidths[i] - 10, {
        fontSize: opt.fontSizes.row
      });
      return textHeight + opt.paddingTop + opt.paddingBottom;
    });
    const minRowHeight = opt.fontSizes.row + opt.paddingTop + opt.paddingBottom + 4;
    return Math.max(minRowHeight, ...cellHeights);
  });

  // Calculate header height
  doc.font('Helvetica-Bold').fontSize(opt.fontSizes.header);
  const headerHeights = headers.map((h, i) => {
    const textHeight = getTextHeight(doc, h, colWidths[i] - 10, {
      fontSize: opt.fontSizes.header,
      font: 'Helvetica-Bold'
    });
    return textHeight + opt.paddingTop + opt.paddingBottom;
  });
  const calculatedHeaderHeight = Math.max(...headerHeights);
  const actualHeaderHeight = Math.max(opt.headerHeight, calculatedHeaderHeight);

  // Calculate title height - measure actual text height for multi-line titles
  let titleHeight = 0;
  if (title) {
    doc.font('Helvetica-Bold').fontSize(opt.fontSizes.title);
    const pageWidth = constants.PAGE_WIDTH || 595.28;
    const usableWidth = pageWidth - (MARGIN * 2);
    titleHeight = getTextHeight(doc, title, usableWidth, {
      fontSize: opt.fontSizes.title,
      font: 'Helvetica-Bold'
    }) + opt.titleSpacing + 5;
  }

  // Calculate total table height
  const totalTableHeight = titleHeight + actualHeaderHeight + rowHeights.reduce((sum, h) => sum + h, 0);
  const availableSpace = BOTTOM_LIMIT - doc.y - PAGE_BOTTOM_MARGIN;
  const maxPageHeight = BOTTOM_LIMIT - MARGIN - PAGE_BOTTOM_MARGIN;

  // If entire table fits on current page, draw it here
  // If table is small enough to fit on one page but not on current page, move to new page
  // If table is too large for any single page, allow splitting with header repetition
  if (totalTableHeight <= maxPageHeight) {
    // Table can fit on one page
    if (totalTableHeight > availableSpace) {
      // Move entire table to new page to keep it together
      doc.addPage();
      doc.x = MARGIN;
      doc.y = MARGIN;
      updateCursor(doc);
    }
    // Table will be drawn complete on one page, no header repetition needed
    opt.repeatHeaderOnNewPage = false;
  } else {
    // Table is too large for one page, will need to split
    // Enable header repetition for readability
    opt.repeatHeaderOnNewPage = true;
    
    // If not enough space for title + header + first few rows, start fresh
    const minStartSpace = titleHeight + actualHeaderHeight + (rowHeights[0] || 0) + (rowHeights[1] || 0);
    if (doc.y + minStartSpace > BOTTOM_LIMIT) {
      doc.addPage();
      doc.x = MARGIN;
      doc.y = MARGIN;
      updateCursor(doc);
    }
  }

  // Draw Title - manually position without auto page break
  if (title) {
    doc.font('Helvetica-Bold').fontSize(opt.fontSizes.title);
    const pageWidth = constants.PAGE_WIDTH || 595.28;
    const usableWidth = pageWidth - (MARGIN * 2);
    const titleY = doc.y;
    
    // Measure actual title height
    const actualTitleHeight = getTextHeight(doc, title, usableWidth, {
      fontSize: opt.fontSizes.title,
      font: 'Helvetica-Bold'
    });
    
    // Draw title text
    doc.save();
    doc.text(title, MARGIN, titleY, { 
      width: usableWidth, 
      align: 'center'
    });
    doc.restore();
    
    // Set Y position after title with proper spacing
    doc.y = titleY + actualTitleHeight + opt.titleSpacing;
  }

  // Function to draw header
  function drawHeader(startY) {
    doc.font('Helvetica-Bold').fontSize(opt.fontSizes.header);
    doc.lineWidth(opt.borderWidth);
    let x = MARGIN;

    headers.forEach((h, i) => {
      const w = colWidths[i];
      const key = `H:${i}`;

      // Draw background
      if (opt.headerShadedCells.has(key)) {
        doc.save();
        doc.rect(x, startY, w, actualHeaderHeight).fill('#DDD');
        doc.restore();
      } else if (opt.headerBgColor) {
        doc.save();
        doc.rect(x, startY, w, actualHeaderHeight).fill(opt.headerBgColor);
        doc.restore();
      }

      // Draw border
      doc.rect(x, startY, w, actualHeaderHeight).stroke();
      
      // Draw text with clipping - use save/restore to prevent any auto page breaks
      doc.save();
      doc.rect(x + 1, startY + 1, w - 2, actualHeaderHeight - 2).clip();
      
      doc.fillColor(opt.headerTextColor || 'black');
      const headerText = String(h);
      const textHeight = getTextHeight(doc, headerText, w - 8, {
        fontSize: opt.fontSizes.header,
        font: 'Helvetica-Bold'
      });
      const verticalOffset = Math.max(opt.paddingTop, (actualHeaderHeight - textHeight) / 2);
      
      // Position text manually
      doc.text(headerText, x + 4, startY + verticalOffset, { 
        width: w - 8, 
        align: 'center'
      });
      
      doc.restore();
      doc.fillColor('black');

      x += w;
    });

    return startY + actualHeaderHeight;
  }

  // Function to draw a single row
  function drawRow(rowData, rowIndex, startY, rowHeight) {
    doc.font('Helvetica').fontSize(opt.fontSizes.row);
    doc.lineWidth(opt.borderWidth);
    let x = MARGIN;

    rowData.forEach((cell, c) => {
      const w = colWidths[c];
      const key = `${rowIndex}:${c}`;

      // Draw row background color
      if (opt.rowColors && opt.rowColors[rowIndex]) {
        doc.save();
        doc.rect(x, startY, w, rowHeight).fill(opt.rowColors[rowIndex]);
        doc.restore();
      }
      
      // Draw cell shading (overrides row color)
      if (opt.shadedCells.has(key)) {
        doc.save();
        doc.rect(x, startY, w, rowHeight).fill('#CCCCCC');
        doc.restore();
      }

      // Draw border
      doc.rect(x, startY, w, rowHeight).stroke();

      // Draw text with clipping to prevent overflow and auto page breaks
      doc.save();
      doc.rect(x + 1, startY + 1, w - 2, rowHeight - 2).clip();
      
      const cellText = String(cell ?? '');
      const padding = c === 0 ? opt.firstColLeftPadding : 4;
      const cellTextHeight = getTextHeight(doc, cellText, w - (padding * 2), {
        fontSize: opt.fontSizes.row
      });
      const verticalOffset = Math.max(opt.paddingTop, (rowHeight - cellTextHeight) / 2);
      
      doc.fillColor('black');
      doc.text(cellText, x + padding, startY + verticalOffset, {
        width: w - (padding * 2),
        align: c === 0 ? 'left' : 'center'
      });
      
      doc.restore();

      x += w;
    });

    return startY + rowHeight;
  }

  // Draw header
  let currentY = drawHeader(doc.y);
  doc.y = currentY;

  // Draw rows
  for (let r = 0; r < rows.length; r++) {
    const rowHeight = rowHeights[r];
    
    // Only check for page breaks if table is large and splitting is enabled
    if (opt.repeatHeaderOnNewPage && doc.y + rowHeight + PAGE_BOTTOM_MARGIN > BOTTOM_LIMIT) {
      // Move to new page
      doc.addPage();
      doc.x = MARGIN;
      doc.y = MARGIN;
      updateCursor(doc);
      
      // Redraw header on new page for context
      doc.font('Helvetica-Bold').fontSize(opt.fontSizes.header);
      currentY = drawHeader(doc.y);
      doc.y = currentY;
    }
    
    // Draw the row
    currentY = drawRow(rows[r], r, doc.y, rowHeight);
    doc.y = currentY;
    updateCursor(doc);
  }

  // Add bottom margin after table
  doc.y += 5;
  doc.moveDown(opt.bottomMargin || 0.5);
  return { x: doc.x, y: doc.y };
};
