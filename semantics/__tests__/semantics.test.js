/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = String.raw`
for  var1 in "Hello" {
  display var1
}
b is Num 5
a is always Text  "Hello"
c is Set<Text> {"this", "a", "b"}
e is List<Text> ["this", "a", "b"]

g is Text "hello this is some sample text"
h is Set<Num> {1, 2, 3, 5, 6}
i is Dict<Text, Text> {"name":"Marco", "school":"LMU"}
ageDictionary is Dict<Text, Num> {"Sam": 21, "Talia": 20}
z is Bool true
j is Num 0
j++
display "Hello"
display 0 < 1
display 1 > 0
display 7 >= 3
display 7 <= 3
display 0 == 1
display 0 != 1
display true and false
display true or false
display 7 + 3
display 7 - 3
display 7 * 3
display 7 / 3
display 7 % 3
display 2^2
while (j < 5) {
  display j + 1
}
f is Bool true
if (5 < 9 and 5 > 0 or f) {
  display "hello"
} else {
  display "good bye"
}
1 < 2 ? "Hello" : "good bye"
function Greeting (h is Text, i is Text) is Text{
  1 < 2 ? "Hello" : "good bye"
  display "Hello"
  gimme "hey"
}
function fun1 (h is Num, i is Num) is Void {
  display 4
}
function fun2 (h is Text) is Void {
  display 4
}
fun2("hello")
function checker (j is Num, i is Num) is Num {
  b is Num 0
  while (j < 5) {
    display j + i
  }
  gimme b
}
function test (j is Num, i is Num) is Text {
  1 < 2 ? "Hello" : "good bye"
  while (j < 5) {
    display j + i
  }
  gimme "hello"
}
k is Bool true
display !k
display -j
for a in "hello" {
  display a
}
for a in [1,2,3] {
  display a
}
for a in {1:1} {
  display a
}
for a in {1,2,3} {
  display a
}
u is Num none
function fun (j is Bool, i is Bool) is Bool {
  3 + 3
  gimme j
}
fun(true,true)
k4 is Dict<Num, Num> {1:10,2:2,3:3}
k4[1]
k5 is List<Num> {1,2,3}
k5[0] is 4


`;

describe("The semantic analyzer", () => {
  test("accepts the mega program with all syntactic forms", (done) => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    //console.log("analyze : ", analyze);
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
// k is Bool true
// display !k
// display -j
// for a in "hello" {
//   display a
// }
// for a in [1,2,3] {
//   display a
// }
// for a in {1:1} {
//   display a
// }
// for a in {1,2,3} {
//   display a
// }
// function fun (j is Bool, i is Bool) is Bool {
//   gimme j
// }
// fun(true,true)
// k4 is Dict<Num, Num> {1:10,2:2,3:3}
// k4[1]
// k5 is List<Num> {1,2,3}
// k5[0] is 4

// fun(true,true)
// k is Set<Num> {1,2,3}
// k[0] is 4
//
//k is Dict<Num, Num> {1:10,2:2,3:3}
// k[1]

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
