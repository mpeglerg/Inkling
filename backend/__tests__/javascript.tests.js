/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../javascript-generator");

const fixture = {
  // hello: [
  //   String.raw`display "Hello, world"
  // `,
  //   String.raw`console.log("Hello, world")`,
  // ],

  // arithmetic: [
  //   String.raw`3 * -2 + 2
  //   `,
  //   String.raw`((3 * (-(2))) + 2)`,
  // ],
  // VarDeclarationNum: [
  //   String.raw`c is Num 5
  //   `,
  //   String.raw`let c = 5`,
  // ],
  // VarDeclarationConstant: [
  //   String.raw`a is always Text "Hello"
  //   `,
  //   String.raw`const a = "Hello"`,
  // ],
  // DictDeclaration: [
  //   String.raw`i is Dict<Text, Text> {"name":"Marco", "school":"LMU"}
  //   `,
  //   String.raw`let i={"name":"Marco", "school":"LMU"}`,
  // ],

  AssignNum: [
    String.raw`
    c is Num 5
    c is 6
    `,
    String.raw`
    let c =5
    c = 6
    `,
  ],

  // call: [],
  // if: [],
  // ifelse: [],
  // while: [],
  // for: [],
};

function normalize(s) {
  return s.replace(/\s+/g, "");
}

describe("The JavaScript generator", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      expect(normalize(generate(ast))).toEqual(normalize(expected));
      done();
    });
  });
});
