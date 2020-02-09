/*
 * Grammar Error Tests
 *
 * These tests check that our grammar will reject programs with various
 * syntax errors.
 */
const syntaxCheck = require("../syntax-checker");
const errors = [
  [
    "unclosed comment",
    "x is Always Num 5 fyi: this comment needs to end in colon xoxo\n"
  ],
  [
    "function missing return type",
    "arrowFunction is Always(x is Num) => {gimme x + 1}\n"
  ],
  ["keyword as id", "while is Num 5\n"],
  ["bad character in id", "&x is Nu  1\n"],
  ["chained relational operators", "1 < 2 < 3\n"],
  ["unclosed paren", "x is Num (5 + 1 \n"],
  ["incorrect varibale declaration", "Num z is 7\n"],
  ["use of single quotes", "y is Text 'Hello World'\n"],
  [
    "for loop without iterator type delclaration",
    "for i in range(0,10) { btw: this will fail }\n"
  ],
  ["loops missing curly braces", "while (x < 0) btw: this will fail\n"],
  ["programs must end with new line", "x is Num 6"],
  [
    "function params missing type",
    " function add(a, b , c) is Num {gimme a+b+c}\n"
  ]
];
describe("The syntax checker", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, done => {
      expect(syntaxCheck(program)).toBe(false);
      done();
    });
  });
});
