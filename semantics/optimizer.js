/* eslint func-names: ["error", "never"] */
const {
  Program,
  Block,
  Assignment,
  VarDeclaration,
  Print,
  ReturnStatement,
  ForLoop,
  IfStmt,
  FuncDecStmt,
  FuncObject,
  WhileLoop,
  SubscriptedVarExp,
  Param,
  Call,
  BinaryExpression,
  IdentifierExpression,
  ListExpression,
  DictExpression,
  SetExpression,
  PowExp,
  PrefixExpression,
  PostfixExpression,
  Literal,
  None,
  Ternary,
} = require('../ast')

module.exports = (program) => program.optimize()

function isZero(e) {
  return e instanceof Literal && e.value === 0
}

function isOne(e) {
  return e instanceof Literal && e.value === 1
}

function bothLiterals(b) {
  return b.left instanceof Literal && b.right instanceof Literal
}

function isNegative(n) {
  return n instanceof Literal && n.value < 0
}

Program.prototype.optimize = function () {
  this.stmts = this.stmts.map((stmt) => stmt.optimize())
  return this
}

Print.prototype.optimize = function () {
  return this
}

Block.prototype.optimize = function () {
  this.statements = this.statements.map((s) => s.optimize())
  return this.statements.length === 1 ? this.statements[0] : this
}

VarDeclaration.prototype.optimize = function () {
  this.exp = this.exp.optimize()
  return this
}

Literal.prototype.optimize = function () {
  return this
}

IfStmt.prototype.optimize = function () {
  this.tests = this.tests.map((test) => test.optimize())
  this.consequence = this.consequence.map((consequence) => consequence.optimize())
  if (this.alternate) {
    this.alternate = this.alternate.optimize()
  }
  if (this.tests.length === 0) {
    return this.alternate
  }
  return this
}

Ternary.prototype.optimize = function () {
  this.test = this.test.optimize()
  this.consequence = this.consequence.optimize()
  this.alt = this.alt.optimize()
  return this
}

BinaryExpression.prototype.optimize = function () {
  this.left = this.left.optimize()
  this.right = this.right.optimize()
  // we may need to check that we aren't concatenating strings here before we do these, unsure
  if ((this.op === '+' || this.op === '-') && isZero(this.right)) return this.left
  if (this.op === '+' && isZero(this.left)) return this.right
  // not sure this use of isNegative was the best, may need some tweaks
  if (this.op === '+' && isNegative(this.right)) {
    return new Literal(this.left.value + this.right.value)
  }
  if (this.op === '-' && isZero(this.left)) return new Literal(`-${this.right.value}`)
  if (this.op === '*' && (isZero(this.left) || isZero(this.right))) return new Literal(0)
  if (this.op === '*' && isOne(this.right)) return this.left
  if (this.op === '*' && isOne(this.left)) return this.right
  if (bothLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value]
    if (this.op === '+') return new Literal(x + y)
    if (this.op === '-') return new Literal(x - y)
    if (this.op === '*') return new Literal(x * y)
    if (this.op === '/') return new Literal(x / y)
    if (this.op === '%') return new Literal(x % y)
    if (this.op === '<=') return new Literal(x <= y)
    if (this.op === '>=') return new Literal(x >= y)
    if (this.op === '<') return new Literal(x < y)
    if (this.op === '>') return new Literal(x > y)
  }
  return this
}

PowExp.prototype.optimize = function () {
  this.left = this.left.optimize()
  this.right = this.right.optimize()
  if (this.right === 0) {
    return new Literal(1)
  }
  if (this.left === 1 || this.left === 0 || this.right === 1) {
    return new Literal(this.left)
  }
  return this
}

PrefixExpression.prototype.optimize = function () {
  this.operand = this.operand.optimize()
  if (this.op === '-' && this.operand instanceof Literal) {
    return new Literal(-this.operand.value)
  }
  return this
}

IdentifierExpression.prototype.optimize = function () {
  if (this.id instanceof Call || this.id instanceof SubscriptedVarExp) {
    this.id = this.id.optimize()
  }
  return this
}

PostfixExpression.prototype.optimize = function () {
  this.operand.optimize()
  return this
}

WhileLoop.prototype.optimize = function () {
  this.condition = this.condition.optimize()
  if (this.condition instanceof Literal && !this.condition.value) {
    return null
  }
  this.body = this.body.optimize()
  return this
}

Assignment.prototype.optimize = function () {
  this.target = this.target.optimize()
  this.source = this.source.optimize()
  if (this.target.id === this.source.id) {
    return null
  }
  return this
}

ForLoop.prototype.optimize = function () {
  // this.id = this.id.optimize()
  this.collection = this.collection.optimize()
  this.body = this.body.optimize()
  return this
}

FuncDecStmt.prototype.optimize = function () {
  this.function = this.function.optimize()
  return this
}

FuncObject.prototype.optimize = function () {
  if (this.body) {
    this.body = this.body.optimize()
  }
  return this
}

Param.prototype.optimize = function () {
  return this
}

ReturnStatement.prototype.optimize = function () {
  this.returnValue = this.returnValue.optimize()
  return this
}

DictExpression.prototype.optimize = function () {
  this.exp.forEach((e) => {
    e.key.optimize()
    e.value.optimize()
  })
  return this
}

ListExpression.prototype.optimize = function () {
  this.members = this.members.map((m) => m.optimize())
  return this
}

SetExpression.prototype.optimize = function () {
  this.members.forEach((m) => m.optimize())
  return this
}

Call.prototype.optimize = function () {
  this.args = this.args.map((arg) => arg.optimize())
  return this
}

None.prototype.optimize = function () {
  return this
}

SubscriptedVarExp.prototype.optimize = function () {
  this.key = this.key.optimize()
  return this
}
