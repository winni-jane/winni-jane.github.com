1.block默认在栈上分配，一般类的实例对象在堆上分配。<br/>
2.对于Global的Block，我们无需多处理，不需retain和copy，因为即使你这样做了，似乎也不会有什么两样
。对于Stack的Block，如果不做任何操作，就会向上面所说，随栈帧自生自灭。而如果想让它获得比stack frame更久，那就调用Block_copy()，让它搬家到堆内存上。
而对于已经在堆上的block，也不要指望通过copy进行“真正的copy”，因为其引用到的变量仍然会是同一份，在这个意义上看，这里的copy和retain的作用已经非常类似。<br/>
3.在类中，如果有block对象作为property，可以声明为copy。<br/>
4. 在block中调用self会引起循环引用，但是在block中需要对weakSelf进行strong,保证代码在执行到block中，self不会被释放，当block执行完后，会自动释放该strongSelf .

