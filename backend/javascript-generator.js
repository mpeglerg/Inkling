/* eslint func-names: ["error", "never"] */
/*
 * Translation to JavaScript
 *
 *   Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator')
 *   generate(inklingExpression)
 */

const beautify = require('js-beautify')
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
  range([start, end]) {
    return `Array(${end} - ${start} + 1).fill().map((_, idx) => ${start} + idx)`
  },
}

module.exports = function (exp) {
  return beautify(exp.gen(), { indentSize: 2 })
}

Program.prototype.gen = function () {
  return this.stmts.map((s) => `${s.gen()};`).join('')
}

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
  for (let i = 0; i < keys.length; i += 1) {
    result[keys[i]] = values[i]
  }
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
  const statements = this.statements.map((s) => `${s.gen()};`)
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
  const i = javaScriptId(this.id)
  const loopControl = `for (let ${i} of ${this.collection.gen()})`
  const body = this.body.gen()
  return `${loopControl} {${body}}`
}

FuncDecStmt.prototype.gen = function () {
  const name = javaScriptId(this.id)
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
