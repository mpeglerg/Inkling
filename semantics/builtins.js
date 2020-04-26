const {
  FuncDecStmt,
  Param,
  PrimitiveType,
  NumType,
  BoolType,
  TextType,
  ListType,
  SetType,
  DictType,
} = require("../ast");

const NoneType = new PrimitiveType("none");

const standardFunctions = [
  new FuncDecStmt("exitProcess", [new Param("code", NumType)], NumType),
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
  new FuncDecStmt(
    "charAt",
    [new Param("s", TextType), new Param("i", NumType)],
    TextType
  ),
];

const mathFunctions = [
  new FuncDecStmt("abs", [new Param("n", NumType)], NumType),
  new FuncDecStmt("sqrt", [new Param("n", NumType)], NumType),
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
  // need to inherit type of list from list that is calling, don't think I did it right here but...
  new FuncDecStmt(
    "add",
    [new Param("id", this.type)],
    [new Param("value", this.type)],
    ListType
  ),
  new FuncDecStmt("prepend", [new Param("value", this.type)], ListType),
  new FuncDecStmt(
    "insert",
    [new Param("index", NumType), new Param("value", this.type)],
    ListType
  ),
  new FuncDecStmt("remove", [new Param("index", NumType)], ListType),
  new FuncDecStmt("length", [new Param("s", ListType)], NumType),
];

const setFunctions = [
  new FuncDecStmt("add", [new Param("value", this.type)], SetType),
  new FuncDecStmt("remove", [new Param("index", NumType)], SetType),
  new FuncDecStmt("length", [new Param("s", SetType)], NumType),
];

// keyType and valueType are made up, may be something we need to add for these functions
const dictFunctions = [
  new FuncDecStmt(
    "add",
    [new Param("key", this.keyType), new Param("value", this.valueType)],
    DictType
  ),
  new FuncDecStmt("remove", [new Param("key", this.keyType)], DictType),
  new FuncDecStmt(
    "update",
    [new Param("key", this.keyType), new Param("value", this.valueType)],
    DictType
  ),
  new FuncDecStmt("getValue", [new Param("key", this.keyType)], this.valueType),
  new FuncDecStmt("keys", [], new ListType(this.keyType)),
  new FuncDecStmt("values", [], new ListType(this.valueType)),
];

const functions = [
  ...standardFunctions,
  ...textFunctions,
  ...mathFunctions,
  ...listFunctions,
  ...setFunctions,
  ...dictFunctions,
];

functions.forEach((func) => {
  // eslint-disable-next-line no-param-reassign
  func.builtin = true;
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
