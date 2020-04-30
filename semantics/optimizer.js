/* TODO:
*  Constant Folding - Copy from Tiger
*  Strength Reduction - pick a couple
*  Unreachable Codes - pick a couple
*  Assignment Simplification
*/

const {
  Program,
  Block,
  Assignment,
  VarDeclaration,
  Print,
  Literal,
  BinaryExpression,
  IfStmt,
  WhileLoop,
  FuncDecStmt,
  FuncObject,
  Call,
  Param,
  DictExpression,
  SetExpression,
  ListExpression,
  ReturnStatement,
  IdentifierExpression,
  PostfixExpression,
  PrefixExpression,
  ForLoop,
  Ternary,
  None,
  SubscriptedVarExp,
} = require('../ast');

module.exports = program => program.optimize();

function isZero(e) {
  return e instanceof Literal && e.value === 0;
}

function isOne(e) {
  return e instanceof Literal && e.value === 1;
}

function bothLiterals(b) {
  return b.left instanceof Literal && b.right instanceof Literal;
}
BinaryExpression.prototype.optimize = function () {
  this.left = this.left.optimize();
  this.right = this.right.optimize();
  if (this.op === '+' && isZero(this.right)) return this.left;
  if (this.op === '+' && isZero(this.left)) return this.right;
  if (this.op === '*' && isZero(this.right)) return new Literal(0);
  if (this.op === '*' && isZero(this.left)) return new Literal(0);
  if (this.op === '*' && isOne(this.right)) return this.left;
  if (this.op === '*' && isOne(this.left)) return this.right;
  if (bothLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (this.op === '+') return new Literal(x + y);
    if (this.op === '*') return new Literal(x * y);
    if (this.op === '/') return new Literal(x / y);
  }
  return this;
};