const {
  FuncDecStmt,
  Param,
  PrimitiveType,
  ListType,
  SetType,
  DictType,
} = require('../ast')

const NumType = new PrimitiveType('num')
const TextType = new PrimitiveType('TextType')
const BoolType = new PrimitiveType('bool')
const NoneType = new PrimitiveType('none')

const standardFunctions = [
  new FuncDecStmt('display', [new Param('s', TextType)]),
  new FuncDecStmt('length', [new Param('s', TextType)], NumType),
  // no idea if we can overload like this, if we can't it's gonna get messy
  new FuncDecStmt('length', [new Param('s', ListType)], NumType),
  new FuncDecStmt('length', [new Param('s', SetType)], NumType),
  new FuncDecStmt('length', [new Param('s', DictType)], NumType),
  new FuncDecStmt('exit', [new Param('code', NumType)], NumType),
]

const stringFunctions = [
  new FuncDecStmt(
    'slice',
    [
      new Param('s', TextType),
      new Param('begin', NumType),
      new Param('end', NumType),
    ],
    TextType,
  ),
  // new FuncDecStmt(
  //   'concat', // feels very old, maybe just use '+' for string concat maybe use for arrays
  //   [new Param('first', TextType), new Param('second', TextType)],
  //   TextType,
  // ),
  // new Func('not', [new Param('x', IntType)], IntType),
  new FuncDecStmt('charAt', [new Param('s', NumType)], TextType),
]

const mathFunctions = [
  new FuncDecStmt('abs', [new Param('n', NumType)], NumType),
  new FuncDecStmt('sqrt', [new Param('n', NumType)], NumType),
  // pi here according to casper? hmmm
  new FuncDecStmt(
    'random',
    [new Param('start', NumType), new Param('end', NumType)],
    NumType,
  ),
  new FuncDecStmt('pow', [
    new Param('base', NumType),
    new Param('power', NumType),
  ]),
]

const functions = [standardFunctions, stringFunctions, mathFunctions]

functions.forEach((func) => {
  func.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f.builtin = true
  })
})

module.exports = {
  NumType,
  TextType,
  BoolType,
  NoneType,
  standardFunctions,
  stringFunctions,
  mathFunctions,
}
