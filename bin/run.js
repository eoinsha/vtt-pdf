#!/usr/bin/env node

var VttPdf = require('..');

var argv = require('yargs')
  .usage('$0 [-c cuesPerPage] input.vtt output.pdf')
  .alias('c', 'cues')
  .number('c')
  .describe('c', 'Number of cues per page')
  .demand(2)
  .help('h')
  .argv;

var options = {};
if (argv.c) {
  options.cuesPerPage = parseInt(argv.c);
}

VttPdf(argv._[0], argv._[1], options, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
