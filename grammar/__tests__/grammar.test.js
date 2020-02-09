/*
 * Grammar Success Test
 *
 * These tests check that our grammar accepts a program that features all of
 * syntactic forms of the language.
 */
// const fs = require("fs");
// const ohm = require("ohm-js");
// const grammar = ohm.grammar(fs.readFileSync('grammar/Inkling.ohm'));

const syntaxCheck = require("../syntax-checker");

const program = String.raw`
    btw: this is how we write comments
    fyi: this is how we write
        multi-line comments
    :xoxo
    x is Num 5
    x is 10
    y is Always Num 10
    x is Num 5
    x is 10
    y is Always Num 10
    textWithNewline is Text "there is a new line in \n this text!"
    textWithTab is Text "there is a new line in \t this text!"
    textWithSingleQuote is Text "there is a single quote in \' this text!"
    textWithDoubleQuote is Text "there is a double quote in \" this text!"
    textWithBackslash is Text "there is a backslash in \\ this text!"
    textWithHexDigit is Text "there is a hexademical in \\u{9DB5} this text!"

    function findFactorial(x is Num) is Num {
        if(x == 0 or x == 1) {
            gimme x
        }
        gimme x * findFactorial(x - 1)
    }

    function fibonacci(x is Num) is Num {
        if(x <= 1) {
            gimme x
        } else {
            gimme fibonacci(x - 1) + fibonacci(x - 2)
        }
    }

    function fizzbuzz(x is Num) is void {
        for i is Num in range(0,x) {
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

    function isPrime(x is Num) is Num {
        start is Num 2
        while(start <= x^0.5) {
            if (x % start++ < 1) {
                gimme false
            }
        }
        gimme x > 1
    }

    function negativeChecker(x is Num) is Bool {
        x < 0 ? gimme true : gimme false
    }

    trueVal is Bool negativeChecker(5)

    function findFirstOdd(x is Num) is Num {
        for i is Num in range(0, x) {
            if(i % 2 != 0) {
                gimme i
            }
        }
    }

    function findGreatest(a is Num, b is Num, c is Num) is Num {
        if (a >= b and a >= c) {
            gimme x
        } else if (b >= a and b >= c) {
            gimme b
        } else {
            gimme c
        }
    }
    function testBang() is Text {
        x is Bool true
        if (!x == false) {
            gimme "bang work!"
        } else {
            gimme "bang broke"
        }
    }
    function testPrefixOp() is Text {
        x is Num 0
        if (++x == 1) {
            gimme "++ work!"
        } else {
            gimme "++ broke"
        }
    }

    function testPrefixOp() is Text {
        x is Num 0
        if (--x == -1) {
            gimme "-- work!"
        } else {
            gimme "-- broke"
        }
    }

    arrowFunction is Always(x is Num) is Num => {
        gimme x + 1
    }

    ourList is List<Text> ["this", "is", "a", "legal", "list", "in", "Inkling"]
    aListOfNums is List<Text> ["1", "2", "3", "4", "5", "6", "7"]
    aListOfNums[0] is 0
    ourSet is List<Text> {"this", "is", "a", "legal", "set", "in", "Inkling"}
    aSetOfNums is List<Num> {"1", "2", "3", "4", "5", "6", "7"}
    aSetOfNums[0] is 0
    ourDict is Dict<Num, Text> {0: "this", 1: "is", 2: "a", 3: "legal", 4: "dict", 5: "in", 6: "Inkling"}
    aDictOfNums is Dict<Num, Num> {0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7}
    aDictOfNums[0] is 0
`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program)).toBe(true);
    done();
  });
});
//TO TEST: dictionary
