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
  VarDeclaration,
  Print,
  ReturnStatement,
  IfStmt,
  ForLoop, //SAM
  FuncDecStmt,
  WhileLoop,  //MAYA
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
  printStatements: [
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
      new FuncDecStmt(
        'f',
        [
          new Param('x', 'Num'),
          new Param('y', 'Num'),
        ],
        'Num',
        new Block([new ReturnStatement(new BinaryExpression('+', 'x', 'y'))]),
      ),
    ),
  ],
  math: [
    String.raw`
      result is Num 3 + 5 / 5 - 3 
    `,

  ],
  ifelses: [
    String.raw`if(x < 10)
    `,
    [
      new VarDeclaration('x', false, 'Num', 6),
      new IfStmt('x < 10', true, false),
    ],
  ],
  identifierExpression: [
    String.raw`field is Bool`,
    [
      new IdentifierExpression('field'),

    ],
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