/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
const fs = require('fs')
const ohm = require('ohm-js')
const {
  Program,
  Block,
  // Assignment,
  // we have assignment parsing functions but the classes don't match
  // I think we don't need Assignment class
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
  // Paren,  // not needed I think
  ListType,
  SetType,
  DictType,
  NumericLiteral,
  TextLiteral,
  BooleanLiteral,
} = require('../ast')

const grammar = ohm.grammar(fs.readFileSync('../grammar/Inkling.ohm'))

function arrayToNullable(a) {
  return a.length === 0 ? null : a[0]
}

// eslint-disable-next-line no-unused-vars
const astGenerator = grammar.createSemantics().addOperation('ast', {
  Program(stmt) {
    return new Program(stmt.ast())
  },
  SimpleStmt_return(_, e) {
    return new ReturnStatement(arrayToNullable(e.ast()))
  },
  // SimpleStmt_return(_gimmeKeyword, exp) {
  //     if (!exp.ast()) {
  //         return new Return();
  //     }
  //     return new Return(exp.ast());
  // }
  // Statements
  Block(_1, stmts, _2) {
    return new Block(stmts.ast())
  },
  IfExp_if(_1, _2, firstTest, _3, firstBlock, _4, _5, _6, moreTests, _7,
    moreBlock, _8, lastBlock) {
    return new IfStmt([firstTest.ast(), ...moreTests.ast()],
      [firstBlock.ast(), ...moreBlock.ast()], arrayToNullable(lastBlock.ast()))
  },
  ForLoop(_1, id, _2, type, _3, exp, body) {
    return new ForLoop(id.ast(), type.ast(), exp.ast(), body.ast())
  },
  WhileLoop(_1, _2, exp, _3, body) {
    return new WhileLoop(exp.ast(), body.ast())
  },
  FuncDec_function(_funcKeyword, id, _open, params, _close, type, body) {
    return new FuncDecStmt(id.ast(), params.ast(), type.ast(), body.ast())
  },
  FuncDec_arrowfunction(id, _1, _2, _3, params, _4, returnType, _5, body) {
    return new FuncDecStmt(id.ast(), params.ast(), returnType.ast(), body.ast())
  },
  SimpleStmt_letdec(id, _, type, exp) {
    return new VarDeclaration(id.ast(), type.ast(), exp.ast())
  },
  SimpleStmt_constdec(id, _isKeyword, _alwaysKeyword, type, exp) {
    // TODO: always functionality implemented here? may be implemented now
    return new VarDeclaration(id.ast(), true, type.ast(), exp.ast())
  },
  SimpleStmt_print(_displayKeyword, exp) {
    return new Print(exp.ast())
  },
  Param(id, _isKeyword, type) {
    return new Param(id.ast(), type.ast())
  },
  Call(callName, _1, args, _2) {
    return new Call(callName.ast(), args.ast())
  },
  id(_1, _2) {
    return this.sourceString
  },
  KeyValue(id, _, exp) {
    return new KeyValueExpression(id.ast(), exp.ast())
  },

  // Expressions
  Exp_ternary(testExp, _1, returnOnTrue, _2, returnOnFalse) {
    return new IfStmt(test.ast(), returnOnTrue.ast(), returnOnFalse.ast())
  },
  Exp0_or(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp0_and(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp1_binary(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp2_binary(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp3_binary(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp4_pow(left, _, right) {
    return new PowExp(left, right)
  },
  Exp4_binary(left, op, right) {
    return new BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp5_postfix(operand, op) {
    return new PostfixExpression(operand.ast(), op.ast())
  },
  Exp5_prefix(op, operand) {
    return new PrefixExpression(op.ast(), operand.ast())
  },
  Exp5_parens(_1, expression, _2) {
    return expression.ast()
  },
  Exp5_list(_1, expressions, _2) {
    return new ListExpression(expressions.ast())
  },
  Exp5_set(_1, expressions, _2) {
    return new SetExpression(expressions.ast())
  },

  Exp5_dict(_1, keyValue, _2) {
    return new DictExpression(keyValue.ast())
  },
  VarExp_field(id, _dotOperator, field) {
    return new FieldVarExp(id.ast(), field.ast())
  },
  VarExp_subscripted(id, _open, key, _close) {
    return new SubscriptedVarExp(id.ast(), key.ast())
  },
  VarExp_simple(id) {
    return new IdentifierExpression(id.ast())
  },

  // Types
  ListType(_1, type, _2) {
    return new ListType(type.ast())
  },
  SetType(_1, type, _2) {
    return new SetType(type.ast())
  },
  DictType(_1, keyType, _2, valueType, _3) {
    return new DictType(keyType.ast(), valueType.ast())
  },

  // literals
  numlit(_1, _2, _3, _4, _5, _6) {
    return new NumericLiteral(+this.sourceString)
  },
  txtlit(_1, chars, _2) {
    return new TextLiteral(chars.ast) // this.sourceString() needed here?
  },
  boollit(_) {
    return new BooleanLiteral(this.sourceString === 'true')
  },
})
