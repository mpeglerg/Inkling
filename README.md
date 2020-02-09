# Inkling: An Intuitive Programming Language

<p align="center"><img src="images/logo-inkling.png" alt="inkling logo" width="350"/></p>

## Introduction

You may not know this, but you already know inkling. Inkling is a programming language that lets you follow your gut- you learn to program by doing what makes sense to you while learning to shift your thinking to grow as a programmer and as a thinker. Speak the language you code. Type what you want to say. Where will your inkling take you today?

Created by Marco B, Cooper LaRhette, Veda Ashok, Sam Gibson, Maya Pegler-Gordon, and Talia Bahar

# Features

- Simple and easy
- Statically typed
- Case sensitive
- Arrow functions

## Types

- Num
- Text
- List
- Bool
- Dict
- Set

## Operators

- Add: `+`
- Subtract: `-`
- Multiply: `*`
- Divide: `/`
- Modulo: `%`
- Less than or equal: `<=`
- Less than: `<`
- Greater than or equal: `>=`
- Greater than: `>`
- Equal: `==`
- Not equal: `!=`
- Decrement prefix: `--variable`
- Increment prefix: `++variable`
- Negate: `-variable`
- Not: `!variable`
- Decrement postfix: `variable--`
- Increment postfix: `variable++`
- Logical AND: `and`
- Logical OR: `or`

## Variable Declaration

```x is Num 5
y is Text “Hello World!”
z is always Num 10
```

## Variable Assignment

```x is 7
y is “Inkling is amazing”
```

## Function Declaration

```
function helloWorld() Text {
    gimme "Hello world"
}

function countToX(x is Num) {
    for i is Num in range(0, x) {
        display i
    }
}
```

## Ternary

`x < 0 ? gimme "negative" : gimme "positive"`

## Conditional

```
if (x % 3 == 0) {
    display "multiple of 3"
}
```

## Loops

#### For Loop

```
for i is Num in range(0,10) {
    btw: for-loop execution
}
```

#### While Loop

```
while (x < 0) {
    btw: while-loop execution
}
```

## Comments

```btw: this is how you leave a single-line comment

fyi: if you need to leave a multi-line
     you can leave it like this :xoxo
```

# Code Examples

### Fibonacci Program

#### Inkling Example

```
function fibonacci(x is Num) is Num {
    if(x <= 1) {
        gimme x
    }
    gimme fibonacci(x - 1) + fibonacci(x - 2)
}
```

#### JavaScript Example

```
function fibonacci(x) {
    if (x <= 1) {
        return x;
    }
    return fibonacci(x - 1) + fibonacci(x - 2);
}
```

### Find Factorial Program

#### Inkling Example

```
function findFactorial(x is Num) is Num {
    if(x == 0 or x == 1) {
        gimme x
    }
    gimme x * findFactorial(x - 1)
}
```

#### JavaScript Example

```
function findFactorial(x) {
    if (x === 0 || x === 1) {
        return x;
    }
    return x * firstFactorial(x - 1);
}
```

### Fizzbuzz Program

#### Inkling Example

```
function fizzbuzz(x is Num) is void {
    for i is Num in range(0,x) {
        if (i%3 == 0 and i%5 == 0) {
            display "fizzbuzz"
        } else if (i % 3 == 0) {
            display "fizz"
        } else if (i % 5 == 0) {
            display "buzz"
        } else {
            display i
        }
    }
}
```

#### JavaScript Example

```
function  fizzBuzz(x) {
    for (let  i = 1; i <= x; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log("fizzbuzz");
        } else  if (i % 3 === 0) {
            console.log("fizz");
        } else  if (i % 5 === 0) {
            console.log("buzz");
        } else {
            console.log(i);
        }
    }
}
```

### Is Prime Program

#### Inkling Example

```
function isPrime(x is Num) is Num {
    start is Num 2
    while(start <= x^0.5) {
        if (x % start++ < 1) {
            gimme false
        }
    }
    gimme x > 1
}
```

#### JavaScript Example

```
function  isPrime(x) {
    var start = 2;
    while (start <= Math.sqrt(x)) {
        if (x % start++ < 1) {
            return false;
        }
    }
    return x > 1;
}
```

### Find Greatest Program

#### Inkling Example

```
function findGreatest(a is Num, b is Num, c is Num) is Num {
    if (a >= b and a >= c) {
        gimme x
    } else if (b >= a and b >= c) {
        gimme b
    } else {
        gimme c
    }
}
```

#### JavaScript Example

```
function  findGreatest(a, b, c) {
    if (a >= b && a >= c) {
        return x;
    } else if ( b >= a && b >= c) {
        return b;
    } else {
        return c;
    }
}
```
