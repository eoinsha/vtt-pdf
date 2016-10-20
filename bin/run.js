#!/usr/bin/env node

var VttPdf = require('..');

var args = process.argv.slice(2);

if (args.length !== 2) {
  printUsage();
  process.exit(-1);
}

VttPdf(args[0], args[1], function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});

function printUsage() {
  console.error(process.argv.slice(0, 2).join(' '), 'vttFilePath', 'pdfFilePath');
}
