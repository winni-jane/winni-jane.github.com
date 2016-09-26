1.当 repeat 为 YES 时NSTimer 会 retains 它的 target，那么target的生命周期就成了问题，完全的交给了这个timer，只有当timer 调用invalidate后 dealloc 才有机会发生。
2.invalidate必须由安装这个timer的线程发起，否则这个timer有可能不会从run loop中移除。这种情况会发生的一个情况就是： 当这个线程是由 GCD 管理的。 这是因为 NSTimer 依赖于当前线程的run loop, 而GCD完全是另外一回事， 它不能确保timer的阻塞和invalidate是由同一个线程发起的， run loop和queue将会交织在一起，世界就乱了...
3.https://www.mgenware.com/blog/?p=459
4.http://www.jianshu.com/p/2287344894ae
5.GCD的NSTimer
http://mobile.51cto.com/iphone-306907_2.htm
