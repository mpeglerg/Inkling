const util = require('util')
const {
  ListType,
  SetType,
  DictType,
  FuncDecStmt,
  IdentifierExpression,
  VarDeclaration,
} = require('../ast')
const {
  NumType, TextType, BoolType, NoneType
} = require('./builtins')

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

module.exports = {
  // Is this type an array type?
  isListType(type) {
    doCheck(type.constructor === ListType, 'Not a list type') // modified
  },

  isSetType(type) {
    doCheck(type.constructor === SetType, 'Not a list type') // modified
  },

  isDictType(type) {
    doCheck(type.constructor === DictType, 'Not a dict type')
  },

  // Is the type of this expression an array type?
  isList(expression) {
    doCheck(expression.type.constructor === ListType, 'Not a list') // modified
  },

  isNum(expression) {
    doCheck(expression.type === NumType, 'Not a num') // modified
  },

  mustNotHaveAType(expression) {
    doCheck(!expression.type, 'Expression must not have a type')
  },

  isNumOrText(expression) {
    doCheck(
      expression.type === NumType || expression.type === NumType,
      'Not an integer or string'
    );
  },

  isFunction(value) {
    doCheck(value.constructor === FuncDecStmt, 'Not a function') // modified
  },

  // Are two types exactly the same?
  expressionsHaveSameType(e1, e2) {
    doCheck(e1.type === e2.type, 'Types must match exactly')
  },

  // Can we assign expression to a variable/param/field of type type?
  // How the fuck do we handle none here????????
  isAssignableTo(expression, type) {
    doCheck(
      expression.type === type || expression.type === NoneType,
      `Expression of type ${util.format(
        expression.type
      )} not compatible with type ${util.format(type)}`
    );
  },

  isNotReadOnly(lvalue) {
    doCheck(
      !(lvalue.constructor === VarDeclaration && lvalue.always === 'true'),
      'Assignment to read-only variable',
    )
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`)
  },

  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`)
  },

  // Same number of args and params; all types compatible
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`,
    )
    args.forEach((arg, i) => this.isAssignableTo(arg, params[i].type))
  },

  // If there is a cycle in types, they must go through a record
  noRecursiveTypeCyclesWithoutRecordTypes() {
    /* TODO - not looking forward to this one */
  },
}
