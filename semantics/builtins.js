const { FuncDecStmt, Param, PrimitiveType } = require("../ast");

ListType, SetType, DictType, NumericLiteral, TextLiteral, BooleanLiteral;

const NumType = new PrimitiveType("num");
const TextType = new PrimitiveType("text");
const BoolType = new PrimitiveType("bool");
const VoidType = new PrimitiveType("void");

const standardFunctions = [
  new FuncDecStmt("display", [new Param("s", TextType)]),
  new FuncDecStmt("size", [new Param("s", TextType)], IntType),
  new FuncDecStmt(
    "subtext",
    [
      new Param("s", TextType),
      new Param("first", IntType),
      new Param("n", IntType)
    ],
    StringType
  ),
  new Func(
    "concat",
    [new Param("s", TextType), new Param("t", TextType)],
    TextType
  ),
  new Func("not", [new Param("x", IntType)], IntType),
  new Func("exit", [new Param("code", IntType)])
];

// from Casper v
// const StringFunctions = [
//   new Func(
//     StringType, "substring", [
//       new Param(StringType, "s"),
//       new Param(NumType, "start"),
//       new Param(NumType, "end"),
//     ],
//   ),
//   new Func(StringType, "charAt", [
//     new Param(StringType, "s"),
//     new Param(NumType, "index"),
//   ]),
//   new Func(NumType, "ord", [new Param(StringType, "c")]),
// ];

// const MathFunctions = [
//   new Func("abs", NumType , [new Param("n", NumType )]),
//   new Func(NumType, "sqrt", [new Param(NumType, "n")]),
//   new Func(NumType, "pi", []),
//   new Func(NumType, "random", [
//     new Param(NumType, "start"),
//     new Param(NumType, "end"),
//   ]),
//   new Func(NumType, "pow", [new Param(NumType, "x"), new Param(NumType, "y")]),
// ];

/* eslint-disable no-param-reassign */
standardFunctions.forEach(f => {
  f.builtin = true;
});
/* eslint-enable no-param-reassign */

module.exports = {
  NumType,
  TextType,
  NilType,
  DictType,
  NumericLiteral,
  TextLiteral,
  BooleanLiteral,
  standardFunctions
};
