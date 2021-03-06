/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require('../../ast/parser')
const analyze = require('../analyzer')

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
} else if (5 > 9) {
  display "ooga booga"
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
  abcd is Num a
}
function fizzbuzz(x is Num) is Void {
  for i in range(0,x) {
    if (i%3 == 0 and i%5 == 0) {
      display "fizzbuzz"
    } else if (i % 3 == 0) {
      display "fizz"
    } else if (i % 5 == 0) {
      display "buzz"
    } else {
      display i
    }
  }
}
for a in {1,2,3} {
  display a
}
k5 is List<Num> [1,2,3]
u is Num k5[1]
t is Num none
function fun (j is Bool, i is Bool) is Bool {
  3 + 3
  gimme j
}
fun(true,true)
k4 is Dict<Num, Num> {1:10,2:2,3:3}
k4[1]
u is k5[0]
k5[0] is 4
for a in [1,2,3] {
  u is a
}
for a in {1:3,2:1,3:3} {
  u is a
}
for a in {1,2,3} {
  u is a
}

display "string" + "concatenation"

btw: lists return valid lists, sets, dicts
function getListOfNums() is List<Num> {
  gimme [1,2,4]
}
function getListOfTexts() is List<Text> {
  gimme ["!", "1", "dsa"]
}
function getDictOfNumsToTexts() is Dict<Num, Text> {
  gimme {3: "hi", 4: "owo"}
}

ge is Dict<Num, Text> getDictOfNumsToTexts()
function food(x is Num, y is Text, g is Bool) is Void {
  display y
}
food(3, "weW", true)
`

describe('The semantic analyzer', () => {
  test('accepts the mega program with all syntactic forms', (done) => {
    const astRoot = parse(program)
    expect(astRoot).toBeTruthy()
    analyze(astRoot)
    expect(astRoot).toBeTruthy()
    done()
  })
})
