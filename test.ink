function findGreatest(a is Num, b is Num, c is Num) is Num {
    x is Bool true
    if (a >= b and a >= c) {
        gimme a
    } else if (b >= a and b >= c) {
        gimme b
    } else {
        gimme c
    }
    gimme 3
}

function testBang() is Text {
    x is Bool true
    if (!x == false) {
        gimme "bang work!"
    } else {
        gimme "bang broke"
    }
    gimme "a"
}

function testPrefixOp() is Text {
    x is Num 0
    if (++x == 1) {
        gimme "++ work!"
    } else {
        gimme "++ broke"
    }
    gimme "hello"
}
x is Num 5
x is -x
x is -5
x is findGreatest(x, 2, 3)
