1.NSProxy:NSProxy 是一个抽象类,它接收到任何自己没有定义的方法他都会产生一个异常,所以一个实际的子类必须提供一个初始化方法或者创建方法，并且重载forwardInvocation:方法和methodSignatureForSelector:方法来处理自己没有实现的消息。
从类名来看是代理类,专门负责代理对象转发消息的。相比NSObject类来说NSProxy更轻量级，通过NSProxy可以帮助Objective-C间接的实现多重继承的功能。
可实现计时器内存泄漏问题：http://www.cnblogs.com/HJQ2016/p/5928801.html

2.系统是如何check实例是否能response消息呢？如果实例本身就有相应的response,那么就会相应之，如果没有系统就会发出methodSignatureForSelector消息，寻问它这个消息是否有效？有效就返回对应的方法地址之类的，无效则返回nil。
如果是nil就会crash， 如果不是nil接着发送forwardInvocation消息。
- (void)forwardInvocation:(NSInvocation *)anInvocation 

APPdelegate的轻量级应用：
https://github.com/alexsun/MLSOAppDelegate

http://mp.weixin.qq.com/s?__biz=MzA4MjI0NjczNQ==&mid=2652365157&idx=1&sn=f5bfa3b95e4e6d84a05ada1d155c26d7&chksm=846bec45b31c65535953c43963d04f70b0bc263217ab650e7d1dab7a1f4c443420e2bb83cf7e&scene=0#wechat_redirect
