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
  Program, // done
  Block, // done
  Assignment,
  VarDeclaration, // done
  Print, // done
  ReturnStatement, // done
  IfStmt, // done -- need to test ternaries
  ForLoop, // Cooper did
  FuncDecStmt, // done
  WhileLoop, // done
  FieldVarExp,
  IdentifierExpression, // done
  SubscriptedVarExp,
  Param, // done
  Call,
  BinaryExpression, // done
  PowExp, // Veda working on
  PrefixExpression, // working
  PostfixExpression, // in Call test (call test not done yet)
  ListExpression, // done
  KeyValuePair, // done
  DictExpression, // done
  SetExpression, // done
  ListType, // done
  SetType, // done
  DictType, // done
  NumericLiteral, // done
  TextLiteral, // done
  BooleanLiteral, // done
} = require('../index')
  
const fixture = {
  stringDeclarations: [
    String.raw`y is Text "Hello World!"
    `,
    new Program([
      new VarDeclaration('y', false, 'Text', new TextLiteral('Hello World!')),
    ]),
  ],
  constNumDeclarations: [
    String.raw`x is always Num 5
    `,
    new Program([
      new VarDeclaration('x', true, 'Num', new NumericLiteral(5)),
    ]),
  ],
  boolTrueDeclarations: [
    String.raw`x is Bool true
    `,
    new Program([
      new VarDeclaration('x', false, 'Bool', new BooleanLiteral('true')),
    ]),
  ],
  boolFalseDeclarations: [
    String.raw`x is Bool false
    `,
    new Program([
      new VarDeclaration('x', false, 'Bool', new BooleanLiteral('false')),
    ]),
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
            new TextLiteral('Sam'),
            new NumericLiteral(21),
          ),
          new KeyValuePair(
            new TextLiteral('Talia'),
            new NumericLiteral(20),
          ),
        ]),
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
        new SetType('Num'),
        new SetExpression([new NumericLiteral(1), new NumericLiteral(2)]),
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
        new ListType('Text'),
        new ListExpression([
          new TextLiteral('this'),
          new TextLiteral('a'),
          new TextLiteral('list'),
        ]),
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
        'i', // the 'i' should be wrapped in a IdentifierExpression iIthink but the ast wants this
        new ListExpression([
          new NumericLiteral(1),
          new NumericLiteral(2),
          new NumericLiteral(3),
        ]),
        new Block([
          new Print(
            new BinaryExpression(
              '+',
              new NumericLiteral(3),
              new IdentifierExpression('i'),
            ),
          ),
        ]),
      ),
    ]),
  ],
  printing: [
    String.raw`display 5
    `,
    new Program([new Print(new NumericLiteral(5))]),
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
  ],
  hellowWorld: [
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
        new Block([
          new Print(
            new TextLiteral('Hello world!'),
          ),
        ]),
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
      new FuncDecStmt( // i feel like there should be a return node here but tests pass..
        'f', // also should this have a variable declaration or not, also return node is in block
        [new Param('x', 'Num'), new Param('y', 'Num')],
        'Num',
        new Block([
          new ReturnStatement(
            new BinaryExpression('+', new IdentifierExpression('x'),
              new IdentifierExpression('y')),
          ),
        ]),
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
      new VarDeclaration('i', false, 'Num', new NumericLiteral(10)),
      new WhileLoop(
        new BinaryExpression(
          '>',
          new IdentifierExpression('i'),
          new NumericLiteral(0),
        ),
        new Block(
          [new PrefixExpression('--', new IdentifierExpression('i'))],
        ),
      ),
    ]),
  ],

  addDivideSubtractMod: [
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
      new VarDeclaration('result', false, 'Num',
        new BinaryExpression('-',
          new BinaryExpression('+', new NumericLiteral(3),
            new BinaryExpression('/', new NumericLiteral(10),
              new NumericLiteral(5))),
          new BinaryExpression('%', new NumericLiteral(3),
            new NumericLiteral(2)))),
    ]),
  ],
  pow: [
    String.raw`
      result is Num 2^3
    `,
    new Program([
      new VarDeclaration('result', false, 'Num',
        new PowExp(
          new NumericLiteral(2),
          new NumericLiteral(3),
        )),
    ]),
  ],
  multiplyParensPlus: [
    String.raw`
      result is Num 3 * (3 + 2)
    `,
    new Program(
      [
        new VarDeclaration('result', false, 'Num',
          new BinaryExpression('*', new NumericLiteral(3),
            new BinaryExpression('+', new NumericLiteral(3), new NumericLiteral(2)))),
      ],
    ),
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
      new VarDeclaration('x', false, 'Num', new NumericLiteral(6)),
      new IfStmt(
        [
          new BinaryExpression('<', new IdentifierExpression('x'), new NumericLiteral(10)),
          new BinaryExpression('<', new IdentifierExpression('x'), new NumericLiteral(20))],
        [
          new Block([new Print(new IdentifierExpression('x'))]),
          new Block([new Print(new NumericLiteral(1))])],
        new Block([
          new Print(
            new PrefixExpression('-', new NumericLiteral(1)),
          ),
        ]),
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
      new VarDeclaration('x', false, 'Num', new NumericLiteral(6)),
      new IfStmt(
        [
          new BinaryExpression('<', new IdentifierExpression('x'), new NumericLiteral(10)),
          new BinaryExpression('<', new IdentifierExpression('x'), new NumericLiteral(20))],
        [
          new Block([new Print(new IdentifierExpression('x'))]),
          new Block([new Print(new NumericLiteral(1))])],
        null,
      ),
    ]),
  ],
v
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
      new VarDeclaration('x', false, 'Num', new NumericLiteral(6)),
      new IfStmt(
        [new BinaryExpression('<', new IdentifierExpression('x'), new NumericLiteral(10))],
        [new Block([new Print(new IdentifierExpression('x'))])],
        new Block([
          new Print(
            new PrefixExpression('-', new NumericLiteral(1)),
          ),
        ]),
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
        '++',
      ),
    ]),
  ],

  ternary: [
    String.raw`x < 0 ? -1 : 1
    `,
    new Program([
      new IfStmt(
        new BinaryExpression('<',
          new IdentifierExpression('x'),
          new NumericLiteral(0)),
        new PrefixExpression('-',
          new NumericLiteral(1)),
        new NumericLiteral(1),
      ),
    ]),
  ],

  fieldVarExp: [ // Similar to Call it wants the FieldVarExp to be wrapped in a IdentifierExpression
    String.raw`inkTeam.sam
    `,
    new Program([
      new FieldVarExp(
        new IdentifierExpression('inkTeam'),
        'sam', // should the field be an IdentifierExpression???
      ),
    ]),
  ],

  subscriptedVarExp: [ // just like FieldVarExp it wants the SubscriptedVarExp to
    // be wrapped in a IdentifierExpression
    String.raw`inkTeam[420]
    `,
    new Program([
      new SubscriptedVarExp(
        new IdentifierExpression('inkTeam'),
        new NumericLiteral(420),
      ),
    ]),
  ],

  assign: [
    String.raw`sam is "kewl"
    `,
    new Program([
      new Assignment(
        new IdentifierExpression('sam'),
        new TextLiteral('kewl'),
      ),
    ]),
  ],
}

describe('The parser', () => {
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
