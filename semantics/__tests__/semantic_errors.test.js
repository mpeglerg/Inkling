// /*
//  * Semantic Error Tests
//  *
//  * These tests check that the analyzer will reject programs with various
//  * static semantic errors.
//  */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  ["use of undeclared variable", "x is 1\n"],
  ["assignment to constant", "x is always Num 5\nx is 1\n"],
  ["List with inconsistent types", 'c is List<Text> ["this", 2, "b"]\n'],
  ["Set with inconsistent types", 'c is Set<Text> {"this", 2, "b"}\n'],
  [
    "Dict with inconsistent types",
    'ageDictionary is Dict<Text, Text> {"Sam": 21, "Talia": 20}\n',
  ],
  //   ['non integer in subtract', '"dog" - 5'],
  //   ['types do not match in equality test', '2 == "dog"'],
  //   ['types do not match in inequality test', '2 <> "dog"'],
  //   ['types do not match in declaration', 'x isNum "hello"'],
  //   ['undeclared because in other scope', 'let var x := 1 in let var y := 2 in 1 end; y end'],
  //   ['redeclaration of variable', 'x isNum 3\nx isNum 4'],
  //   ['type mismatch in assignment', 'x isNum 3\nx is "hello'],
  //   ['writing to (readonly) for loop index', 'for i := 0 to 10 do i := 3'],
  //   ['too many function arguments', 'chr(1, 2, 3)'],
  //   ['too few function arguments', 'concat("x")'],
  //   ['wrong type of function argument', 'ord(8)'],
  //   ['redeclared field', 'let type p = {r: int, r: int} in 0 end'],
  //   ['no such field', 'let type p = {r: int} var s: p := nil in s.zzz end'],
  //   ['member of nonrecord', 'let var x := 3 in x.y end'],
  //   ['subscript of nonarray', 'let var x := 3 in x[0] end'],
  //   ['call of nonfunction', 'let var x := 1 in x(5) end'],
  //   ['non integer subscript', 'let type list = array of int var a := list [1] of 0 in a["x"] end'],
  //   // Might need more here, depending on your test coverage report
];

describe("The semantic analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});
