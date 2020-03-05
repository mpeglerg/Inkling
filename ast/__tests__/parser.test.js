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
  Program, //done
  Block, //done
  Assignment,
  VarDeclaration, //done
  Print, //done
  ReturnStatement, //done
  IfStmt, //done
  ForLoop,
  FuncDecStmt, //done
  WhileLoop,
  FieldVarExp,
  IdentifierExpression, //Veda
  SubscriptedVarExp,
  Param, //done
  Call,
  BinaryExpression, //done
  PowExp, //veda
  PrefixExpression,
  PostfixExpression,
  ListExpression,
  KeyValueExpression,
  DictExpression,
  SetExpression,
  ListType,
  SetType,
  DictType,
  NumericLiteral, //done
  TextLiteral,
  BooleanLiteral //done
} = require("../index");
const fixture = {
  declarations: [
    String.raw`y is Text "Hello World!"
    `,
    new Program([
      new VarDeclaration("y", false, "Text", new TextLiteral("Hello World!"))
    ]),
    String.raw`x is always Num 5
    `,
    new Program(
      new Block([new NumericLiteral(5), new VarDeclaration("x", true, "Num")])
    ),
    String.raw`x is Bool true
    `,
    new Program([
      new BooleanLiteral("true"),
      new VarDeclaration("x", false, "Bool")
    ]),
    String.raw`x is Bool false
    `,
    new Program([
      new BooleanLiteral("false"),
      new VarDeclaration("x", false, "Bool")
    ])
  ],
  printStatements: [
    String.raw`display 5
    `,
    new Program([new Print(new NumericLiteral(5))])
  ],
  functions: [
    String.raw`
    function f(x is Num, y is Num) is Num {
      gimme x + y
    }
    `,
    new Program([
      new FuncDecStmt(
        "f",
        [new Param("x", "Num"), new Param("y", "Num")],
        "Num",
        new Block([
          new ReturnStatement(
            new BinaryExpression(
              "+",
              new IdentifierExpression("x"),
              new IdentifierExpression("y")
            )
          )
        ])
      )
    ])
  ],
  math: [
    String.raw`
      result is Num 3 + 10 / 5 - 3 % 2
    `,
    new Program([
      new VarDeclaration(
        "result",
        false,
        "Num",
        new BinaryExpression(
          "-",
          new BinaryExpression(
            "+",
            new NumericLiteral(3),
            new BinaryExpression(
              "/",
              new NumericLiteral(10),
              new NumericLiteral(5)
            )
          ),
          new BinaryExpression(
            "%",
            new NumericLiteral(3),
            new NumericLiteral(2)
          )
        )
      )
    ])
  ],
  whiles: [
    String.raw`while (true) { 
      x is Num 3 
    }
    `,
    new Program(
      new Block([
        new WhileLoop(
          new IdentifierExpression(new BooleanLiteral(true)),
          new Block([
            new Assignment(
              new IdentifierExpression("x"),
              new NumericLiteral("3")
            )
          ])
        )
      ])
    )
  ]

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
