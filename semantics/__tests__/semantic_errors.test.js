// /*
//  * Semantic Error Tests
//  *
//  * These tests check that the analyzer will reject programs with various
//  * static semantic errors.
//  */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  ["use of undeclared variable", "a is 1\n"],
  ["assignment to constant", "b is always Num 5\nx is 1\n"],
  ["List with inconsistent types", 'c is List<Text> ["this", 2, "b"]\n'],
  ["Set with inconsistent types", 'd is Set<Text> {"this", 2, "b"}\n'],
  [
    "Assign new set with wrong types",
    'd is Set<Text> {"this", "hello", "b"}\n d is {5, 3, 2}\n',
  ],
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
  ["non integer in subtract", '"dog" - 5\n'],
  ["types do not match in equality test", '2 == "dog"\n'],
  ["types do not match in inequality test", '2 < "dog"\n'],
  ["types do not match in declaration", 'e isNum "hello"\n'],
  [
    "undeclared because in other scope",
    "f is Num 5\n function fun2 (h is Num, i is Num) is Void {\ndisplay x\ngimme 4\n}\n",
  ],
  [
    "undeclared because in opposite scope",
    "function fun3 (h is Num, i is Num) is Void {\nx is Num 5\ngimme 4\n}\n display x \n",
  ],
  ["redeclaration of variable", "g isNum 3\ng isNum 4\n"],
  ["type mismatch in assignment", 'h isNum 3\nx is "hello"\n'],
  ["writing to (readonly) for loop index", "i is always Num 5\n i is 3\n"],
  ["too many function arguments", "abs(1, 2, 3)\n"],
  ["too few function arguments", "pow(5)\n"],
  ["wrong type of function argument", 'abs("hi")\n'],
  // ["redeclared field", 'd is Dict<Text, Num> {"r": 0, "r": 3}\n'], // just overwrite the field, can change if have time
  ["no such field", 'j is Dict<Text, Num> {"Sam": 21}\n p["hi"]\n'],
  //   ['member of nonrecord', 'let var x := 3 in x.y end'],
  ["subscript of nonarray", "k is Num 5\nx[0]\n"],
  ["call of nonfunction", "l is Num 5 \n x(5) \n"],
  ["non integer subscript", 'm is List<Text> [1,2,3]\n m["lol"]\n'],
  [
    "no return statement in function",
    "function fun4 (x is Num) is Num {display x + 2\n}\n",
  ],
  [
    "function returns the wrong type",
    "function fun5 (x is Num) is Text {gimme x + 2\n}\n",
  ],
  ["return statement outside of a function", "n is Num 5\n gimme n\n"],
  ["can't use ! prefix on non-boolean types", "o is Num 5\n display !o\n"],
  ["can't use have a negative boolean", "q is Bool true\n display -q\n"],
  [
    "variable init in function used outside of block",
    "function fun1 (h is Num) is Void {\ndisplay 4\ninFunctionVar is Num 3\n}\ndisplay inFunctionVar\n",
  ],
  [
    "variable init in function used outside of block",
    '  j is Num 0\nwhile (j < 5) {\ndisplay j\ninWhileVar is Text "hello"\n}\ndisplay inWhileVar\n',
  ],
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
