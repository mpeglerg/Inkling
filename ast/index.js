// eslint-disable-next-line max-classes-per-file
class Program {
  constructor(stmts) {
    this.stmts = stmts;
  }
}

class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

class VarDeclaration {
  constructor(id, constant, type, exp) {
    // constant accounts for 'always' functionality
    Object.assign(this, {
      id,
      constant,
      type,
      exp,
    });
  }
}

class Assignment {
  constructor(target, source) {
    Object.assign(this, {
      target,
      source,
    });
  }
}

class Print {
  constructor(exp) {
    Object.assign(this, { exp });
  }
}

class ReturnStatement {
  constructor(returnValue) {
    this.returnValue = returnValue;
  }
}

class IfStmt {
  constructor(tests, consequence, alt) {
    Object.assign(this, {
      tests,
      consequence,
      alt,
    });
  }
}

class Ternary {
  constructor(test, consequence, alt) {
    Object.assign(this, {
      test,
      consequence,
      alt,
    });
  }
}

class ForLoop {
  constructor(id, collection, body) {
    Object.assign(this, {
      id,
      collection,
      body,
    });
  }
}

class FuncObject {
  constructor(type, id, params, body) {
    Object.assign(this, {
      type,
      id,
      params,
      body,
    });
  }
}

class FuncDecStmt {
  constructor(id, params, returnType, body) {
    this.id = id;
    this.function = new FuncObject(returnType, id, params, body);
  }
}

class WhileLoop {
  constructor(condition, body) {
    Object.assign(this, {
      condition,
      body,
    });
  }
}

class FieldVarExp {
  constructor(id, field) {
    Object.assign(this, {
      id,
      field,
    });
  }
}

class IdentifierExpression {
  constructor(id) {
    this.id = id;
  }
}

class SubscriptedVarExp {
  constructor(id, key) {
    Object.assign(this, {
      id,
      key,
    });
  }
}

class Param {
  constructor(id, type) {
    Object.assign(this, {
      id,
      type,
    });
  }
}

class Call {
  constructor(id, args) {
    console.log("in call class");
    Object.assign(this, {
      id,
      args,
    });
  }
}

class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, {
      op,
      left,
      right,
    });
  }
}

class PowExp {
  constructor(left, right) {
    Object.assign(this, {
      left,
      right,
    });
  }
}

class PrefixExpression {
  constructor(op, operand) {
    Object.assign(this, {
      op,
      operand,
    });
  }
}

class PostfixExpression {
  constructor(operand, op) {
    Object.assign(this, {
      op,
      operand,
    });
  }
}

class ListExpression {
  constructor(members) {
    this.members = members;
  }
}

class KeyValuePair {
  constructor(key, value) {
    Object.assign(this, {
      key,
      value,
    });
  }
}

class DictExpression {
  constructor(exp) {
    Object.assign(this, { exp });
  }
}

class SetExpression {
  constructor(members) {
    this.members = members;
  }
}

// Types
class ListType {
  constructor(memberType) {
    Object.assign(this, { memberType });
  }
}

class SetType {
  constructor(memberType) {
    Object.assign(this, { memberType });
  }
}

class DictType {
  constructor(keyType, valueType) {
    Object.assign(this, {
      keyType,
      valueType,
    });
  }
}

class PrimitiveType {
  constructor(id) {
    Object.assign(this, { id });
  }
}

const NumType = new PrimitiveType("Num");
const TextType = new PrimitiveType("Text");
const BoolType = new PrimitiveType("Bool");

// Not sure if needed
class None {}

// Literals
class Literal {
  constructor(value) {
    this.value = value;
  }
}

module.exports = {
  PrimitiveType,
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
  FieldVarExp,
  SubscriptedVarExp,
  Param,
  Call,
  BinaryExpression,
  IdentifierExpression,
  ListExpression,
  KeyValuePair,
  DictExpression,
  SetExpression,
  PowExp,
  PrefixExpression,
  PostfixExpression,
  NumType,
  BoolType,
  TextType,
  ListType,
  SetType,
  DictType,
  Literal,
  None,
  Ternary,
};
