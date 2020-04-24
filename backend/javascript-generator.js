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
  Program, // done
  Block, // done
  Assignment, // done
  VarDeclaration, // done
  Print, // done
  Literal, // done
  BinaryExpression, // done
  IfStmt, // done
  WhileLoop, // done
  FuncDecStmt, // done
  FuncObject, // idk if we need a generator for this
  Call, // done
  Param, // done
  DictExpression, // done
  SetExpression, // done
  ListExpression, // done
  ReturnStatement, // done
  IdentifierExpression, // done
  PostfixExpression, // done
  PrefixExpression, // done
  ForLoop, // done
  Ternary, // done
  None, // done
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

// whats going on with this indent stuff?
// I was using Iki as a guide for program and there was an indent level. Prolly dont need it.
let indentLevel = 0

// Let's inline the built-in functions, because we can!
const builtin = {
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
  // I think this is incorrect- needs work
  indentLevel = 0
  // console.log(`${' '.repeat(indentSize * indentLevel)}${'function () {'}`)
  return this.stmts.map((s) => s.gen()).join('')
  // console.log(`${' '.repeat(indentSize * indentLevel)}${'}'}`)
}
// We don't need print because we have display in builtins

Block.prototype.gen = function () {
  indentLevel += 1
  indentLevel -= 1
  const statements = this.statements.forEach((s) => s.gen())
  return statements.join('')
}

Assignment.prototype.gen = function () {
  // We need to use target and source because thats what they are called in the ast
  return `${this.target.gen()} = ${this.source.gen()}`
}

VarDeclaration.prototype.gen = function () {
  return `let ${javaScriptId(this)} = ${this.init.gen()}`
}

Print.prototype.gen = function () {
  return `console.log(${this.exp.gen()})`
}

// I don't know about this one
DictExpression.prototype.gen = function () {
  const result = {}
  // JS can't map over objects AFAIK so we have to map over the keys and assign
  // the keys and values in a new object
  this.exp.map((pair) => { result[pair.key.gen()] = pair.value.gen() })
  return `${result}`
}

// I dont know about this one
SetExpression.prototype.gen = function () {
  let result = new Set()
  this.members.map((member) => result.add(member.gen()))
  return `${result}`
}

ListExpression.prototype.gen = function () {
  return `${this.members.map((m) => m.gen())}`
  // return `Array(${this.size.gen()}).fill(${this.fill.gen()})`
}

BinaryExpression.prototype.gen = function () {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`
}

Call.prototype.gen = function () {
  const args = this.args.map((a) => a.gen())
  if (this.id.builtin) {
    return builtin[this.id.id](args)
  }
  return `${javaScriptId(this.id.gen())}(${args.join(',')})`
}

Param.prototype.gen = function () {
  return javaScriptId(this.id)
}

ForLoop.prototype.gen = function () {
  const i = javaScriptId(this.id)
  const loopControl = `for (let ${i} in ${this.collection})`
  const body = this.body.gen()
  return `${loopControl} {${body}}`
}

FuncDecStmt.prototype.gen = function () {
  const name = javaScriptId(this.id)
  const params = this.params.map((param) => param.gen())
  // "Void" functions do not have a JS return, others do
  const body = this.body.gen()
  return `function ${name} (${params.join(',')}) {${body}}`
}

ReturnStatement.prototype.gen = function () {
  return `return ${this.returnValue.gen()}`
}

IdentifierExpression.prototype.gen = function () {
  return javaScriptId(this.id)
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
  return `(((${this.operand})${this.op.gen()}))`
}

Ternary.prototype.gen = function () {
  return `${this.test.gen()} ? ${this.consequence.gen()} : ${this.alt.gen()}`
}

None.prototype.gen = function () {
  return 'null'
}

WhileLoop.prototype.gen = function () {
  // p sure we need to use condition instead of exp here because its called condition in the ast
  return `while (${this.condition.gen()}) { ${this.body.gen()} }`
  // return `while (${this.exp.gen()}) { ${this.body.gen()} }`
}

SubscriptedVarExp.prototype.gen = function () {
  return `${this.id.gen()}[${this.key.gen()}]`
}
