const {
  FuncDecStmt,
  Param,
  PrimitiveType,
  ListType,
  SetType,
  DictType,
} = require("../ast");

const NumType = new PrimitiveType("Num");
const TextType = new PrimitiveType("Text");
const BoolType = new PrimitiveType("bool");
const NoneType = new PrimitiveType("none");

const standardFunctions = [
  new FuncDecStmt("display", [new Param("s", TextType)]),
  new FuncDecStmt("exit", [new Param("code", NumType)], NumType),
];

const textFunctions = [
  new FuncDecStmt(
    "slice",
    [
      new Param("s", TextType),
      new Param("begin", NumType),
      new Param("end", NumType),
    ],
    TextType
  ),
  new FuncDecStmt("length", [new Param("s", TextType)], NumType),
  new FuncDecStmt("charAt", [new Param("s", NumType)], TextType),
];

const mathFunctions = [
  new FuncDecStmt("abs", [new Param("n", NumType)], NumType),
  new FuncDecStmt("sqrt", [new Param("n", NumType)], NumType),
  // pi here according to casper? hmmm
  new FuncDecStmt(
    "random",
    [new Param("start", NumType), new Param("end", NumType)],
    NumType
  ),
  new FuncDecStmt(
    "pow",
    [new Param("base", NumType), new Param("power", NumType)],
    NumType
  ),
];

const listFunctions = [
  // TODO: add(value)
  // need to inherit type of list from list that is calling, don't think I did it right here but...
  new FuncDecStmt("add", [new Param("value", this.type)], ListType),
  // TODO: prepend(value)
  new FuncDecStmt("prepend", [new Param("value", this.type)], ListType),
  // TODO: insert(index, value)
  new FuncDecStmt(
    "insert",
    [new Param("index", NumType), new Param("value", this.type)],
    ListType
  ),
  // TODO: remove(index)
  new FuncDecStmt("remove", [new Param("index", NumType)], ListType),
  new FuncDecStmt("length", [new Param("s", ListType)], NumType),
];

// perhaps need/want more functions, this is just based on what casper was planning on implementing
const setFunctions = [
  // TODO: add(value)
  new FuncDecStmt("add", [new Param("value", this.type)], SetType),
  // TODO: remove(index)
  new FuncDecStmt("remove", [new Param("index", NumType)], SetType),
  new FuncDecStmt("length", [new Param("s", SetType)], NumType),
];

// TODO: keyType and valueType are made up, may be something we need to add for these functions
const dictFunctions = [
  // TODO: add(key, value)
  new FuncDecStmt(
    "add",
    [new Param("key", this.keyType), new Param("value", this.valueType)],
    DictType
  ),
  // TODO: remove(key)
  new FuncDecStmt("remove", [new Param("key", this.keyType)], DictType),
  // TODO: update(key, value)
  new FuncDecStmt(
    "update",
    [new Param("key", this.keyType), new Param("value", this.valueType)],
    DictType
  ),
  // TODO: getValue(key)
  new FuncDecStmt("getValue", [new Param("key", this.keyType)], this.valueType),
  // TODO: keys()
  new FuncDecStmt("keys", [], new ListType(this.keyType)),
  // TODO: values()
  new FuncDecStmt("values", [], new ListType(this.valueType)),
  // TODO: items()
];

const functions = [
  standardFunctions,
  textFunctions,
  mathFunctions,
  listFunctions,
  setFunctions,
  dictFunctions,
];

functions.forEach((func) => {
  func.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f.builtin = true;
  });
});

module.exports = {
  NumType,
  TextType,
  BoolType,
  NoneType,
  standardFunctions,
  textFunctions,
  mathFunctions,
  listFunctions,
  setFunctions,
  dictFunctions,
};
