const util = require('util')
const {
  ListType, FuncDecStmt, VarDeclaration,
} = require('../ast')
const { Numeric, Text } = require('./builtins')

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

module.exports = {
  // Is this type an array type?
  isArrayType(type) {
    doCheck(type.constructor === ListType, 'Not a list type')
  },

  // Is the type of this expression a list type?
  isArray(expression) {
    doCheck(expression.type.constructor === ListType, 'Not a list')
  },

  isInteger(expression) {
    doCheck(expression.type === Numeric, 'Not an integer')
  },

  mustNotHaveAType(expression) {
    doCheck(!expression.type, 'Expression must not have a type')
  },

  isIntegerOrString(expression) {
    doCheck(
      expression.type === Numeric || expression.type === Text,
      'Not an integer or string',
    )
  },

  isFunction(value) {
    doCheck(value.constructor === FuncDecStmt, 'Not a function')
  },

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    doCheck(e1.type === e2.type, 'Types must match exactly')
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    doCheck(
      expression.type === type,
      `Expression of type ${util.format(expression.type)} not compatible with type ${util.format(
        type,
      )}`,
    )
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
}
