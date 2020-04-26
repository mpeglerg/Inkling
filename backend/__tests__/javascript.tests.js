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
  // Print: ['display "Hello, world"\n', String.raw`console.log("Hello, world")`],
  // Arithmetic: ["3 * -2 + 2\n", "((3 * (-(2))) + 2)"],
  // VarDeclarationNum: ["a is Num 5\n", "let a_1 = 5"],
  // VarDeclarationConstant: ['b is always Text "Hello"\n', 'const b_2 = "Hello"'],
  // DictDeclaration: [
  //   'c is Dict<Text, Text> {"name":"Marco", "school":"LMU"}\n',
  //   'let c_3 = {"name":"Marco", "school":"LMU"}',
  // ],
  // SetDeclaration: [
  //   'd is Set<Text> {"name", "Marco", "school", "LMU"}\n',
  //   'let d_4 = new Set("name", "Marco", "school", "LMU")',
  // ],
  // AssignNum: ["e is Num 5\n e is 6\n", "let e_5 = 5\n e_5 = 6\n"],
  // If: ["if(true) {\n3 + 4\n}\n", "if(true) {(3 + 4)}"],
  // IfElse: [
  //   "if (true) {\n3 + 4\n} else {\n4+3\n}\n",
  //   "if (true) {(3 + 4)}else{(4+3)}",
  // ],
  // IfElseIfElse: [
  //   "if (true) {\n3 + 4\n} else if (3 < 4) {\n 3 - 4\n} else {\n4+3\n}\n",
  //   "if (true) {(3 + 4)}else if ((3 < 4)) {(3 - 4)}else{(4+3)}",
  // ],
  // Ternary: ["f is Num 3 < 4 ? 5 : 6\n", "let f_6 = (3 < 4) ? 5 : 6"],
  // WhileLoop: ["while (3 < 4) {\n 3 + 4\n}\n", "while ((3<4)) {(3+4)}"],
  // ForLoop: [
  //   "for g in [1,2,3] {\n g + 3\n}\n",
  //   "for (let g_7 of [1,2,3]) {(g_7+3)}",
  // ],
  // // call: [],
  // Functions: [
  //   "function foo(x is Num) is Num {\ngimme x * 3\n}\n",
  //   "function foo_8(x_9) {return (x_9*3)}",
  // ],
  // SubscriptedVarExp: [
  //   "h is List<Num> [1,2,3]\n h[1] is 5\n",
  //   "let h_10 = [1,2,3]\n h_10[1] = 5",
  // ],
  // pow: ["pow(2, 2)\n ", "2**2"],
  // length: ['length("hello")\n', '"hello".length'],
  // slice: ['slice("hello",1,2)\n', '"hello".slice(1, 2)'],
  // slice: ['charAt("hello",1)\n', '"hello".charAt(1)'],
  // abs: ["abs(-1)\n", "Math.abs(-1)"],
  //exit: ["exit(3)\n", "process.exit(3)"],
  // random: ["random(1, 10)\n", "Math.floor(Math.random() * 10 + 1)"],
  // builtins: ['pow(2, 2)\n length("hello")\n', '2**2"hello".length'],
  // ListDeclaration: [
  //   'd is List<Text> ["name", "Marco", "school", "LMU"]\n',
  //   'let d_11 = ["name", "Marco", "school", "LMU"]',
  // ],
  ListMethod: [
    'd is List<Text> ["name", "Marco", "school", "LMU"]\nd.add("guy")\n',
    'let d = ["name", "Marco", "school", "LMU"] d.push("guy")',
  ],
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
