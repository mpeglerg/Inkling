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
  // Assignment,
  // we have assignment parsing functions but the classes don't match
  // I think we don't need Assignment class
  VarDeclaration,
  Print,
  ReturnStatement,
  ForLoop,
  IfStmt,
  FuncDecStmt,
  WhileLoop,
  FieldVarExp,
  SubscriptedVarExp,
  Param,
  Call,
  BinaryExpression,
  IdentifierExpression,
  ListExpression,
  KeyValueExpression,
  DictExpression,
  SetExpression,
  PowExp,
  PrefixExpression,
  PostfixExpression,
  // Paren,  // not needed I think
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
      new Block([
        new TextLiteral('"Hello World!"'),
        new VarDeclaration('y', false, 'Text')]),
    ),
    String.raw`x is always Num 5
    `,
    new Program(
      new Block(
        [
          new NumericLiteral('5'),
          new VarDeclaration('x', true, 'Num')],
      ),
    ),
    String.raw`x is Bool true
    `, // false?
    new Program(
      new Block(
        [
          new BooleanLiteral('true'),
          new VarDeclaration('x', true, 'Bool')],
      ),
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
  ],

  // whiles: [
  //   String.raw`while false loop x = 3; end;`,
  //   new Program(
  //     new Block([
  //       new WhileStatement(
  //         new BooleanLiteral(false),
  //         new Block([
  //           new AssignmentStatement(new VariableExpression('x'),
  //             new IntegerLiteral('3'))]),
  //       ),
  //     ]),
  //   ),
  // ],
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
