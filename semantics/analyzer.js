/* eslint func-names: ["error", "never"] */

const {
  Program,
  Print,
  Block,
  Assignment,
  VarDeclaration,
  Literal,
  BinaryExpression,
  PowExp,
  IfStmt,
  WhileLoop,
  FuncDecStmt,
  FuncObject,
  Call,
  Param,
  DictExpression,
  SetExpression,
  ListExpression,
  PrimitiveType,
  DictType,
  SetType,
  ListType,
  ReturnStatement,
  IdentifierExpression,
  PostfixExpression,
  PrefixExpression,
  ForLoop,
  Ternary,
  None,
  SubscriptedVarExp,
} = require('../ast/index')

const check = require('./check')

const {
  NumType, BoolType, TextType, NoneType,
} = require('./builtins')

const Context = require('./context')

module.exports = function (root) {
  root.analyze(Context.INITIAL)
}

Program.prototype.analyze = function (context) {
  this.stmts.forEach((stmt) => {
    stmt.analyze(context)
  })
}

Print.prototype.analyze = function (context) {
  this.exp.analyze(context)
}

Block.prototype.analyze = function (context) {
  const localContext = context.createChildContextForBlock()
  this.statements.forEach((s) => s.analyze(localContext))
}

VarDeclaration.prototype.analyze = function (context) {
  this.exp.analyze(context)
  this.type.analyze(context)
  check.isAssignableTo(this.exp, this.type)
  context.add(this.id, this)
}

Literal.prototype.analyze = function () {
  if (typeof this.value === 'number') {
    this.type = NumType
  } else if (typeof this.value === 'boolean') {
    this.type = BoolType
  } else { // safe to just have an else here I believe because of grammar constraints
    this.type = TextType
  }
}

PrimitiveType.prototype.analyze = function () {}

ListType.prototype.analyze = function (context) {
  this.memberType.analyze(context)
}

SetType.prototype.analyze = function (context) {
  this.memberType.analyze(context)
}

IfStmt.prototype.analyze = function (context) {
  this.tests.forEach((test) => {
    test.analyze(context)
    check.isBool(test.type)
  })
  this.consequence.forEach((block) => {
    const blockContext = context.createChildContextForBlock()
    block.analyze(blockContext)
  })
  if (this.alt) {
    const alternateBlock = context.createChildContextForBlock()
    this.alt.analyze(alternateBlock)
  }
}

Ternary.prototype.analyze = function (context) {
  this.test.analyze(context)
  check.isBool(this.test.type)
  const blockContext = context.createChildContextForBlock()
  this.consequence.analyze(blockContext)
  const alternateBlock = context.createChildContextForBlock()
  this.alt.analyze(alternateBlock)
  check.expressionsHaveTheSameType(this.consequence.type, this.alt.type)
  this.type = this.consequence.type
}

BinaryExpression.prototype.analyze = function (context) {
  this.left.analyze(context)
  this.right.analyze(context)
  if (['<=', '>=', '<', '>'].includes(this.op)) {
    check.isNum(this.left.type)
    check.isNum(this.right.type)
    this.type = BoolType
  } else if (['!=', '=='].includes(this.op)) {
    check.expressionsHaveTheSameType(this.left.type, this.right.type)
    this.type = BoolType
  } else if (['and', 'or'].includes(this.op)) {
    check.isBool(this.left.type)
    check.isBool(this.right.type)
    this.type = BoolType
  } else if (this.op === '+') {
    check.expressionsHaveTheSameType(this.left.type, this.right.type)
    check.isNumOrText(this.left.type)
    check.isNumOrText(this.right.type)
    this.type = this.left.type === NumType ? NumType : BoolType
  } else {
    check.isNum(this.left.type)
    check.isNum(this.right.type)
    this.type = NumType
  }
}

PowExp.prototype.analyze = function (context) {
  this.left.analyze(context)
  this.right.analyze(context)
  check.isNum(this.left.type)
  check.isNum(this.right.type)
  this.type = NumType
}

PrefixExpression.prototype.analyze = function (context) {
  this.operand.analyze(context)
  if (this.op === '!') {
    check.isBool(this.operand.type)
    this.type = BoolType
  } else {
    check.isNum(this.operand.type)
    this.type = NumType
  }
}

IdentifierExpression.prototype.analyze = function (context) {
  if (!this.id.id) {
    this.ref = context.lookupValue(this.id)
    this.type = this.ref.type
  } else {
    this.id.analyze(context)
  }
}

PostfixExpression.prototype.analyze = function (context) {
  this.operand.analyze(context)
  check.isNum(this.operand.type)
  this.type = NumType
}

WhileLoop.prototype.analyze = function (context) {
  this.condition.analyze(context)
  const bodyContext = context.createChildContextForLoop()
  this.body.analyze(bodyContext)
}

Assignment.prototype.analyze = function (context) {
  this.target.analyze(context)
  this.source.analyze(context)
  if (!this.target.id.id) {
    check.isAssignableTo(this.source, this.target.type)
    check.isNotReadOnly(this.target)
  } else {
    check.isAssignableTo(this.source, this.target.id.type)
  }
}

ForLoop.prototype.analyze = function (context) {
  let type
  this.collection.analyze(context)
  check.isIterable(this.collection.type)
  if (
    this.collection.type.constructor === ListType
    || this.collection.type.constructor === SetType
  ) {
    type = this.collection.type.memberType
  } else if (this.collection.type.constructor === DictType) {
    type = this.collection.type.keyType
  } else {
    type = this.collection.type
  }
  const bodyContext = context.createChildContextForLoop()
  const id = new VarDeclaration(this.id, false, type)
  bodyContext.add(this.id, id)
  this.body.analyze(bodyContext)
}

FuncDecStmt.prototype.analyze = function (context) {
  context.add(this.function.id, this)
  const bodyContext = context.createChildContextForFunctionBody(this)
  this.function.analyze(bodyContext)
}

FuncObject.prototype.analyze = function (context) {
  this.params = this.params.map((p) => new Param(p.id, p.type))
  this.params.forEach((p) => p.analyze(context))
  this.body.analyze(context)

  const returnStatement = this.body.statements.filter(
    (b) => b.constructor === ReturnStatement,
  )

  if (returnStatement.length === 0 && this.type !== 'Void') {
    throw new Error('No return statement found')
  } else if (returnStatement.length > 0) {
    if (this.type === 'Void') {
      throw new Error('Void functions do not have return statements')
    }
    check.isAssignableTo(returnStatement[0].returnValue, this.type)
  }
}

Param.prototype.analyze = function (context) {
  context.add(this.id, this)
}

ReturnStatement.prototype.analyze = function (context) {
  this.returnValue.analyze(context)
  context.assertInFunction('Return statement not in function')
}

DictType.prototype.analyze = function (context) {
  this.keyType.analyze(context)
  this.valueType.analyze(context)
}

DictExpression.prototype.analyze = function (context) {
  this.exp.forEach((e) => {
    e.key.analyze(context)
    e.value.analyze(context)
  })
  if (this.exp.length > 0) {
    const keyType = this.exp[0].key.type
    const valueType = this.exp[0].value.type
    this.type = new DictType(keyType, valueType)
    for (let i = 1; i < this.exp.length; i += 1) {
      check.expressionsHaveTheSameType(this.exp[i].key.type, this.type.keyType)
      check.expressionsHaveTheSameType(
        this.exp[i].value.type,
        this.type.valueType,
      )
    }
  }
  // hmm i think we nee something here for empty dicts
}

ListExpression.prototype.analyze = function (context) {
  this.members.forEach((m) => m.analyze(context))
  if (this.members.length) {
    this.type = new ListType(this.members[0].type)
    for (let i = 1; i < this.members.length; i += 1) {
      check.expressionsHaveTheSameType(
        this.members[i].type,
        this.type.memberType,
      )
    }
  }
}

SetExpression.prototype.analyze = function (context) {
  this.members.forEach((m) => m.analyze(context))
  if (this.members.length) {
    this.type = new SetType(this.members[0].type)
    for (let i = 1; i < this.members.length; i += 1) {
      check.expressionsHaveTheSameType(
        this.members[i].type,
        this.type.memberType,
      )
    }
  }
}

Call.prototype.analyze = function (context) {
  this.callee = context.lookupValue(this.id.id)
  check.isFunction(this.callee)
  this.args.forEach((arg) => arg.analyze(context))
  check.legalArguments(this.args, this.callee.function.params)
  this.type = this.callee.function.type
}

None.prototype.analyze = function () {
  this.type = NoneType
}

SubscriptedVarExp.prototype.analyze = function (context) {
  this.callee = context.lookupValue(this.id.id)
  const listOrDict = this.callee || this.callee.exp
  check.isListOrDict(listOrDict)
  check.containsKey(this.callee, this.key.value)
  this.type = this.callee.type.memberType
}
