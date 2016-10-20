var fs = require('fs');

var PDFKit = require('pdfkit');
var VttToObject = require('vtt-cue-object');

module.exports = function(vttFile, pdfFile, done) {
  var pdfDoc = new PDFKit({
    autoFirstPage: false
  });
  pdfDoc.pipe(fs.createWriteStream(pdfFile));

  pdfDoc.font(require.resolve('@typopro/dtp-pacifico/TypoPRO-Pacifico-Regular.ttf')).fontSize(24);

  fs.readFile(vttFile, 'utf8', function (err, vttStr) {
    if (err) {
      return done(err);
    }
    VttToObject(vttStr, function(vttErr, obj) {
      if (vttErr) {
        return done(vttErr);
      }

      for (var i = 0; i < obj.cues.length; i++) {
        pdfDoc.addPage({
          size: 'letter',
          layout: 'landscape'
        });
        pdfDoc.text(obj.cues[i].text, 73, 165);
      }
      pdfDoc.end();
      return done();
    });
  });
};
