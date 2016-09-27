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

5.http://www.cnblogs.com/kenshincui/p/3983982.html
