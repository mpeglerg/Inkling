function test(x is Num) is Bool {
  start is Num 2
  while (start <= pow(x, 0.5)) {
    if (x % start++ < 1) {
      gimme false
    }
  }
  gimme x > 1
}

u is Num -3

test(3+4)
test(0-1)
test(3 + u)

if (2 < 3) {
  display 2
}
