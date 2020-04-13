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
const parse = require('../parser');
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
  KeyValuePair,
  DictExpression,
  SetExpression,
  PrimitiveType,
  ListType,
  SetType,
  DictType,
  Literal,
  None,
} = require('../index');

const fixture = {
  textDeclarations: [
    String.raw`y is Text "Hello World!"
    `,
    new Program([
      new VarDeclaration('y', false, new PrimitiveType('Text'), new Literal('Hello World!')),
    ]),
  ],
  constNumDeclarations: [
    String.raw`x is always Num 5
    `,
    new Program([new VarDeclaration('x', true, new PrimitiveType('Num'), new Literal(5))]),
  ],
  boolTrueDeclarations: [
    String.raw`x is Bool true
    `,
    new Program([new VarDeclaration('x', false, new PrimitiveType('Bool'), new Literal('true'))]),
  ],
  boolFalseDeclarations: [
    String.raw`x is Bool false
    `,
    new Program([new VarDeclaration('x', false, new PrimitiveType('Bool'), new Literal('false'))]),
  ],
  noneDeclarations: [
    String.raw`x is Num none
    x is 5
    `,
    new Program([
      new VarDeclaration('x', false, new PrimitiveType('Num'), new None()),
      new Assignment(new IdentifierExpression('x'), new Literal(5)),
    ]),
  ],
  dictDeclarations: [
    String.raw`ageDictionary is Dict<Text, Num> {"Sam": 21, "Talia": 20}
    `,
    new Program([
      new VarDeclaration(
        'ageDictionary',
        false,
        new DictType(new PrimitiveType('Text'), new PrimitiveType('Num')),
        new DictExpression([
          new KeyValuePair(new Literal('Sam'), new Literal(21)),
          new KeyValuePair(new Literal('Talia'), new Literal(20)),
        ])
      ),
    ]),
  ],
  setDeclarations: [
    String.raw`aSetOfNums is Set<Num> {1, 2}
   `,
    new Program([
      new VarDeclaration(
        'aSetOfNums',
        false,
        new SetType(new PrimitiveType('Num')),
        new SetExpression([new Literal(1), new Literal(2)])
      ),
    ]),
  ],

  listDeclarations: [
    String.raw`ourList is List<Text> ["this", "a", "list"]
    `,
    new Program([
      new VarDeclaration(
        'ourList',
        false,
        new ListType(new PrimitiveType('Text')),
        new ListExpression([new Literal('this'), new Literal('a'), new Literal('list')])
      ),
    ]),
  ],

  forLoop: [
    String.raw`
    for i in [1, 2, 3] {
      display 3 + i
    }
    `,
    new Program([
      new ForLoop(
        'i',
        new ListExpression([new Literal(1), new Literal(2), new Literal(3)]),
        new Block([
          new Print(new BinaryExpression('+', new Literal(3), new IdentifierExpression('i'))),
        ])
      ),
    ]),
  ],
  printing: [
    String.raw`display 5
    `,
    new Program([new Print(new Literal(5))]),
  ],

  functions: [
    String.raw`
    function f(x is Num, y is Num) is Num {
      gimme x + y
    }
    `,
    new Program([
      new FuncDecStmt(
        'f',
        [new Param('x', new PrimitiveType('Num')), new Param('y', new PrimitiveType('Num'))],
        new PrimitiveType('Num'),
        new Block([
          new ReturnStatement(
            new BinaryExpression('+', new IdentifierExpression('x'), new IdentifierExpression('y'))
          ),
        ])
      ),
    ]),
  ],
  helloWorld: [
    String.raw`
    function helloWorld() is Void {
      display "Hello world!"
    }
    `,
    new Program([
      new FuncDecStmt(
        'helloWorld',
        [],
        'Void',
        new Block([new Print(new Literal('Hello world!'))])
      ),
    ]),
  ],

  arrowFunctions: [
    String.raw`
    f is always (x is Num, y is Num) is Num => {
      gimme x + y
    }
    `,
    new Program([
      new FuncDecStmt(
        'f',
        [new Param('x', new PrimitiveType('Num')), new Param('y', new PrimitiveType('Num'))],
        new PrimitiveType('Num'),
        new Block([
          new ReturnStatement(
            new BinaryExpression('+', new IdentifierExpression('x'), new IdentifierExpression('y'))
          ),
        ])
      ),
    ]),
  ],

  while: [
    String.raw`
      i is Num 10
      while(i > 0) {
        --i
    }
    `,
    new Program([
      new VarDeclaration('i', false, new PrimitiveType('Num'), new Literal(10)),
      new WhileLoop(
        new BinaryExpression('>', new IdentifierExpression('i'), new Literal(0)),
        new Block([new PrefixExpression('--', new IdentifierExpression('i'))])
      ),
    ]),
  ],

  addDivideSubtractMod: [
    String.raw`
    function f(x is Num, y is Num) is Num {
      gimme x + y
    }
    `,
    new Program([
      new FuncDecStmt(
        'f',
        [new Param('x', new PrimitiveType('Num')), new Param('y', new PrimitiveType('Num'))],
        new PrimitiveType('Num'),
        new Block([
          new ReturnStatement(
            new BinaryExpression('+', new IdentifierExpression('x'), new IdentifierExpression('y'))
          ),
        ])
      ),
    ]),
  ],
  math: [
    String.raw`
      result is Num 3 + 10 / 5 - 3 % 2
    `,
    new Program([
      new VarDeclaration(
        'result',
        false,
        new PrimitiveType('Num'),
        new BinaryExpression(
          '-',
          new BinaryExpression(
            '+',
            new Literal(3),
            new BinaryExpression('/', new Literal(10), new Literal(5))
          ),
          new BinaryExpression('%', new Literal(3), new Literal(2))
        )
      ),
    ]),
  ],
  pow: [
    String.raw`
      result is Num 2^3
    `,
    new Program([
      new VarDeclaration(
        'result',
        false,
        new PrimitiveType('Num'),
        new PowExp(new Literal(2), new Literal(3))
      ),
    ]),
  ],
  multiplyParensPlus: [
    String.raw`
      result is Num 3 * (3 + 2)
    `,
    new Program([
      new VarDeclaration(
        'result',
        false,
        new PrimitiveType('Num'),
        new BinaryExpression(
          '*',
          new Literal(3),
          new BinaryExpression('+', new Literal(3), new Literal(2))
        )
      ),
    ]),
  ],

  ifElseIfElse: [
    String.raw`
    x is Num 6
    if (x < 10) {
      display x
    } else if (x < 20) {
      display 1
    } else {
      display -1
    }
    `,
    new Program([
      new VarDeclaration('x', false, new PrimitiveType('Num'), new Literal(6)),
      new IfStmt(
        [
          new BinaryExpression('<', new IdentifierExpression('x'), new Literal(10)),
          new BinaryExpression('<', new IdentifierExpression('x'), new Literal(20)),
        ],
        [
          new Block([new Print(new IdentifierExpression('x'))]),
          new Block([new Print(new Literal(1))]),
        ],
        new Block([new Print(new PrefixExpression('-', new Literal(1)))])
      ),
    ]),
  ],

  ifElseIf: [
    String.raw`
    x is Num 6
    if (x < 10) {
      display x
    } else if (x < 20) {
      display 1
    }
    `,
    new Program([
      new VarDeclaration('x', false, new PrimitiveType('Num'), new Literal(6)),
      new IfStmt(
        [
          new BinaryExpression('<', new IdentifierExpression('x'), new Literal(10)),
          new BinaryExpression('<', new IdentifierExpression('x'), new Literal(20)),
        ],
        [
          new Block([new Print(new IdentifierExpression('x'))]),
          new Block([new Print(new Literal(1))]),
        ],
        null
      ),
    ]),
  ],

  ifElse: [
    String.raw`
    x is Num 6
    if (x < 10) {
      display x
    } else {
      display -1
    }
    `,
    new Program([
      new VarDeclaration('x', false, new PrimitiveType('Num'), new Literal(6)),
      new IfStmt(
        [new BinaryExpression('<', new IdentifierExpression('x'), new Literal(10))],
        [new Block([new Print(new IdentifierExpression('x'))])],
        new Block([new Print(new PrefixExpression('-', new Literal(1)))])
      ),
    ]),
  ],

  logic: [
    String.raw`display x and (!y or x)
    `,
    new Program([
      new Print(
        new BinaryExpression(
          'and',
          new IdentifierExpression('x'),
          new BinaryExpression(
            'or',
            new PrefixExpression('!', new IdentifierExpression('y')),
            new IdentifierExpression('x')
          )
        )
      ),
    ]),
  ],

  call: [
    String.raw`collatz(420)++
    `,
    new Program([
      new PostfixExpression(
        new IdentifierExpression(new Call(new IdentifierExpression('collatz'), [new Literal(420)])),
        '++'
      ),
    ]),
  ],

  ternary: [
    String.raw`x < 0 ? -1 : 1
    `,
    new Program([
      new IfStmt(
        new BinaryExpression('<', new IdentifierExpression('x'), new Literal(0)),
        new PrefixExpression('-', new Literal(1)),
        new Literal(1)
      ),
    ]),
  ],

  fieldVarExp: [
    // Similar to Call it wants the FieldVarExp to be wrapped in a IdentifierExpression
    String.raw`inkTeam.sam
    `,
    new Program([
      new IdentifierExpression(new FieldVarExp(new IdentifierExpression('inkTeam'), 'sam')),
    ]),
  ],

  subscriptedVarExp: [
    // just like FieldVarExp it wants the SubscriptedVarExp to
    // be wrapped in a IdentifierExpression
    String.raw`inkTeam[420]
    `,
    new Program([
      new IdentifierExpression(
        new SubscriptedVarExp(new IdentifierExpression('inkTeam'), new Literal(420))
      ),
    ]),
  ],

  assign: [
    String.raw`sam is "kewl"
    `,
    new Program([new Assignment(new IdentifierExpression('sam'), new Literal('kewl'))]),
  ],
};

describe('The parser', () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, done => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });
  test('throws an exception on a syntax error', done => {
    // We only need one test here that an exception is thrown.
    // Specific syntax errors are tested in the grammar test.
    expect(() => parse('as$df^&%*$&')).toThrow();
    done();
  });
});
