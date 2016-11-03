1.通过NSThread的currentThread可以取得当前操作的线程，其中会记录线程名称name和编号number，需要注意主线程编号永远为1。多个线程虽然按顺序启动，但是实际执行未必按照顺序加载照片（loadImage:方法未必依次创建，可以通过在loadImage:中打印索引查看），因为线程启动后仅仅处于就绪状态，实际是否执行要由CPU根据当前状态调度。
2.线程优先级范围为0~1，值越大优先级越高，
3.在线程操作过程中可以让某个线程休眠等待，优先执行其他线程操作，而且在这个过程中还可以修改某个线程的状态或者终止某个指定线程。为了解决上面优先加载最后一张图片的问题，不妨让其他线程先休眠一会等待最后一个线程执行。修改图片加载方法如下即可：
-(NSData *)requestData:(int )index{
    //对非最后一张图片加载线程休眠2秒
    if (index!=(ROW_COUNT*COLUMN_COUNT-1)) {
        [NSThread sleepForTimeInterval:2.0];
    }
    NSURL *url=[NSURL URLWithString:_imageNames[index]];
    NSData *data=[NSData dataWithContentsOfURL:url];

    return data;
}
在这里让其他线程休眠2秒，此时你就会看到最后一张图片总是第一个加载（除非网速特别差）。

线程状态分为isExecuting（正在执行）、isFinished（已经完成）、isCancellled（已经取消）三种。其中取消状态程序可以干预设置，只要调用线程的cancel方法即可。但是需要注意在主线程中仅仅能设置线程状态，并不能真正停止当前线程，如果要终止线程必须在线程中调用exist方法，这是一个静态方法，调用该方法可以退出当前线程。
4.使用NSOperation和NSOperationQueue进行多线程开发类似于C#中的线程池，只要将一个NSOperation（实际开中需要使用其子类NSInvocationOperation、NSBlockOperation）放到NSOperationQueue这个队列中线程就会依次启动。NSOperationQueue负责管理、执行所有的NSOperation，在这个过程中可以更加容易的管理线程总数和控制线程之间的依赖关系。

NSOperation有两个常用子类用于创建线程操作：NSInvocationOperation和NSBlockOperation，两种方式本质没有区别，但是是后者使用Block形式进行代码组织，使用相对方便。
 NSInvocationOperation *invocationOperation=[[NSInvocationOperation alloc]initWithTarget:self selector:@selector(loadImage) object:nil];
    //创建完NSInvocationOperation对象并不会调用，它由一个start方法启动操作，但是注意如果直接调用start方法，则此操作会在主线程中调用，一般不会这么操作,而是添加到NSOperationQueue中
//    [invocationOperation start];
    
    //创建操作队列
    NSOperationQueue *operationQueue=[[NSOperationQueue alloc]init];
    //注意添加到操作队后，队列会开启一个线程执行此操作
    [operationQueue addOperation:invocationOperation];
 [[NSOperationQueue mainQueue] addOperationWithBlock:^{
        [self updateImageWithData:data andIndex:i];
    }];
5.锁
@property (atomic,strong) NSMutableArray *imageNames;
要解决资源抢夺问题在iOS中有常用的有两种方法：一种是使用NSLock同步锁，另一种是使用@synchronized代码块。两种方法实现原理是类似的，只是在处理上代码块使用起来更加简单。
另外，在上面的代码中”抢占资源“_imageNames定义成了成员变量，这么做是不明智的，应该定义为“原子属性”。对于被抢占资源来说将其定义为原子属性是一个很好的习惯，因为有时候很难保证同一个资源不在别处读取和修改。nonatomic属性读取的是内存数据（寄存器计算好的结果），而atomic就保证直接读取寄存器的数据，这样一来就不会出现一个线程正在修改数据，而另一个线程读取了修改之前（存储在内存中）的数据，永远保证同时只有一个线程在访问一个属性。
//初始化锁对象
    _lock=[[NSLock alloc]init];
   //加锁
    [_lock lock];
    if (_imageNames.count>0) {
        name=[_imageNames lastObject];
        [_imageNames removeObject:name];
    }
    //使用完解锁
    [_lock unlock];
    前面也说过使用同步锁时如果一个线程A已经加锁，线程B就无法进入。那么B怎么知道是否资源已经被其他线程锁住呢？可以通过tryLock方法，此方法会返回一个BOOL型的值，如果为YES说明获取锁成功，否则失败。另外还有一个lockBeforeData:方法指定在某个时间内获取锁，同样返回一个BOOL值，如果在这个时间内加锁成功则返回YES，失败则返回NO。
    （2）
     //线程同步
    @synchronized(self){
        if (_imageNames.count>0) {
            name=[_imageNames lastObject];
            [NSThread sleepForTimeInterval:0.001f];
            [_imageNames removeObject:name];
        }
    }
    （3）扩展--使用GCD解决资源抢占问题
    在GCD中提供了一种信号机制，也可以解决资源抢占问题（和同步锁的机制并不一样）。GCD中信号量是dispatch_semaphore_t类型，支持信号通知和信号等待。每当发送一个信号通知，则信号量+1；每当发送一个等待信号时信号量-1,；如果信号量为0则信号会处于等待状态，直到信号量大于0开始执行。根据这个原理我们可以初始化一个信号量变量，默认信号量设置为1，每当有线程进入“加锁代码”之后就调用信号等待命令（此时信号量为0）开始等待，此时其他线程无法进入，执行完后发送信号通知（此时信号量为1），其他线程开始进入执行，如此一来就达到了线程同步目的。
     dispatch_semaphore_t _semaphore;//定义一个信号量
      /*初始化信号量
     参数是信号量初始值
     */
      _semaphore=dispatch_semaphore_create(1);
      /*信号等待
     第二个参数：等待时间
     */
    dispatch_semaphore_wait(_semaphore, DISPATCH_TIME_FOREVER);
    if (_imageNames.count>0) {
        name=[_imageNames lastObject];
        [_imageNames removeObject:name];
    }
    //信号通知
    dispatch_semaphore_signal(_semaphore);
    （4）由于线程的调度是透明的，程序有时候很难对它进行有效的控制，为了解决这个问题iOS提供了NSCondition来控制线程通信(同前面GCD的信号机制类似)。NSCondition实现了NSLocking协议，所以它本身也有lock和unlock方法，因此也可以将它作为NSLock解决线程同步问题，此时使用方法跟NSLock没有区别，只要在线程开始时加锁，取得资源后释放锁即可，这部分内容比较简单在此不再演示。当然，单纯解决线程同步问题不是NSCondition设计的主要目的，NSCondition更重要的是解决线程之间的调度关系（当然，这个过程中也必须先加锁、解锁）。NSCondition可以调用wati方法控制某个线程处于等待状态，直到其他线程调用signal（此方法唤醒一个线程，如果有多个线程在等待则任意唤醒一个）或者broadcast（此方法会唤醒所有等待线程）方法唤醒该线程才能继续。
     NSCondition *_condition;
    //初始化锁对象
    _condition=[[NSCondition alloc]init];
    
     [_condition lock];
    //如果当前已经有图片了则不再创建，线程处于等待状态
    if (_imageNames.count>0) {
        NSLog(@"createImageName wait, current:%i",_currentIndex);
        [_condition wait];
    }else{
        NSLog(@"createImageName work, current:%i",_currentIndex);
        //生产者，每次生产1张图片
        [_imageNames addObject:[NSString stringWithFormat:@"http://images.cnblogs.com/cnblogs_com/kenshincui/613474/o_%i.jpg",_currentIndex++]];
        
        //创建完图片则发出信号唤醒其他等待线程
        [_condition signal];
    }
    [_condition unlock];
    （6）
    iOS中的其他锁

在iOS开发中，除了同步锁有时候还会用到一些其他锁类型，在此简单介绍一下：

NSRecursiveLock ：递归锁，有时候“加锁代码”中存在递归调用，递归开始前加锁，递归调用开始后会重复执行此方法以至于反复执行加锁代码最终造成死锁，这个时候可以使用递归锁来解决。使用递归锁可以在一个线程中反复获取锁而不造成死锁，这个过程中会记录获取锁和释放锁的次数，只有最后两者平衡锁才被最终释放。

NSDistributedLock：分布锁，它本身是一个互斥锁，基于文件方式实现锁机制，可以跨进程访问。

pthread_mutex_t：同步锁，基于C语言的同步锁机制，使用方法与其他同步锁机制类似。
提示：在开发过程中除非必须用锁，否则应该尽可能不使用锁，因为多线程开发本身就是为了提高程序执行顺序，而同步锁本身就只能一个进程执行，这样不免降低执行效率。
（7）总结
1>无论使用哪种方法进行多线程开发，每个线程启动后并不一定立即执行相应的操作，具体什么时候由系统调度（CPU空闲时就会执行）。

2>更新UI应该在主线程（UI线程）中进行，并且推荐使用同步调用，常用的方法如下：

    - (void)performSelectorOnMainThread:(SEL)aSelector withObject:(id)arg waitUntilDone:(BOOL)wait (或者-(void)performSelector:(SEL)aSelector onThread:(NSThread *)thr withObject:(id)arg waitUntilDone:(BOOL) wait;方法传递主线程[NSThread mainThread])
    [NSOperationQueue mainQueue] addOperationWithBlock:
    dispatch_sync(dispatch_get_main_queue(), ^{}) 

3>NSThread适合轻量级多线程开发，控制线程顺序比较难，同时线程总数无法控制（每次创建并不能重用之前的线程，只能创建一个新的线程）。

4>对于简单的多线程开发建议使用NSObject的扩展方法完成，而不必使用NSThread。

5>可以使用NSThread的currentThread方法取得当前线程，使用 sleepForTimeInterval:方法让当前线程休眠。

6>NSOperation进行多线程开发可以控制线程总数及线程依赖关系。

7>创建一个NSOperation不应该直接调用start方法（如果直接start则会在主线程中调用）而是应该放到NSOperationQueue中启动。

8>相比NSInvocationOperation推荐使用NSBlockOperation，代码简单，同时由于闭包性使它没有传参问题。

9>NSOperation是对GCD面向对象的ObjC封装，但是相比GCD基于C语言开发，效率却更高，建议如果任务之间有依赖关系或者想要监听任务完成状态的情况下优先选择NSOperation否则使用GCD。

10>在GCD中串行队列中的任务被安排到一个单一线程执行（不是主线程），可以方便地控制执行顺序；并发队列在多个线程中执行（前提是使用异步方法），顺序控制相对复杂，但是更高效。

11>在GDC中一个操作是多线程执行还是单线程执行取决于当前队列类型和执行方法，只有队列类型为并行队列并且使用异步方法执行时才能在多个线程中执行（如果是并行队列使用同步方法调用则会在主线程中执行）。

12>相比使用NSLock，@synchronized更加简单，推荐使用后者。
    
6.http://www.cnblogs.com/kenshincui/p/3983982.html

7.// 设置线程的优先级(0.0 - 1.0，1.0最高级)  
thread.threadPriority = 1; 
