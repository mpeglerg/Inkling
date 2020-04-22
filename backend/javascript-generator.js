/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * Tiger expression, bundling the translation of the Tiger standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator')
 *   generate(tigerExpression)
 */

const beautify = require('js-beautify')
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
const {
  NumType,
  BoolType,
  TextType,
  NoneType,
} = require('../semantics/builtins')

function makeOp(op) {
  return {
    '==': '===', '!=': '!==', 'and': '&&', 'or': '||'
  }[op] || op
}

// javaScriptId(e) takes any Tiger object with an id property, such as a Variable,
// Param, or Func, and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular entity.
const javaScriptId = (() => {
  let lastId = 0
  const map = new Map()
  return (v) => {
    if (!map.has(v)) {
      map.set(v, ++lastId) // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`
  }
})()

let indentLevel = 0

// Let's inline the built-in functions, because we can!
const builtin = {
  display([s]) {
    return `console.log(${s})`
  },
  exit(code) {
    return `process.exit(${code})`
  },
  slice([s, begin, end]) {
    return `${s}.substr(${begin}, ${end})`
  },
  length([s]) {
    return `${s}.length`
  },
  charAt([s, i]) {
    return `${s}.charAt(${i})`
  },
  abs([x]) {
    return `Math.abs(${x})`
  },
  sqrt([x]) {
    return `Math.sqrt(${x})`
  },
  random([start, end]) {
    return `(Math.random()*(${end} - ${start}) + ${start})`
  },
  pow([base, power]) {
    return `${base}**${power})`
  },
  // TODO: The list, set, and dict builtins are strange because they are methods,
  // might need to change them to take extra list, set, dict as input
}

module.exports = function (exp) {
  return beautify(exp.gen(), { indentSize: 2 })
}

// This only exists because Tiger is expression-oriented and JavaScript is not.
// It's pretty crazy! In the case where the expression is actually a sequence,
// we have to dig in and stick a 'return' before the last expression. And this
// as to be recursive, because the last expression of a sequence could actually
// be a sequence....
// function makeReturn(exp) {
//   if (exp.constructor === VarDeclaration) {
//     const filteredDecs = exp.decs.filter((d) => d.constructor !== TypeDec)
//     const all = [...filteredDecs, ...exp.body.slice(0, -1)].map((e) => e.gen())
//     all.push(makeReturn(exp.body[exp.body.length - 1]))
//     return all.join('')
//   }
//   if (exp.constructor === ExpSeq) {
//     const generated = exp.exps.slice(0, -1).map(e => e.gen())
//     generated.push(makeReturn(exp.exps[exp.exps.length - 1]))
//     return generated.join('')
//   }
//   return `return ${exp.gen()}`
// }

Program.prototype.gen = function () {
  indentLevel = 0
  console.log(`${' '.repeat(indentSize * indentLevel)}${'function () {'}`)
  this.block.gen()
  console.log(`${' '.repeat(indentSize * indentLevel)}${'}'}`)
}

Block.prototype.gen = function () {
  indentLevel += 1
  this.statements.forEach(s => s.gen())
  indentLevel -= 1
}

Assignment.prototype.gen = function () {
  return `${this.target.gen()} = ${this.source.gen()}`
}

VarDeclaration.prototype.gen = function () {
  return `${javaScriptId(this)} is ${this.init.gen()}`
}

ListExpression.prototype.gen = function () {
  return `Array(${this.size.gen()}).fill(${this.fill.gen()})`
}

BinaryExpression.prototype.gen = function () {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`
}

Call.prototype.gen = function () {
  const args = this.args.map((a) => a.gen())
  if (this.callee.builtin) {
    return builtin[this.callee.id](args)
  }
  return `${javaScriptId(this.callee)}(${args.join(',')})`
}

ForLoop.prototype.gen = function () {
  const i = javaScriptId(this.id)
  const loopControl = `for (let ${i} in ${this.collection})`
  const body = this.body.gen()
  return `${loopControl} {${body}}`
}

FuncDecStmt.prototype.gen = function () {
  const name = javaScriptId(this)
  const params = this.params.map(javaScriptId)
  // "Void" functions do not have a JS return, others do
  const body = this.body.gen()
  return `function ${name} (${params.join(',')}) {${body}}`
}

IdentifierExpression.prototype.gen = function () {
  return javaScriptId(this.ref)
}

IfStmt.prototype.gen = function () {
  let result = `if (${this.tests[0].gen()}) {${this.consequence[0].gen()}}`
  for (let i = 1; i < this.tests.length; i += 1) {
    result = result.concat(`else if (${this.tests[i].gen()}) {${this.consequence[i].gen()}}`)
  }
  if (this.alt !== undefined) {
    result.concat(`else {${this.alt.gen()}}`)
  }
  return result
}

Literal.prototype.gen = function () {
  return this.type === TextType ? `"${this.value}"` : this.value
}

// We never implemented field expressions past the grammar so we dont need this
// MemberExp.prototype.gen = function() {
//   return `${this.record.gen()}.${this.id}`
// }

SubscriptedVarExp.prototype.gen = function () {
  return `${this.id.gen()}[${this.key.gen()}]`
}

PrefixExpression.prototype.gen = function () {
  return `(${this.op}(${this.operand.gen()}))`
}
PostfixExpression.prototype.gen = function () {
  return `(((${this.operand.gen()})${this.op}))`
}

None.prototype.gen = function () {
  return 'none'
}

WhileLoop.prototype.gen = function () {
  return `while (${this.condition.gen()}) { ${this.body.gen()} }`
}
