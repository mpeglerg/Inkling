class Context {
  constructor({ parent = null, currentFunction = null, inLoop = false } = {}) {
    Object.assign(this, {
      parent,
      currentFunction,
      inLoop,
      declarations: Object.create(null),
      typeMap: Object.create(null),
    });
  }

  createChildContextForFunctionBody(currentFunction) {
    return new Context({ parent: this, currentFunction, inLoop: false });
  }

  createChildContextForLoop() {
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: true,
    });
  }

  createChildContextForBlock() {
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: this.inLoop,
    });
  }

  add(entity, id) {
    if ((id || entity.id) in this.declarations) {
      throw new Error(`${id} already declared in this scope`);
    }
    this.declarations[id || entity.id] = entity;
  }

  lookupValue(id) {
    for (let context = this; context !== null; context = context.parent) {
      if (id in context.declarations) {
        return context.declarations[id];
      }
    }
    throw new Error(`Identifier ${id} has not been declared`);
  }

  assertInFunction(message) {
    if (!this.currentFunction) {
      throw new Error(message);
    }
  }
}
