/*
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase.
 *
 *   const Context = require('./semantics/context');
 */

const {
  standardFunctions, mathFunctions, stringFunctions, NumType, TextType, BoolType, NoneType,
} = require('./builtins')

require('./analyzer')

// When doing semantic analysis we pass around context objects.
//
// A context object holds:
//
//   1. A reference to the parent context (or null if this is the root context).
//      This allows to search for declarations from the current context outward.
//
//   2. A reference to the current function we are analyzing, if any. If we are
//      inside a function, then return expressions are legal, and we will be
//      able to type check them.
//
//   3. Whether we are in a loop (to know that a `break` is okay).
//
//   4. A map for looking up all identifiers declared in this context.

class Context {
  constructor({ parent = null, currentFunction = null, inLoop = false } = {}) {
    Object.assign(this, {
      parent,
      currentFunction,
      inLoop,
      declarations: Object.create(null),
      typeMap: Object.create(null),
    })
  }

  createChildContextForFunctionBody(currentFunction) {
    return new Context({
      parent: this,
      currentFunction,
      inLoop: false,
    })
  }

  createChildContextForLoop() {
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: true,
    })
  }

  createChildContextForBlock() {
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: this.inLoop,
    })
  }

  add(entity, id) {
    if ((id || entity.id) in this.declarations) {
      throw new Error(`${id} already declared in this scope`)
    }
    this.declarations[id || entity.id] = entity
  }

  lookupValue(id) {
    for (let context = this; context !== null; context = context.parent) {
      if (id in context.declarations) {
        return context.declarations[id]
      }
    }
    throw new Error(`Identifier ${id} has not been declared`)
  }

  assertInFunction(message) {
    if (!this.currentFunction) {
      throw new Error(message)
    }
  }
}

Context.INITIAL = new Context();
[
  NumType,
  TextType,
  BoolType,
  NoneType,
  ...standardFunctions,
  ...mathFunctions,
  ...stringFunctions].forEach((entity) => {
  Context.INITIAL.add(entity)
})

module.exports = Context
