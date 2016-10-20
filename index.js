var fs = require('fs');

var Chunk = require('lodash.chunk');
var PDFKit = require('pdfkit');
var RandomColor = require('randomcolor');
var VttToObject = require('vtt-cue-object');

/**
 * Paper Dimensions at 72 DPI
 */
var paperDotSizes = {
  letter: {
    width: 612,
    height: 792
  },
  a4: {
    width: 595,
    height: 942
  }
};

var cuesPerPage = 3;

module.exports = function(vttFile, pdfFile, done) {
  var paperSize = 'letter';
  var pageLayout = 'landscape';

  // Swap width/height for landscape
  var width = paperDotSizes[paperSize].height;
  var height = paperDotSizes[paperSize].width;

  var pdfDoc = new PDFKit({
    autoFirstPage: false
  });
  pdfDoc.pipe(fs.createWriteStream(pdfFile));

  //pdfDoc.font(require.resolve('@typopro/dtp-pacifico/TypoPRO-Pacifico-Regular.ttf')).fontSize(24);
  pdfDoc.fontSize(28);

  fs.readFile(vttFile, 'utf8', function (err, vttStr) {
    if (err) {
      return done(err);
    }
    VttToObject(vttStr, function(vttErr, obj) {
      if (vttErr) {
        return done(vttErr);
      }

      var chunks = Chunk(obj.cues, cuesPerPage);

      for (var i = 0; i < chunks.length; i++) {
        pdfDoc.addPage({
          size: paperSize,
          layout: pageLayout
        });
        pdfDoc.rect(0, 0, width, height).fill(RandomColor());
        pdfDoc.rect(50, 50, width - 100, height - 100).fill('grey', 0.1);

        pdfDoc.fillColor('white');
        pdfDoc.text((i + 1)  + '/' + chunks.length);
        pdfDoc.moveDown();
        for (var j = 0; j < chunks[i].length; j++) {
          pdfDoc.text(chunks[i][j].text);
          pdfDoc.moveDown();
        }
      }
      pdfDoc.end();
      return done();
    });
  });
};
