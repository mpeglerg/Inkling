const {
  FuncDecStmt,
  Param,
  PrimitiveType,
  ListType,
  SetType,
  DictType,
} = require('../ast')

const Num = new PrimitiveType('num')
const Bool = new PrimitiveType('bool')
const Text = new PrimitiveType('text')

const standardFunctions = [
  new FuncDecStmt('display', [new Param('s', Text)], 'Void'),
  new FuncDecStmt('length', [new Param('s', Text)], 'Void'),
  // no idea if we can overload like this, if we can't it's gonna get messy
  new FuncDecStmt('length', [new Param('s', ListType)], Num),
  new FuncDecStmt('length', [new Param('s', SetType)], Num),
  new FuncDecStmt('length', [new Param('s', DictType)], Num),
  new FuncDecStmt('exit', [new Param('code', Num)], Num),
]

const stringFunctions = [
  new FuncDecStmt(
    'slice',
    [
      new Param('s', Text),
      new Param('begin', Num),
      new Param('end', Num),
    ],
    Text,
  ),
  // new FuncDecStmt(
  //   'concat', // feels very old, maybe just use '+' for string concat maybe use for arrays
  //   [new Param('first', Text), new Param('second', Text)],
  //   Text,
  // ),
  // new Func('not', [new Param('x', IntType)], IntType),
  new FuncDecStmt('charAt', [new Param('s', Num)], Text),
]

const mathFunctions = [
  new FuncDecStmt('abs', [new Param('n', Num)], Num),
  new FuncDecStmt('sqrt', [new Param('n', Num)], Num),
  // pi here according to casper? hmmm
  new FuncDecStmt('random', [new Param('start', Num), new Param('end', Num)], Num),
  new FuncDecStmt('pow', [new Param('base', Num), new Param('power', Num)], Num),
]

const listFunctions = [
  // TODO: add(value)
  // need to inherit type of list from list that is calling, don't think I did it right here but...
  new FuncDecStmt('add', [new Param('value', this.type)], ListType),
  // TODO: prepend(value)
  new FuncDecStmt('prepend', [new Param('value', this.type)], ListType),
  // TODO: insert(index, value)
  new FuncDecStmt('insert', [new Param('index', Num), new Param('value', this.type)], ListType),
  // TODO: remove(index)
  new FuncDecStmt('remove', [new Param('index', Num)], ListType),
]

// perhaps need/want more functions, this is just based on what casper was planning on implementing
const setFunctions = [
  // TODO: add(value)
  new FuncDecStmt('add', [new Param('value', this.type)], SetType),
  // TODO: remove(index)
  new FuncDecStmt('remove', [new Param('index', Num)], SetType),
]

// TODO: keyType and valueType are made up, may be something we need to add for these functions
const dictFunctions = [
  // TODO: add(key, value)
  new FuncDecStmt('add', [new Param('key', this.keyType), new Param('value', this.valueType)], DictType),
  // TODO: remove(key)
  new FuncDecStmt('remove', [new Param('key', this.keyType)], DictType),
  // TODO: update(key, value)
  new FuncDecStmt('update', [new Param('key', this.keyType), new Param('value', this.valueType)], DictType),
  // TODO: getValue(key)
  new FuncDecStmt('getValue', [new Param('key', this.keyType)], this.valueType),
  // TODO: keys()
  new FuncDecStmt('keys', [], new ListType(this.keyType)),
  // TODO: values()
  new FuncDecStmt('values', [], new ListType(this.valueType)),
  // TODO: items()
]

const functions = [standardFunctions, stringFunctions, mathFunctions, listFunctions, setFunctions, dictFunctions]

functions.forEach((func) => {
  func.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f.builtin = true
  })
})

module.exports = {
  Num,
  Text,
  Bool,
  standardFunctions,
  stringFunctions,
  mathFunctions,
  listFunctions,
  setFunctions,
  dictFunctions,
}
