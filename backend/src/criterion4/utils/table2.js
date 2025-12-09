/**
 * Table2.js - Improved table drawing utility
 * Fixes duplicate header issue on page breaks
 */

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
  const PAGE_BOTTOM_MARGIN = 50;

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
    titleSpacing: 8,
    repeatHeaderOnNewPage: true
  }, options || {});

  // ============ PRE-CALCULATE ALL DIMENSIONS ============
  
  // Calculate header height
  doc.font('Helvetica-Bold').fontSize(opt.fontSizes.header);
  let maxHeaderHeight = opt.headerHeight;
  
  for (let i = 0; i < headers.length; i++) {
    const headerText = String(headers[i] ?? '');
    const textHeight = getTextHeight(doc, headerText, colWidths[i] - 10, {
      fontSize: opt.fontSizes.header,
      font: 'Helvetica-Bold'
    });
    const cellHeight = textHeight + opt.paddingTop + opt.paddingBottom;
    if (cellHeight > maxHeaderHeight) {
      maxHeaderHeight = cellHeight;
    }
  }
  
  const actualHeaderHeight = maxHeaderHeight;

  // Calculate all row heights upfront
  doc.font('Helvetica').fontSize(opt.fontSizes.row);
  const rowHeights = [];
  const minRowHeight = opt.fontSizes.row + opt.paddingTop + opt.paddingBottom + 4;
  
  for (let r = 0; r < rows.length; r++) {
    let maxCellHeight = minRowHeight;
    for (let c = 0; c < rows[r].length; c++) {
      const cellText = String(rows[r][c] ?? '');
      const textHeight = getTextHeight(doc, cellText, colWidths[c] - 10, {
        fontSize: opt.fontSizes.row
      });
      const cellHeight = textHeight + opt.paddingTop + opt.paddingBottom;
      if (cellHeight > maxCellHeight) {
        maxCellHeight = cellHeight;
      }
    }
    rowHeights.push(maxCellHeight);
  }

  // Calculate title height
  let titleHeight = 0;
  if (title) {
    doc.font('Helvetica-Bold').fontSize(opt.fontSizes.title);
    const pageWidth = constants.PAGE_WIDTH || 595.28;
    const usableWidth = pageWidth - (MARGIN * 2);
    titleHeight = getTextHeight(doc, title, usableWidth, {
      fontSize: opt.fontSizes.title,
      font: 'Helvetica-Bold'
    }) + opt.titleSpacing;
  }

  // ============ CHECK IF TABLE FITS ON CURRENT PAGE ============
  
  const firstRowHeight = rowHeights[0] || 30;
  const minSpaceNeeded = titleHeight + actualHeaderHeight + firstRowHeight + PAGE_BOTTOM_MARGIN;
  
  if (doc.y + minSpaceNeeded > BOTTOM_LIMIT) {
    doc.addPage();
    doc.x = MARGIN;
    doc.y = MARGIN;
    updateCursor(doc);
  }

  // ============ DRAW TITLE ============
  
  if (title) {
    doc.font('Helvetica-Bold').fontSize(opt.fontSizes.title);
    const pageWidth = constants.PAGE_WIDTH || 595.28;
    const usableWidth = pageWidth - (MARGIN * 2);
    
    const titleStartY = doc.y;
    doc.text(title, MARGIN, titleStartY, { 
      width: usableWidth, 
      align: 'center'
    });
    
    // Calculate where title actually ended
    const actualTitleHeight = getTextHeight(doc, title, usableWidth, {
      fontSize: opt.fontSizes.title,
      font: 'Helvetica-Bold'
    });
    
    doc.y = titleStartY + actualTitleHeight + opt.titleSpacing;
  }

  // ============ HEADER DRAWING FUNCTION ============
  
  function drawTableHeader(yPosition) {
    doc.font('Helvetica-Bold').fontSize(opt.fontSizes.header);
    doc.lineWidth(opt.borderWidth);
    
    let xPos = MARGIN;
    
    for (let i = 0; i < headers.length; i++) {
      const w = colWidths[i];
      const key = `H:${i}`;

      // Draw background first
      if (opt.headerShadedCells.has(key)) {
        doc.save();
        doc.rect(xPos, yPosition, w, actualHeaderHeight).fill('#DDD');
        doc.restore();
      } else if (opt.headerBgColor) {
        doc.save();
        doc.rect(xPos, yPosition, w, actualHeaderHeight).fill(opt.headerBgColor);
        doc.restore();
      }

      // Draw border
      doc.strokeColor('black');
      doc.rect(xPos, yPosition, w, actualHeaderHeight).stroke();
      
      // Draw text inside clipping region
      const headerText = String(headers[i] ?? '');
      const textHeight = getTextHeight(doc, headerText, w - 8, {
        fontSize: opt.fontSizes.header,
        font: 'Helvetica-Bold'
      });
      const verticalOffset = Math.max(opt.paddingTop, (actualHeaderHeight - textHeight) / 2);
      
      doc.save();
      doc.rect(xPos + 1, yPosition + 1, w - 2, actualHeaderHeight - 2).clip();
      doc.fillColor(opt.headerTextColor || 'black');
      doc.font('Helvetica-Bold').fontSize(opt.fontSizes.header);
      doc.text(headerText, xPos + 4, yPosition + verticalOffset, { 
        width: w - 8, 
        align: 'center'
      });
      doc.restore();
      
      doc.fillColor('black');
      xPos += w;
    }
    
    return yPosition + actualHeaderHeight;
  }

  // ============ ROW DRAWING FUNCTION ============
  
  function drawTableRow(rowData, rowIndex, yPosition, rowHeight) {
    doc.font('Helvetica').fontSize(opt.fontSizes.row);
    doc.lineWidth(opt.borderWidth);
    
    let xPos = MARGIN;
    
    for (let c = 0; c < rowData.length; c++) {
      const w = colWidths[c];
      const key = `${rowIndex}:${c}`;

      // Draw row background color first
      if (opt.rowColors && opt.rowColors[rowIndex]) {
        doc.save();
        doc.rect(xPos, yPosition, w, rowHeight).fill(opt.rowColors[rowIndex]);
        doc.restore();
      }
      
      // Draw cell shading (overrides row color)
      if (opt.shadedCells.has(key)) {
        doc.save();
        doc.rect(xPos, yPosition, w, rowHeight).fill('#CCCCCC');
        doc.restore();
      }

      // Draw border
      doc.strokeColor('black');
      doc.rect(xPos, yPosition, w, rowHeight).stroke();

      // Draw text inside clipping region
      const cellText = String(rowData[c] ?? '');
      const padding = c === 0 ? opt.firstColLeftPadding : 4;
      const cellTextHeight = getTextHeight(doc, cellText, w - (padding * 2), {
        fontSize: opt.fontSizes.row
      });
      const verticalOffset = Math.max(opt.paddingTop, (rowHeight - cellTextHeight) / 2);
      
      doc.save();
      doc.rect(xPos + 1, yPosition + 1, w - 2, rowHeight - 2).clip();
      doc.fillColor('black');
      doc.font('Helvetica').fontSize(opt.fontSizes.row);
      doc.text(cellText, xPos + padding, yPosition + verticalOffset, {
        width: w - (padding * 2),
        align: c === 0 ? 'left' : 'center'
      });
      doc.restore();

      xPos += w;
    }
    
    return yPosition + rowHeight;
  }

  // ============ DRAW TABLE ============
  
  // Draw initial header
  let currentY = drawTableHeader(doc.y);
  doc.y = currentY;
  updateCursor(doc);

  // Track if we just drew a header (to prevent duplicate)
  let headerJustDrawn = true;

  // Draw all rows
  for (let r = 0; r < rows.length; r++) {
    const rowHeight = rowHeights[r];
    
    // Check if row fits on current page
    if (doc.y + rowHeight + PAGE_BOTTOM_MARGIN > BOTTOM_LIMIT) {
      // Need new page
      doc.addPage();
      doc.x = MARGIN;
      doc.y = MARGIN;
      updateCursor(doc);
      
      // Draw header on new page only if enabled
      if (opt.repeatHeaderOnNewPage) {
        currentY = drawTableHeader(doc.y);
        doc.y = currentY;
        updateCursor(doc);
        headerJustDrawn = true;
      }
    } else {
      headerJustDrawn = false;
    }

    // Draw the row
    currentY = drawTableRow(rows[r], r, doc.y, rowHeight);
    doc.y = currentY;
    updateCursor(doc);
  }

  // Add spacing after table
  doc.y += 5;
  doc.moveDown(opt.bottomMargin || 0.5);
  
  return { x: doc.x, y: doc.y };
};
