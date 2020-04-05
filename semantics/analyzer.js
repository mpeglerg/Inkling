const {
  NumericLiteral,
  BooleanLiteral,
  TextLiteral,
  BinaryExpression
} = require("../ast");
const check = require("../semantics/check");
const {
  NumType,
  BoolType,
  TextType,
  VoidType
} = require("../semantics/builtins");

NumericLiteral.prototype.analyze = function(context) {
  this.type = NumType;
};
BooleanLiteral.prototype.analyze = function(context) {
  this.type = BoolType;
};

TextLiteral.prototype.analyze = function(context) {
  this.type = BoolType;
};

BinaryExpression.prototype.analyze = function(context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (["<=", ">=", "<", ">"].includes(this.op)) {
    check.isNumber(this.left);
    check.isNumber(this.right);
    this.type = BoolType;
  } else if (["!=", "=="].includes(this.op)) {
    check.sameType(this.left.type, this.right.type);
    this.type = BoolType;
  } else if (["and", "or"].includes(this.op)) {
    check.isBoolean(this.left);
    check.isBoolean(this.right);
    this.type = BoolType;
  } else if (this.op === "+") {
    check.sameType(this.left.type, this.right.type);
    check.isNumberOrString(this.left);
    check.isNumberOrString(this.right);
    this.type = this.left.type === NumType ? NumType : BoolType;
  } else {
    check.sameType(this.left.type, this.right.type);
    this.type = NumType;
  }
};
