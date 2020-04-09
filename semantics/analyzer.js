const {
  Program,
  Assignment,
  VarDeclaration,
  NumericLiteral,
  BooleanLiteral,
  TextLiteral,
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
} = require('../ast')
const check = require('../semantics/check')
const { NumType, BoolType, TextType } = require('../semantics/builtins')

Program.prototype.analyze = (context) => {
  this.stmts.forEach((stmt) => {
    stmt.analyze(context)
  })
}

// design decisions need to be made for this
VarDeclaration.prototype.analyze = (context) => {

}

Assignment.prototype.analyze = (context) => {
  context.lookupValue(this.id) // perhaps this should be this.id.analyze(context), unsure
  check.expressionsHaveSameType(this.id, this.exp)
  check.isNotReadOnly(this.id)
}

NumericLiteral.prototype.analyze = (context) => {
  this.type = NumType
}
BooleanLiteral.prototype.analyze = (context) => {
  this.type = BoolType
}

TextLiteral.prototype.analyze = (context) => {
  this.type = BoolType
}

IfStmt.prototype.analyze = (context) => {
  this.tests.forEach((test) => {
    test.analyze(context)
    check.isBoolean(test) // Add boolean checker to check file
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
    check.isNumber(this.left)
    check.isNumber(this.right)
    this.type = BoolType
  } else if (['!=', '=='].includes(this.op)) {
    check.expressionsHaveSameType(this.left.type, this.right.type)
    this.type = BoolType
  } else if (['and', 'or'].includes(this.op)) {
    check.isBoolean(this.left)
    check.isBoolean(this.right)
    this.type = BoolType
  } else if (this.op === '+') {
    check.expressionsHaveSameType(this.left.type, this.right.type)
    check.isNumOrText(this.left)
    check.isNumOrText(this.right)
    this.type = this.left.type === NumType ? NumType : BoolType
  } else {
    check.expressionsHaveSameType(this.left.type, this.right.type)
    this.type = NumType
  }
}
WhileLoop.prototype.analyze = (context) => {
  this.condition.analyze(context)
  const bodyContext = context.createChildContextForLoop()
  this.body.forEach((s) => s.analyze(bodyContext))
}

FuncDecStmt.prototype.analyze = (context) => {
  context.add(this.function)
  this.function.analyze(context.createChildContextForFunctionBody(this))
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
  context.add(this)
}

ReturnStatement.prototype.analyze = (context) => {
  this.returnValue.analyze(context)
  context.assertInFunction('Return statement not in function')
}

DictExpression.prototype.analyze = (context) => {

}

Call.prototype.analyze = (context) => {
  this.id.analyze(context)
  this.args.forEach((arg) => arg.analyze(context))
  this.type = this.id.ref.type
  context.assertIsFunction(this.id.ref)
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
  console.log(context)
}
