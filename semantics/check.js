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

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  // Is this type an array type?
  isListType(type) {
    doCheck(
      type.constructor === ListType,
      "Not a list type, dict, set or text"
    ); // modified
  },
  isIterable(type) {
    console.log("this is the type ", type);
    doCheck(
      type.constructor === ListType ||
        type.constructor === SetType ||
        type.constructor === DictType ||
        type === TextType,
      "Not a list, set, dic or text"
    );
  },
  isSetType(type) {
    doCheck(type.constructor === SetType, "Not a set type"); // modified
  },

  isDictType(type) {
    doCheck(type.constructor === DictType, "Not a dict type");
  },

  isBoolType(type) {
    doCheck(type.constructor === BoolType, "Not a bool type");
  },

  // Is the type of this expression an array type?
  // isList(expression) {
  //   doCheck(expression.type.constructor === ListType, "Not a list"); // modified
  // },

  isListOrDict(expression) {
    doCheck(
      expression.type.constructor === ListType ||
        expression.type.constructor === DictType,
      "Not a list or dict"
    ); // modified
  },

  isNum(expression) {
    console.log("Expression type constructor in isNum:", expression);
    doCheck(expression === NumType, "Not a num"); // modified
  },

  isBool(expression) {
    doCheck(expression === BoolType, "Not a bool");
  },

  isText(expression) {
    doCheck(expression === TextType, "Not a text");
  },

  mustNotHaveAType(expression) {
    doCheck(!expression.type, "Expression must not have a type");
  },

  isFunction(value) {
    doCheck(XZLvalue.constructor === FuncDecStmt, "Not a function"); // modified
  },

  isNumOrText(expression) {
    console.log("is num or text: ", expression);
    doCheck(
      expression === NumType || expression.type === TextType,
      "Cannot apply '+ ' to types that are not num or text"
    );
  },

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    console.log("expression have same type: ", e1, e2);
    doCheck(deepEqual(e1.id, e2.id), "Types must match exactly");
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    console.log("Expression type: ", expression.type, "Type: ", type);

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

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },

  // Same number of args and params; all types compatible
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.isAssignableTo(arg, params[i].type));
  },
};
