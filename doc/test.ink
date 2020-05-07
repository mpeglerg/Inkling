function test(x is Num) is Bool {
  start is Num 2
  while (start <= pow(x, 0.5)) {
    if (x % start++ < 1) {
      gimme false
    }
  }
  gimme x > 1
}
