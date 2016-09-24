 1.dispatch_queue_t  queue =  dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0); //获得程序进程缺省产生的并发队列，可设定优先级来选择高、中、低三个优先级队列。
 2. dispatch_queue_t queue = dispatch_queue_create ( "com.dispatch.serial" , DISPATCH_QUEUE_SERIAL ); //生成一个串行队列，队列中的block按照先进先出（FIFO）的顺序去执行，实际上为单线程执行。
 3.dispatch_queue_t  queue =  dispatch_queue_create ( "com.dispatch.concurrent" ,  DISPATCH_QUEUE_CONCURRENT );  //生成一个并发执行队列，block被分发到多个线程去执行 
 4.官网文档解释说共有三个并发队列，但实际还有一个更低优先级的队列，设置优先级为 DISPATCH_QUEUE_PRIORITY_BACKGROUND 。Xcode调试时可以观察到正在使用的各个dispatch队列
 5. dispatch_queue_t  queue =  dispatch_get_main_queue(); //获得主线程的dispatch队列，实际是一个串行队列。同样无法控制主线程dispatch队列的执行继续或中断。 
 6.
