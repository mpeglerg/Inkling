const {
  FuncDecStmt,
  Param,
  PrimitiveType,
  ListType,
  SetType,
  DictType,
} = require('../ast')

const Numeric = new PrimitiveType('num')
const Boolean = new PrimitiveType('bool')
const Text = new PrimitiveType('text')

const standardFunctions = [
  new FuncDecStmt('display', [new Param('s', Text)]),
  new FuncDecStmt('length', [new Param('s', Text)]),
  // no idea if we can overload like this, if we can't it's gonna get messy
  new FuncDecStmt('length', [new Param('s', ListType)]),
  new FuncDecStmt('length', [new Param('s', SetType)]),
  new FuncDecStmt('length', [new Param('s', DictType)]),
  new FuncDecStmt('exit', [new Param('code', Numeric)]),
]

const stringFunctions = [
  new FuncDecStmt(
    'substring',
    [
      new Param('s', Text),
      new Param('begin', Numeric),
      new Param('end', Numeric),
    ],
    Text,
  ),
  new FuncDecStmt(
    'concat', // feels very old, maybe just use '+' for string concat
    [new Param('first', Text), new Param('second', Text)],
    Text,
  ),
  // new Func('not', [new Param('x', IntType)], IntType),
  new FuncDecStmt('charAt', [new Param('s', Numeric)], Text),
]

const mathFunctions = [
  new FuncDecStmt('abs', [new Param('n', Numeric)], Numeric),
  new FuncDecStmt('sqrt', [new Param('n', Numeric)], Numeric),
  // pi here according to casper? hmmm
  new FuncDecStmt('random', [new Param('start', Numeric), new Param('end', Numeric)], Numeric),
  new FuncDecStmt('pow', [new Param('base', Numeric), new Param('power', Numeric)]),
]

const functions = [standardFunctions, stringFunctions, mathFunctions]

functions.forEach((func) => {
  func.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f.builtin = true
  })
})

module.exports = {
  Numeric,
  Text,
  Boolean,
  standardFunctions,
  stringFunctions,
  mathFunctions,
}
