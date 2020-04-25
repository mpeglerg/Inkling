/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require('../../ast/parser')
const analyze = require('../../semantics/analyzer')
const generate = require('../javascript-generator')

const fixture = {
  hello: [String.raw`display "Hello, world"
  `, String.raw`console.log("Hello, world")`],

  arithmetic: [String.raw`3 * -2 + 2
    `, String.raw`((3 * (-(2))) + 2)`],
  
  //call: [String.raw``],  
 // if: [],
  //ifelse: [],
  //while: [],
  //for: [String.raw`for i in 20 {} `,
   //     /let count_(\d+) = 20;\s*for \(let i_(\d+) = 0; i_\2 <= count_\1; i_\2\+\+\) \{\s*\}/],
  builtins: [String.raw`abs(-10) pow(2, 2) length("hello") exit(3)
       `, /"Math.abs"\(-10\);\s*\(""**""\);\s*"".length;\s*process\.exit\(3\);/],

}

describe('The JavaScript generator', () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source)
      analyze(ast)
      expect(generate(ast)).toMatch(expected)
      done()
    })
  })
})
