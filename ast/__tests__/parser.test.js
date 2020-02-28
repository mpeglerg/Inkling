// perhaps look at iki https://github.com/rtoal/iki-compiler/blob/master/ast/__tests__/parser.test.js

/*
 * Parser Tests
 *
 * These tests check that the parser produces the AST that we expect.
 *
 * Note we are only checking syntactic forms here, so our test programs
 * may have semantic errors.
 *
 * Based on toal's iki parser.test.js
 */

const parse = require("../parser");

const {
  Program,
  Block,
  Assignment,
  VarDeclaration,
  Print,
  ReturnStatement,
  IfStmt,
  ForLoop,
  FuncDecStmt,
  WhileLoop,
  FieldVarExp,
  IdentifierExpression,
  SubscriptedVarExp,
  Param,
  Call,
  BinaryExpression,
  PowExp,
  PrefixExpression,
  PostfixExpression,
  ListExpression,
  KeyValueExpression,
  DictExpression,
  SetExpression,
  ListType,
  SetType,
  DictType,
  NumericLiteral,
  TextLiteral,
  BooleanLiteral
} = require("../index");

const fixture = {
  declarations: [
    String.raw`y is Text "Hello World!"
    `,
    new Program([
      new VarDeclaration("y", false, "Text", new TextLiteral('"Hello World!"'))
    ]),
    String.raw`x is always Num 5
    `,
    new Program([
      new NumericLiteral("5"),
      new VarDeclaration("x", true, "Num")
    ]),
    String.raw`x is Bool true
    `, // false?
    new Program([
      new BooleanLiteral("true"),
      new VarDeclaration("x", true, "Bool")
    ]),
    String.raw`x is always Num 5
    `,
    new Program([new NumericLiteral(5), new VarDeclaration("x", true, "Num")])
  ],

  functions: [
    String.raw`
    function f(x is Num, y is Num) is Num {
      gimme x + y
    }
    `,
    new Program(
      new FuncDecStmt(
        "f",
        new Param("x", "Num"),
        new Param("y", "Num"),
        "Num",
        new Block([new ReturnStatement(new BinaryExpression("+", "x", "y"))])
      )
    )
  ],

  whiles: [
    String.raw`
      x is Num 2
      y is Num 4
      while(x <= y) {
        display 'hi'
        x++
      }
  `,
    new Program([
      new WhileLoop(
        new BinaryExpression(
          "<=",
          new VarDeclaration("x", false, "Num", new NumericLiteral(2)),
          new VarDeclaration("y", false, "Num", new NumericLiteral(4))
        ),
        new Block([new Print(new TextLiteral("hi"))]),
        new PostfixExpression("x", "++")
      )
    ])
  ]

  // fors: [
  //   String.raw`
  //   for x is Num in range(0, 10){
  //     display 'hi'
  //   }
  // `,
  //   new Program([
  //     new ForLoop(
  //       new IdentifierExpression('x'),
  //       new
  //     )
  //   ])
  // ]

  //
  // math: [
  //   String.raw`read x, y; write 2 * (-5 > 7+1);`,
  //   new Program(
  //     new Block([
  //       new ReadStatement(
  //         [new VariableExpression('x'), new VariableExpression('y')]),
  //       new WriteStatement([
  //         new BinaryExpression(
  //           '*',
  //           new IntegerLiteral('2'),
  //           new BinaryExpression(
  //             '>',
  //             new UnaryExpression('-', new IntegerLiteral('5')),
  //             new BinaryExpression('+', new IntegerLiteral('7'),
  //               new IntegerLiteral('1')),
  //           ),
  //         ),
  //       ]),
  //     ]),
  //   ),
  // ],
  //
  // logic: [
  //   String.raw`write x and (not y or x);`,
  //   new Program(
  //     new Block([
  //       new WriteStatement([
  //         new BinaryExpression(
  //           'and',
  //           new VariableExpression('x'),
  //           new BinaryExpression(
  //             'or',
  //             new UnaryExpression('not', new VariableExpression('y')),
  //             new VariableExpression('x'),
  //           ),
  //         ),
  //       ]),
  //     ]),
  //   ),
  // ],
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, done => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });

  test("throws an exception on a syntax error", done => {
    // We only need one test here that an exception is thrown.
    // Specific syntax errors are tested in the grammar test.
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});
