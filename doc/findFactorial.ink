function findFactorial(x is Num) is Num {
  if (x == 0 or x == 1) {
    gimme x
  }
  gimme x * findFactorial(x - 1)
}
