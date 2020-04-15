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

const { NoneType } = require('./builtins')

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  isIterable(type) {
    //console.log("this is the type ", type);
    doCheck(
      type.constructor === ListType ||
        type.constructor === SetType ||
        type.constructor === DictType ||
        type === TextType,
      "Not a list, set, dic or text"
    );
  },

  // isListOrDict(expression) {
  //   doCheck(
  //     expression.type.constructor === ListType ||
  //       expression.type.constructor === DictType,
  //     "Not a list or dict"
  //   ); // modified
  // },

  isNum(expression) {
    // console.log("Expression type constructor in isNum:", expression);
    doCheck(expression === NumType, "Not a num"); // modified
  },

  isBool(expression) {
    doCheck(expression === BoolType, "Not a bool");
  },

  isText(expression) {
    doCheck(expression === TextType, "Not a text");
  },

  // mustNotHaveAType(expression) {
  //   doCheck(!expression.type, "Expression must not have a type");
  // },

  isFunction(value) {
    doCheck(value.constructor === FuncDecStmt, "Not a function"); // modified
  },

  isNumOrText(expression) {
    // console.log("is num or text: ", expression);
    doCheck(
      expression === NumType || expression.type === TextType,
      "Cannot apply '+ ' to types that are not num or text"
    );
  },

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    // console.log("expression have same type: ", e1, e2);
    doCheck(deepEqual(e1.id, e2.id), "Types must match exactly");
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    //  console.log("Expression type: ", expression.type, "Type: ", type);

    doCheck(
      deepEqual(expression.type, type) || deepEqual(expression.type, NoneType),
      `Expression of type ${util.format(
        expression.type
      )} not compatible with type ${util.format(type)}`
    );
  },
  // || deepEqual(expression.type, NoneType)
  isNotReadOnly(lvalue) {
    doCheck(
      !(lvalue.constructor === IdentifierExpression && lvalue.ref.constant),
      "Assignment to read-only variable"
    );
  },

  // fieldHasNotBeenUsed(field, usedFields) {
  //   doCheck(!usedFields.has(field), `Field ${field} already declared`);
  // },

  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },
  sameType(arg, param) {
    // console.log("in same type ", arg, param);
    if (param.id === "Num") {
      doCheck(typeof arg.value === "number", `Type mismatch`);
    }
    if (param.id === "Text") {
      doCheck(typeof arg.value === "string", `Type mismatch`);
    }
    if (param.id === "Bool") {
      doCheck(typeof arg.value === "boolean", `Type mismatch`);
    }
  },

  // Same number of args and params; all types compatible
  legalArguments(args, params) {
    // console.log("this ", args, params);
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
      const keyFound = id.exp.exp.find((keyValue) => {
        return keyValue.key.value === key;
      });
      doCheck(keyFound, "Invalid key");
    }
  },
};
