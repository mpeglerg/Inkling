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
  KeyValuePair,
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
  stringDeclarations: [
    String.raw`y is Text "Hello World!"
    `,
    new Program([
        new VarDeclaration('y', false, 'Text', new TextLiteral('Hello World!'))
      ]
    )
  ],
  constNumDeclarations: [
    String.raw`x is always Num 5
    `,
    new Program([
        new VarDeclaration('x', true, 'Num', new NumericLiteral(5)),
    ])
  ],
  boolTrueDeclarations: [
    String.raw`x is Bool true
    `,
    new Program([
        new VarDeclaration('x', false, 'Bool', new BooleanLiteral('true'))
    ])
  ],
  boolFalseDeclarations: [
    String.raw`x is Bool false
    `,
    new Program([
        new VarDeclaration('x', false, 'Bool', new BooleanLiteral('false'))
    ])
  ],
  dictDeclarations: [
    String.raw`ageDictionary is Dict<Text, Num> {"Sam": 21, "Talia":20}
    `,
    new Program([
      new VarDeclaration(
        'ageDictionary',
        false,
        new DictType('Text', 'Num'),
        new DictExpression([
          new KeyValuePair(
            new TextLiteral("Sam"),
            new NumericLiteral(21)
          ),
          new KeyValuePair(
            new TextLiteral("Talia"),
            new NumericLiteral(20)
          )
        ])
      )
    ])
  ],
  setDeclarations: [
    String.raw`aSetOfNums is Set<Num> {1, 2}
   `,
     new Program([
       new VarDeclaration(
         "aSetOfNums",
         false,
         new SetType("Num"),
         new SetExpression([new NumericLiteral(1), new NumericLiteral(2)])
       )
     ])
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
      [
        new FuncDecStmt(
          'f',
          [
            new Param('x', 'Num'),
            new Param('y', 'Num'),
          ],
          'Num',
          new Block([
            new ReturnStatement(new BinaryExpression('+', new IdentifierExpression('x'), new IdentifierExpression('y'))),
          ]),
        ),
      ],
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
            new IdentifierExpression('x'),
          ),
        ),
      ),
    ]),
  ],

  call: [
    String.raw`collatz(420)++
    `,
    new Program([
      new PostfixExpression(
        new Call(new IdentifierExpression('collatz'), [new NumericLiteral(420)]),
        '++')
    ])
  ],

  whileLoop: [
   String.raw`
     i is Num 10
     while(i > 0) {
       --i
   }
   `,
   new Program([
     new VarDeclaration(
       "i",
       false,
       "Num",
       new NumericLiteral(10)
     ),
     new WhileLoop(
       new BinaryExpression(
         ">",
         new IdentifierExpression("i"),
        new NumericLiteral(0)
        ),
       new Block([new PrefixExpression("--", new IdentifierExpression("i"))])
    ),
   ])
 ],

 forLoop: [
    String.raw`
    for i in [1, 2, 3] {
      display 3 + i
    }
    `,
    new Program(
      [
        new ForLoop(
          'i', // the 'i' should be wrapped in a IdentifierExpression iIthink but the ast wants this
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
