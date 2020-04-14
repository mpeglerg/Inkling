/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = String.raw` 
k is Bool true
j is Num 5
display !k
display -5
`;

describe("The semantic analyzer", () => {
  test("accepts the mega program with all syntactic forms", (done) => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    console.log("analyze : ", analyze);
    analyze(astRoot);
    expect(astRoot).toBeTruthy();
    done();
  });
});

//TESTED AND PASSED
// b is Num 5
// a is always Text  "Hello"
// c is Set<Text> {"this", "a", "b"}
// e is List<Text> ["this", "a", "b"]
// b is 7
// g is Text "hello this is some sample text"
// h is Set<Num> {1, 2, 3, 5, 6}
// i is Dict<Text, Text> {"name":"Marco", "school":"LMU"}
// ageDictionary is Dict<Text, Num> {"Sam": 21, "Talia": 20}
// z is Bool true
// j is Num 0
// j++
// display "Hello"
// display 0 < 1
// display 1 > 0
// display 7 >= 3
// display 7 <= 3
// display 0 == 1
// display 0 != 1
// display true and false
// display true or false
// display 7 + 3
// display 7 - 3
// display 7 * 3
// display 7 / 3
// display 7 % 3
// display 2^2
// while (j < 5) {
//   display j + 1
// }
// f is Bool true
// if (5 < 9 and 5 > 0 or f) {
//   display "hello"
// } else {
//   display "good bye"
// }
// 1 < 2 ? "Hello" : "good bye"
// function Greeting (h is Text, i is Text) is Text{
//   1 < 2 ? "Hello" : "good bye"
//   display "Hello"
//   gimme "hey"
// }
// function fun1 (h is Num, i is Num) is Void {
//   display 4
// }
// function checker (j is Num, i is Num) is Num {
//   b is Num 0
//   while (j < 5) {
//     display j + i
//   }
//   gimme b
// }
// function test (j is Num, i is Num) is Text {
//   1 < 2 ? "Hello" : "good bye"
//   while (j < 5) {
//     display j + i
//   }
//   gimme "hello"
// }

// TO TEST
// function f (h is Num, i is Num) is Num {
//   j is Num 0
//   while (j < 5) {
//     display pow(j, (pow(3, j)))
//   }
//   a is a + h + i
//   gimme a
// }
// j is Num f(3, 2)
//  }
// c is Text (1 < 2) ? "Hello" : "good bye"
// for a in [1,2,3] {
//   display a
// }
