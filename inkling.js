/*
 * Inkling Compiler.
 * File structure and design from https://github.com/dmoini/casper/blob/master/casper.js.
 */

const fs = require('fs')
const util = require('util')
const yargs = require('yargs')
const parse = require('./ast/parser')

// Build and return ast
function compile(sourceCode) {
  const program = parse(sourceCode)
  return util.inspect(program, { depth: null })
}

// If compiling from a file, write to standard output.
function compileFile(filename, options) {
  fs.readFile(filename, 'utf-8', (error, sourceCode) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return
    }

    // eslint-disable-next-line no-console
    console.log(compile(sourceCode, options))
  })
}

// If running as a script, we have a lot of command line processing to do. The source
// program will come from the file name that is given as the command line argument.
if (require.main === module) {
  const { argv } = yargs.usage('$0 [-a] filename')
    .boolean(['a'])
    .describe('a', 'show abstract syntax tree after parsing then stop')
    .demand(1)
  compileFile(argv._[0], {
    astOnly: argv.a,
  })
}
