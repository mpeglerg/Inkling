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

const parse = require('../parser')

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
  BooleanLiteral,
} = require('../index')

const fixture = {
  declarations: [
    String.raw`y is Text "Hello World!"
    `,
    new Program(
      [
        new VarDeclaration('y', false, 'Text',
          new TextLiteral('Hello World!'))],
    ),
    String.raw`x is always Num 5
    `,
    new Program(
      new Block(
        [
          new NumericLiteral(5),
          new VarDeclaration('x', true, 'Num')],
      ),
    ),
    String.raw`x is Bool true
    `,
    new Program(
      [
        new BooleanLiteral('true'),
        new VarDeclaration('x', false, 'Bool')],
    ),
    String.raw`x is Bool false
    `,
    new Program(
      [
        new BooleanLiteral('false'),
        new VarDeclaration('x', false, 'Bool')],
    ),
  ],

  printing: [
    String.raw`display 5
    `,
    new Program(
      [
        new Print(new NumericLiteral(5)),
      ],
    ),
  ],

  functions: [
    String.raw`
    function f(x is Num, y is Num) is Num {
      gimme x + y
    }
    `,
    new Program(
      [
        new FuncDecStmt(
          'f',
          [
            new Param('x', 'Num'),
            new Param('y', 'Num'),
          ],
          'Num',
          new Block([
            new ReturnStatement(
              new BinaryExpression('+', new IdentifierExpression('x'),
                new IdentifierExpression('y')),
            ),
          ]),
        ),
      ],
    ),
    String.raw`
    x is always (x is Num, y is Num) is Num => {
      gimme x + y
    }
    `,
    new Program(
      [
        new VarDeclaration('x', true, new FuncDecStmt(
          'f',
          [
            new Param('x', 'Num'),
            new Param('y', 'Num'),
          ],
          'Num',
          new Block([
            new ReturnStatement(
              new BinaryExpression('+', new IdentifierExpression('x'),
                new IdentifierExpression('y')),
            ),
          ]),
        )),
      ],
    ),
    String.raw`
    function helloWorld() is Void {
      display "Hello world!"
    }
    `,
    new Program(
      new FuncDecStmt(
        'hellowWorld',
        [],
        'Void',
        new Block([
          new Print(
            new TextLiteral('Hello world!'),
          ),
        ]),
      ),
    ),
  ],

  math: [
    String.raw`
      result is Num 3 + 10 / 5 - 3 % 2
    `,
    new Program(
      [
        new VarDeclaration('result', false, 'Num',
          new BinaryExpression('-',
            new BinaryExpression('+', new NumericLiteral(3),
              new BinaryExpression('/', new NumericLiteral(10),
                new NumericLiteral(5))),
            new BinaryExpression('%', new NumericLiteral(3),
              new NumericLiteral(2)))),
      ],
    ),
    String.raw`
      result is Num 2^3
    `,
    new Program(
      [
        new VarDeclaration('result', false, 'Num', new PowExp(2, 3)),
      ],
    ),
    String.raw`display 3 + i
    `,
    new Program([
      new Print(new BinaryExpression('+', new NumericLiteral(3),
        new IdentifierExpression('i'))),
    ]),
    String.raw`
      result is Num 3 * (3 + 2)
    `,
    new Program(
      [
        new VarDeclaration('result', false, 'Num',
          new BinaryExpression('*', new NumericLiteral(3),
            new BinaryExpression('+', new NumericLiteral(2),
              new NumericLiteral(2)))),
      ],
    ),
  ],

  // ifElses: [
  //   String.raw`
  //   x is Num 6
  //   if (x < 10) {
  //     display x
  //   } else if (x < 20) {
  //     display x
  //   } else {
  //     display -1
  //   }
  //   `,
  //   [
  //     new VarDeclaration('x', false, 'Num', 6),
  //     new IfStmt(new BinaryExpression('<', 'x', new NumericLiteral(10)), true, false),
  //   ],
  // ],

  forLoop: [
    String.raw`
    for i in [1, 2, 3] {
      display 3 + i
    }
    `,
    new Program(
      [
        new ForLoop(new IdentifierExpression('i'), // TODO: ask toal re: the 'i' should be wrapped in a IdentifierExpression I think but the ast wants this. due to difference between calling an id from VarExp and from elsewhere
          new ListExpression([
            new NumericLiteral(1),
            new NumericLiteral(2),
            new NumericLiteral(3)]),
          new Block([
            new Print(new BinaryExpression('+', new NumericLiteral(3),
              new IdentifierExpression('i'))),
          ])),
      ],
    ),
  ],

}

describe('The parser', () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, (done) => {
      expect(parse(source)).toEqual(expected)
      done()
    })
  })

  test('throws an exception on a syntax error', (done) => {
    // We only need one test here that an exception is thrown.
    // Specific syntax errors are tested in the grammar test.
    expect(() => parse('as$df^&%*$&')).toThrow()
    done()
  })
})
