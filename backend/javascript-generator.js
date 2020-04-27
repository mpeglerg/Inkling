/* eslint func-names: ["error", "never"] */
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
  FuncObject, // idk if we need a generator for this --> I dont think we need it
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
  TextType,
} = require('../semantics/builtins')

function makeOp(op) {
  return (
    {
      '==': '===',
      '!=': '!==',
      and: '&&',
      or: '||',
    }[op] || op
  )
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
    return `${v}_${map.get(v)}`
  }
})()

// Let's inline the built-in functions, because we can!
const builtin = {
  xProcess(code) {
    return `process.exit(${code})`
  },
  slice([s, begin, end]) {
    return `${s}.slice(${begin}, ${end})`
  },
  length([s]) {
    return `${s}.length`
  },
  charAt([s, i]) {
    return `${s}.charAt(${i})`
  },
  abs([x]) {
    const num = `${x}`.replace(/[()]/g, '')
    return `Math.abs(${num})`
  },
  sqrt([x]) {
    return `Math.sqrt(${x})`
  },
  random([start, end]) {
    return `Math.floor(Math.random() * ${end} + ${start})`
  },
  pow([base, power]) {
    return `${base}**${power}`
  },
  add([listId, value]) {
    return `${listId.replace(/[''""]/g, '')}.push(${value})`
  },
  insert([listId, index, value]) {
    return `${listId.replace(/[''""]/g, '')}.splice(${index}, 0, ${value})`
  },
  prepend([listId, value]) {
    return `${listId.replace(/[''""]/g, '')}.prepend(${value})`
  },
  remove([listId]) {
    return `${listId.replace(/[''""]/g, '')}.pop()`
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
  return this.stmts.map((s) => s.gen()).join('')
}

// DONE tested
Literal.prototype.gen = function () {
  return this.type === TextType ? `"${this.value}"` : this.value
}

Assignment.prototype.gen = function () {
  return `${this.target.gen()} = ${this.source.gen()}`
}

IdentifierExpression.prototype.gen = function () {
  if (typeof this.id === 'object') {
    return `${this.id.gen()}`
  }
  return `${javaScriptId(this.id)}`
}
VarDeclaration.prototype.gen = function () {
  if (!this.constant) {
    return `let ${javaScriptId(this.id)} = ${this.exp.gen()}`
  }
  return `const ${javaScriptId(this.id)} = ${this.exp.gen()}`
}

Print.prototype.gen = function () {
  return `console.log(${this.exp.gen()})`
}

DictExpression.prototype.gen = function () {
  const result = {}
  const keys = this.exp.map((key) => key.key.gen())
  const values = this.exp.map((val) => val.value.gen())
  keys.forEach((key, index) => { result[key] = values[index] })
  return `{ ${keys.map((k, i) => `${k}: ${values[i]}`).join(', ')} }`
}

PrefixExpression.prototype.gen = function () {
  return `(${this.op}(${this.operand.gen()}))`
}

BinaryExpression.prototype.gen = function () {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`
}

SetExpression.prototype.gen = function () {
  return `new Set(${this.members.map((member) => member.gen())})`
}

Block.prototype.gen = function () {
  const statements = this.statements.map((s) => s.gen())
  return statements.join('')
}

ListExpression.prototype.gen = function () {
  return `[${this.members.map((m) => m.gen())}]`
}

Call.prototype.gen = function () {
  const args = this.args.map((a) => a.gen())
  if (this.callee.builtin) {
    return builtin[this.callee.id](args)
  }
  return `${this.id.gen()}(${args.join()})`
}

Param.prototype.gen = function () {
  return javaScriptId(this.id)
}

ForLoop.prototype.gen = function () {
  // const i = javaScriptId(this);
  /* idk if we want to use javaScriptId here since the id is localized to this for loop,
   * may be wrong tho
   * i think our for loop is most similar to js for-of, not for-in; definitely up for debate tho */
  const i = javaScriptId(this.id)
  const loopControl = `for (let ${i} of ${this.collection.gen()})`
  const body = this.body.gen()
  return `${loopControl} {${body}}`
}

FuncDecStmt.prototype.gen = function () {
  const name = javaScriptId(this.id)
  // "Void" functions do not have a JS return, others do
  const funcObj = this.function.gen()
  return `function ${name} ${funcObj}`
}

FuncObject.prototype.gen = function () {
  const params = `${this.params.map((param) => param.gen())}`
  const body = this.body.gen()
  return `( ${params} ){${body} }`
}

ReturnStatement.prototype.gen = function () {
  return `return ${this.returnValue.gen()}`
}

IfStmt.prototype.gen = function () {
  let result = `if (${this.tests[0].gen()}) {${this.consequence[0].gen()}}`
  for (let i = 1; i < this.tests.length; i += 1) {
    result = result.concat(
      `else if (${this.tests[i].gen()}) {${this.consequence[i].gen()}}`,
    )
  }
  // we need to check if this.alt is null because if it is then alt.gen() will throw an error
  if (this.alt) {
    result = result.concat(`else {${this.alt.gen()}}`)
  }
  return result
}

SubscriptedVarExp.prototype.gen = function () {
  return `${this.id.gen()}[${this.key.gen()}]`
}

PostfixExpression.prototype.gen = function () {
  return `(((${this.operand.gen()})${this.op}))`
}

Ternary.prototype.gen = function () {
  return `${this.test.gen()} ? ${this.consequence.gen()} : ${this.alt.gen()}`
}

None.prototype.gen = function () {
  return 'null'
}

WhileLoop.prototype.gen = function () {
  return `while (${this.condition.gen()}) { ${this.body.gen()} }`
}
