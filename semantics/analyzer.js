const {
  Program,
  Assignment,
  VarDeclaration,
  Literal,
  BinaryExpression,
  IfStmt,
  WhileLoop,
  FuncDecStmt,
  FuncObject,
  Call,
  Param,
  DictExpression,
  DictType,
  ReturnStatement,
  IdentifierExpression,
  ListExpression,
  ListType,
  SetExpression,
  SetType,
} = require('../ast')

const check = require('../semantics/check')

const {
  NumType, BoolType, TextType, NoneType,
} = require('../semantics/builtins')

const Context = require('./context')

module.exports = (root) => {
  root.analyze(Context.INITIAL)
}

Program.prototype.analyze = (context) => {
  this.stmts.forEach((stmt) => {
    stmt.analyze(context)
  })
}

// design decisions need to be made for this
VarDeclaration.prototype.analyze = (context) => {
  const a = new Assignment(this.id, this.exp)
  a.analyze(context)
}

Assignment.prototype.analyze = (context) => {
  context.lookupValue(this.id) // perhaps this should be this.id.analyze(context), unsure
  check.expressionsHaveTheSameType(this.id, this.exp)
  check.isNotReadOnly(this.id)
}

// eslint-disable-next-line no-unused-vars
Literal.prototype.analyze = (context) => {
  if (typeof this.value === 'number') {
    this.type = NumType
  } else if (typeof this.value === 'boolean') {
    this.type = BoolType
  } else if (typeof this.value === 'string') {
    this.type = TextType
  } else {
    this.type = NoneType
  }
}

IfStmt.prototype.analyze = (context) => {
  this.tests.forEach((test) => {
    test.analyze(context)
    check.isBool(test) // Add boolean checker to check file
  })
  this.consequence.forEach((block) => {
    const blockContext = context.createChildContextForBlock()
    block.forEach((statement) => statement.analyze(blockContext))
  })
  if (this.alt) {
    const alternateBlock = context.createChildContextForBlock()
    this.alt.forEach((s) => s.analyze(alternateBlock))
  }
}

BinaryExpression.prototype.analyze = (context) => {
  this.left.analyze(context)
  this.right.analyze(context)
  if (['<=', '>=', '<', '>'].includes(this.op)) {
    check.isNum(this.left)
    check.isNum(this.right)
    this.type = BoolType
  } else if (['!=', '=='].includes(this.op)) {
    check.expressionsHaveTheSameType(this.left.type, this.right.type)
    this.type = BoolType
  } else if (['and', 'or'].includes(this.op)) {
    check.isBool(this.left)
    check.isBool(this.right)
    this.type = BoolType
  } else if (this.op === '+') {
    check.expressionsHaveTheSameType(this.left.type, this.right.type)
    check.isNumOrText(this.left)
    check.isNumOrText(this.right)
    this.type = this.left.type === NumType ? NumType : BoolType
  } else {
    check.expressionsHaveTheSameType(this.left.type, this.right.type)
    this.type = NumType
  }
}
WhileLoop.prototype.analyze = (context) => {
  this.condition.analyze(context)
  const bodyContext = context.createChildContextForLoop()
  this.body.forEach((s) => s.analyze(bodyContext))
}

FuncDecStmt.prototype.analyze = (context) => {
  context.add(this.function.id, this)
  const bodyContext = context.createChildContextForFunctionBody(this)
  this.body.forEach((s) => s.analyze(bodyContext))
}

FuncObject.prototype.analyze = (context) => {
  this.params = this.params.map((p) => new Param(p.type, p.id))
  this.params.forEach((p) => p.analyze(context))
  this.body.forEach((s) => s.analyze(context))

  const returnStatement = this.body.filter(
    (b) => b.constructor === ReturnStatement,
  )
  if (returnStatement.length === 0 && this.type !== 'void') {
    throw new Error('No return statement found')
  } else if (returnStatement.length > 0) {
    if (this.type === 'void') {
      throw new Error('Void functions do not have return statements')
    }
    check.isAssignableTo(returnStatement[0].returnValue.type, this.type)
  }
}

Param.prototype.analyze = (context) => {
  context.add(this.id, this)
}

ReturnStatement.prototype.analyze = (context) => {
  this.returnValue.analyze(context)
  context.assertInFunction('Return statement not in function')
}

DictExpression.prototype.analyze = (context) => {
  this.exp.forEach((e) => {
    e.key.analyze(context)
    e.value.analyze(context)
  })
  if (this.exp.length) {
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
}

ListExpression.prototype.analyze = (context) => {
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

SetExpression.prototype.analyze = (context) => {
  this.members.forEach((m) => m.analyze(context))
  if (this.members.length) {
    this.type = new SetType(this.members[0].type)
    for (let i = 1; i < this.members.length; i += 1) {
      check.expressionsHaveTheSameType(this.members[i].type, this.type.memberType)
    }
  }
}

Call.prototype.analyze = (context) => {
  this.id.analyze(context)
  this.args.forEach((arg) => arg.analyze(context))
  this.type = this.id.ref.type
  context.isFunction(this.id.ref)
  if (this.args.length !== this.id.ref.params.length) {
    throw new Error('Incorrect number of arguments')
  }
  this.args.forEach((a, i) => {
    const paramType = this.id.ref.params[i].type
    if (check.isListType(paramType)) {
      if (
        a.expression.type.constructor !== paramType.constructor
        && paramType !== 'void'
      ) {
        throw new Error('Argument and Param types do not match')
      }
    } else if (a.expression.type !== paramType && paramType !== 'void') {
      throw new Error('Argument and Param types do not match')
    }
  })
}
IdentifierExpression.prototype.analyze = (context) => {
  this.ref = context.lookupValue(this.id)
  this.type = this.ref.type
}
