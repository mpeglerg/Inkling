// eslint-disable-next-line max-classes-per-file
class Program {
  constructor(stmt) {
    this.stmt = stmt
  }
}

// ////// Block
// Should this be done in parser ? ask
class Block {
  constructor(statements) {
    // map or filter over every statement
    // this.statements = statements.filter()
    this.statements = statements
  }
}



class Assignment {
  constructor(id, exp) {
    Object.assign(this, {
      id,
      exp,
    })
  }
}

class VarDeclaration {
  constructor(id, constant = false, type, exp) {
    // constant tries to account for 'always' functionality
    Object.assign(this, {
      id,
      constant,
      type,
      exp,
    })
  }
}

class Print {
  constructor(exp) {
    Object.assign(this, { exp })
  }
}

class ReturnStatement {
  constructor(returnValue) {
    this.returnValue = returnValue
  }
}

class IfStmt {
  constructor(tests, consequence, alt) {
    Object.assign(this, {
      test,
      consequence,
      alt,
    })
  }
}

class ForLoop {
  constructor(id, type, exp, body) {
    Object.assign(this, {
      id,
      type,
      exp,
      body,
    })
  }
}

class FuncDecStmt {
  constructor(id, params, type, body) {
    Object.assign(this, {
      id,
      params,
      type,
      body,
    })
  }
}

class WhileLoop {
  constructor(condition, body) {
    Object.assign(this, {
      condition,
      body,
    })
  }
}

class FieldVarExp {
  constructor(id, field) {
    Object.assign(this, {
      id,
      field,
    })
  }
}

class IdentifierExpression {
  constructor(id) {
    this.id = id
  }
}

class SubscriptedVarExp {
  constructor(id, key) {
    Object.assign(this, {
      id,
      key,
    })
  }
}

class Param {
  constructor(id, type) {
    Object.assign(this, {
      id,
      type,
    })
  }
}

class Call {
  constructor(id, args) {
    Object.assign(this, {
      id,
      args,
    })
  }
}

class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, {
      op,
      left,
      right,
    })
  }
}

class PowExp {
  constructor(left, right) {
    Object.assign(this, {
      left,
      right,
    })
  }
}

class PrefixExpression {
  constructor(op, operand) {
    Object.assign(this, {
      op,
      operand,
    })
  }
}

class PostfixExpression {
  constructor(operand, op) {
    Object.assign(this, {
      op,
      operand,
    })
  }
}

// class Paren {
//   constructor(exp) {
//     Object.assign(this, { exp })
//   }
// }

class ListExpression {
  constructor(members) {
    this.members = members
  }
}

class KeyValueExpression {
  constructor(key, value) {
    Object.assign(this, {
      key,
      value,
    })
  }
}

class DictExpression {
  constructor(exp) {
    Object.assign(this, { exp })
  }
}

class SetExpression {
  constructor(members) {
    this.members = members
  }
}

// Types
class ListType {
  constructor(memberType) {
    Object.assign(this, { memberType })
  }
}

class SetType {
  constructor(memberType) {
    Object.assign(this, { memberType })
  }
}

class DictType {
  constructor(keyType, valueType) {
    Object.assign(this, {
      keyType,
      valueType,
    })
  }
}

// literals
class NumericLiteral {
  constructor(value) {
    this.value = value
  }
}

class TextLiteral {
  constructor(value) {
    this.value = value
  }
}

class BooleanLiteral {
  constructor(value) {
    this.value = value
  }
}

module.exports = {
  Program,
  Block,
  Assignment,
  VarDeclaration,
  Print,
  ReturnStatement,
  ForLoop,
  IfStmt,
  FuncDecStmt,
  WhileLoop,
  FieldVarExp,
  SubscriptedVarExp,
  Param,
  Call,
  BinaryExpression,
  IdentifierExpression,
  ListExpression,
  KeyValueExpression,
  DictExpression,
  SetExpression,
  PowExp,
  PrefixExpression,
  PostfixExpression,
  // Paren, not needed I believe
  ListType,
  SetType,
  DictType,
  NumericLiteral,
  TextLiteral,
  BooleanLiteral,
}
