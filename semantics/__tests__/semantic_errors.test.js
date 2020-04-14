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
  [
    "multiple conditional in ternary",
    '1 < 2 and 3 > 5 ? "hello" : "goodbye"\n',
  ],
  [
    "Void function should not have a return statment",
    'function fun1 (h is Num, i is Num) is Void {\ndisplay "hello"\ngimme 4\n}\n',
  ],
  [
    "Void function should not have a return statment",
    "function fun1 (h is Num, i is Num) is Text {\n1 + 1\n}\n",
  ],
  ["non integer in subtract", '"dog" - 5\n'],
  ["types do not match in equality test", '2 == "dog"\n'],
  ["types do not match in inequality test", '2 < "dog"\n'],
  ["types do not match in declaration", 'x isNum "hello"\n'],
  [
    "undeclared because in other scope",
    "x is Num 5\n function fun1 (h is Num, i is Num) is Void {\ndisplay x\ngimme 4\n}\n",
  ],
  [
    "undeclared because in opposite scope",
    "function fun1 (h is Num, i is Num) is Void {\nx is Num 5\ngimme 4\n}\n display x \n",
  ],
  ["redeclaration of variable", "x isNum 3\nx isNum 4\n"],
  ["type mismatch in assignment", 'x isNum 3\nx is "hello"\n'],
  //   ['writing to (readonly) for loop index', 'for i := 0 to 10 do i := 3'],
  ["too many function arguments", "abs(1, 2, 3)\n"],
  ["too few function arguments", "pow(5)\n"],
  ["wrong type of function argument", 'abs("hi")\n'],
  ["redeclared field", 'd is Dict<Text, Num> {"r": 0, "r": 3}\n'],
  ["no such field", 'p is Dict<Text, Num> {"Sam": 21}\n p["hi"]\n'],
  //   ['member of nonrecord', 'let var x := 3 in x.y end'],
  ["subscript of nonarray", "x is Num 5\nx[0]\n"],
  ["call of nonfunction", "x is Num 5 \n x(5) \n"],
  ["non integer subscript", 'arr is List<Text> [1,2,3]\n arr["lol"]\n'],
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
