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
  DictDeclaration: [
    String.raw`i is Dict<Text, Text> {"name":"Marco", "school":"LMU"}
    `,
    String.raw`let i = {"name":"Marco", "school":"LMU"}"`,
  ],
  // EmptySet: [
  //   String.raw`c is Set<Text> {"this", "a", "b"}
  //   `,
  //   String.raw`const set1 = new Set(["this", "a", "b"])`,
  // ],

  // call: [],
  // if: [],
  // ifelse: [],
  // while: [],
  // for: [],
};

describe("The JavaScript generator", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});
