const util = require("util");
const deepEqual = require("deep-equal");
const {
  ListType,
  NumType,
  BoolType,
  TextType,
  SetType,
  DictType,
  FuncDecStmt,
  IdentifierExpression,
} = require("../ast");

const { NoneType } = require("./builtins");

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  isIterable(type) {
    doCheck(
      type.constructor === ListType ||
        type.constructor === SetType ||
        type.constructor === DictType ||
        type === TextType,
      "Not a list, set, dic or text"
    );
  },

  isListOrDict(expression) {
    doCheck(
      expression.type.constructor === ListType ||
        expression.type.constructor === DictType,
      "Not a list or  dict"
    );
  },

  isNum(type) {
    doCheck(type === NumType, "Not a num");
  },

  isBool(type) {
    doCheck(type === BoolType, "Not a bool");
  },

  isFunction(value) {
    doCheck(value.constructor === FuncDecStmt, "Not a function");
  },

  isNumOrText(type) {
    doCheck(
      type === NumType || type === TextType,
      "Cannot apply '+' to types that are not num or text"
    );
  },

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    doCheck(deepEqual(e1.id, e2.id), "Types must match exactly");
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    doCheck(
      deepEqual(expression.type, type) || deepEqual(expression.type, NoneType),
      `Expression of type ${util.format(
        expression.type
      )} not compatible with type ${util.format(type)}`
    );
  },

  isNotReadOnly(lvalue) {
    doCheck(
      !(lvalue.constructor === IdentifierExpression && lvalue.ref.constant),
      "Assignment to read-only variable"
    );
  },

  sameType(arg, param) {
    console.log("in type check: ", arg, param);
    if (param.id === "Num") {
      doCheck(
        typeof arg.value === "number" || typeof arg.operand.value === "number",
        "Type mismatch NUM"
      );
    }
    if (param.id === "Text") {
      doCheck(typeof arg.value === "string", "Type mismatch TEXT");
    }
    if (param.id === "Bool") {
      doCheck(typeof arg.value === "boolean", "Type mismatch BOOL");
    }
  },

  // Same number of args and params; all types compatible
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.sameType(arg, params[i].type));
  },

  containsKey(id, key) {
    if (id.type.constructor === ListType) {
      this.isNum(id.type.memberType);
      doCheck(id.exp.members.length > key, "Index out of bounds");
    }
    if (id.type.constructor === DictType) {
      const keyFound = id.exp.exp.find(
        (keyValue) => keyValue.key.value === key
      );
      doCheck(keyFound, "Invalid key");
    }
  },
};
