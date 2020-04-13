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
} = require("../ast/index");

const check = require("../semantics/check");

const {
  NumType,
  BoolType,
  TextType,
  NoneType,
} = require("../semantics/builtins");

const Context = require("./context");

module.exports = function (root) {
  root.analyze(Context.INITIAL);
};

Program.prototype.analyze = function (context) {
  //console.log("These are statements : ", context.declarations.display);
  this.stmts.forEach((stmt) => {
    console.log("stmt ", stmt);
    stmt.analyze(context);
  });
};

Print.prototype.analyze = function (context) {
  console.log("in print");
  this.exp.analyze(context);
};

Block.prototype.analyze = function (context) {
  //console.log("In block: ", this.statements);
  const localContext = context.createChildContextForBlock();
  this.statements.forEach((s) => s.analyze(localContext));
};

// design decisions need to be made for this
VarDeclaration.prototype.analyze = function (context) {
  this.exp.analyze(context);
  this.type.analyze(context);
  check.isAssignableTo(this.exp, this.type);
  console.log("adding id: " + this.id);
  context.add(this.id, this);
};

Assignment.prototype.analyze = function (context) {
  this.target.analyze(context);
  this.source.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
  check.isNotReadOnly(this.target);
};

Literal.prototype.analyze = function (context) {
  console.log("in literal: ", this.value);
  if (typeof this.value === "number") {
    this.type = NumType;
  } else if (typeof this.value === "boolean") {
    console.log("in literal: ", this.value);
    this.type = BoolType;
  } else if (typeof this.value === "string") {
    this.type = TextType;
  } else {
    this.type = NoneType;
  }
};

PrimitiveType.prototype.analyze = function (_) {};

ListType.prototype.analyze = function (context) {
  this.memberType.analyze(context);
};

SetType.prototype.analyze = function (context) {
  this.memberType.analyze(context);
};

IfStmt.prototype.analyze = function (context) {
  this.tests.forEach((test) => {
    test.analyze(context);
    check.isBool(test.type); // Add boolean checker to check file
  });
  this.consequence.forEach((block) => {
    const blockContext = context.createChildContextForBlock();
    block.analyze(blockContext);
  });
  console.log("this.alt", this.alt);

  if (this.alt) {
    const alternateBlock = context.createChildContextForBlock();
    this.alt.analyze(alternateBlock);
  }
};

Ternary.prototype.analyze = function (context) {
  this.test.analyze(context);
  check.isBool(this.test.type);

  const blockContext = context.createChildContextForBlock();
  this.consequence.analyze(blockContext);

  const alternateBlock = context.createChildContextForBlock();
  this.alt.analyze(alternateBlock);
};

BinaryExpression.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (["<=", ">=", "<", ">"].includes(this.op)) {
    check.isNum(this.left.type);
    check.isNum(this.right.type);
    this.type = BoolType;
  } else if (["!=", "=="].includes(this.op)) {
    check.expressionsHaveTheSameType(this.left.type, this.right.type);
    this.type = BoolType;
  } else if (["and", "or"].includes(this.op)) {
    check.isBool(this.left.type);
    check.isBool(this.right.type);
    this.type = BoolType;
  } else if (this.op === "+") {
    check.expressionsHaveTheSameType(this.left.type, this.right.type);
    check.isNumOrText(this.left.type);
    check.isNumOrText(this.right.type);
    this.type = this.left.type === NumType ? NumType : BoolType;
  } else {
    check.expressionsHaveTheSameType(this.left.type, this.right.type);
    this.type = NumType;
  }
};

PowExp.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
  check.isNum(this.left.type);
  check.isNum(this.right.type);
  console.log("pow : ", this);
};

PrefixExpression.prototype.analyze = function (context) {
  if ("!" == this.op) {
    check.isBool(this.operand);
    this.type = BoolType;
  } else {
    check.isNum(this.operand);
    this.type = NumType;
  }
};

IdentifierExpression.prototype.analyze = function (context) {
  this.ref = context.lookupValue(this.id);
  this.type = this.ref.type;
};

PostfixExpression.prototype.analyze = function (context) {
  this.operand.analyze(context);
  console.log("operand: ", this);
  check.isNum(this.operand.type);
};

WhileLoop.prototype.analyze = function (context) {
  this.condition.analyze(context);
  const bodyContext = context.createChildContextForLoop();
  this.body.analyze(context);
};

ForLoop.prototype.analyze = function (context) {
  // TODO
  this.exp.analyze(context);
  // check list, obj, or set
};

FuncDecStmt.prototype.analyze = function (context) {
  context.add(this.function.id, this);
  const bodyContext = context.createChildContextForFunctionBody(this);
  console.log("in funcDec: ", this);
  this.function.analyze(bodyContext);
};

FuncObject.prototype.analyze = function (context) {
  this.params = this.params.map((p) => new Param(p.id, p.type));
  this.params.forEach((p) => p.analyze(context));
  this.body.analyze(context);
  console.log("in funcObj: ", this.body.statements);

  const returnStatement = this.body.statements.filter(
    (b) => b.constructor === ReturnStatement
  );
  console.log(
    "return statment: ",
    this.type !== "Void",
    " return :",
    returnStatement.length === 0
  );
  if (returnStatement.length === 0 && this.type !== "Void") {
    throw new Error("No return statement found");
  } else if (returnStatement) {
    if (this.type === "Void") {
      throw new Error("Void functions do not have return statements");
    }
    check.isAssignableTo(returnStatement[0].returnValue, this.type);
  }
};

Param.prototype.analyze = function (context) {
  context.add(this.id, this);
};

ReturnStatement.prototype.analyze = function (context) {
  this.returnValue.analyze(context);
  context.assertInFunction("Return statement not in function");
};

DictType.prototype.analyze = function (context) {
  this.keyType.analyze(context);
  this.valueType.analyze(context);
};

DictExpression.prototype.analyze = function (context) {
  this.exp.forEach((e) => {
    e.key.analyze(context);
    e.value.analyze(context);
  });
  if (this.exp.length) {
    const keyType = this.exp[0].key.type;
    const valueType = this.exp[0].value.type;
    this.type = new DictType(keyType, valueType);
    for (let i = 1; i < this.exp.length; i += 1) {
      check.expressionsHaveTheSameType(this.exp[i].key.type, this.type.keyType);
      check.expressionsHaveTheSameType(
        this.exp[i].value.type,
        this.type.valueType
      );
    }
  }
};

ListExpression.prototype.analyze = function (context) {
  this.members.forEach((m) => m.analyze(context));
  console.log(" this.members : ", this);
  if (this.members.length) {
    this.type = new ListType(this.members[0].type);
    console.log("this type: ", this.type);
    for (let i = 1; i < this.members.length; i += 1) {
      check.expressionsHaveTheSameType(
        this.members[i].type,
        this.type.memberType
      );
    }
  }
};

SetExpression.prototype.analyze = function (context) {
  this.members.forEach((m) => m.analyze(context));
  if (this.members.length) {
    this.type = new SetType(this.members[0].type);
    for (let i = 1; i < this.members.length; i += 1) {
      check.expressionsHaveTheSameType(
        this.members[i].type,
        this.type.memberType
      );
    }
  }
};

Call.prototype.analyze = function (context) {
  this.id.analyze(context);
  this.args.forEach((arg) => arg.analyze(context));
  this.type = this.id.ref.type;
  context.isFunction(this.id.ref);
  if (this.args.length !== this.id.ref.params.length) {
    throw new Error("Incorrect number of arguments");
  }
  this.args.forEach((a, i) => {
    const paramType = this.id.ref.params[i].type;
    if (check.isListType(paramType)) {
      if (
        a.expression.type.constructor !== paramType.constructor &&
        paramType !== "void"
      ) {
        throw new Error("Argument and Param types do not match");
      }
    } else if (a.expression.type !== paramType && paramType !== "void") {
      throw new Error("Argument and Param types do not match");
    }
  });
};
