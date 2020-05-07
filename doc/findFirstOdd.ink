function findFirstOdd(x is Num) is Num {
  for i in [0, 1, 2, 3, x] {  btw: should use range(0,x) but range not currently working :(
    if (i % 2 != 0) {
      gimme i
    }
  }
  gimme none
}
