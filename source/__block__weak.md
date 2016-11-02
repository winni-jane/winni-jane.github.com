1.
(1)如果修改局部变量，需要加__block.
__block int multiplier = 7;
     int (^myBlock)(int) = ^(int num) {
         multiplier ++;//这样就可以了
         return num * multiplier;
     };
(2)如果局部变量是数组或者指针的时候只复制这个指针，两个指针指向同一个地址,block只修改指针上的内容.
NSMutableArray *mArray = [NSMutableArray arrayWithObjects:@"a",@"b",@"abc",nil];
    NSMutableArray *mArrayCount = [NSMutableArray arrayWithCapacity:1];
    [mArray enumerateObjectsWithOptions:NSEnumerationConcurrent usingBlock: ^(id obj,NSUInteger idx, BOOL *stop){
        [mArrayCount addObject:[NSNumber numberWithInt:[obj length]]];
    }];
   
    NSLog(@"%@",mArrayCount);
 (3)当block不是self的属性时，block内部使用self也不会造成内存泄露.
 当使用类方法有block作为参数使用时，block内部使用self也不会造成内存泄露.
(4) 
循环引用的问题，为了解决这个问题，可以用weak关键字。
也可以使用__block关键字，然后再block快结束的时候，把__block引用的变量设置为nil。

    MyObject *obj = [[MyObject alloc]init];  
    obj.text = @"11111111111111";  
    TLog(@"obj",obj);  
      
    __block MyObject *blockObj = obj;  
    obj = nil;  
    void(^testBlock)() = ^(){  
        TLog(@"blockObj - block",blockObj);  
        blockObj = nil;  
    };  
    obj = nil;  
    testBlock();  
    TLog(@"blockObj",blockObj);
    
    另外一点就是 __block 修饰的变量在 block 内外都是唯一的，要注意这个特性可能带来的隐患。
(5)只有在使用local变量时，block会复制对象，且强引用指针指向的对象一次。其它如全局变量、static变量、block变量等，block不会拷贝指针,只会强引用指针指向的对象一次。
(6)
//先声明一个weak弱对象
    __weak ViewController *wSelf = self;
    //添加观察者,观察主题修改消息通知,并且在收到消息通知后,打印视图控制器对象
    observer = [[NSNotificationCenter defaultCenter] addObserverForName:@"kThemeChangeNotification" object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note){

        //在block的执行过程中,使用强对象对弱对象进行引用
        ViewController *bSelf = wSelf;
        if (bSelf) {
            NSLog(@"%@",bSelf);
        }
    }];
 
在 block 之前定义对 self 的一个弱引用 wSelf，因为是弱引用，所以当 self 被释放时 wSelf 会变为nil；
在 block 中引用该弱应用，考虑到多线程情况，通过使用强引用 bSelf 来引用该弱引用，这时如果 self 不为 nil 就会 retain self，以防止在后面的使用过程中 self 被释放;

在之后的 block 块中使用该强引用 bself，注意在使用前要对 bSelf 进行了 nil 检测，因为多线程环境下在用弱引用 wSelf 对强引用 bSelf 赋值时，弱引用 wSelf 可能已经为 nil 了。

　　通过这种weak-strong手法，block 就不会持有 self 的引用，从而打破了循环引用。
2.
(1).__block对象在block中是可以被修改、重新赋值的。
(2).__block对象在block中不会被block强引用一次，从而不会出现循环引用问题。
因此，__block和__weak修饰符的区别其实是挺明显的：
<1>.__block不管是ARC还是MRC模式下都可以使用，可以修饰对象，还可以修饰基本数据类型。
<2>.__weak只能在ARC模式下使用，也只能修饰对象（NSString），不能修饰基本数据类型（int）。
<3>.__block对象可以在block中被重新赋值，__weak不可以。
PS：__unsafe_unretained修饰符可以被视为iOS SDK 4.3以前版本的__weak的替代品，不过不会被自动置空为nil。所以尽可能不要使用这个修饰符

3.
如果你看过 AFNetworking 的源码，会发现 AFN 中作者会把变量在 block 外面先用 __weak 声明，在 block 内把前面 weak 声明的变量赋值给 __strong 修饰的变量。这种写法的好处就是可以让变量在 block 内部安全可用，即使外部释放了，也会在 block 的生命周期内保留该变量。这种写法非常巧妙，既避免了循环引用的问题，又可以在 block 内部持有该变量。


4.另外，MRC中__block是不会引起retain；但在ARC中__block则会引起retain。所以ARC中应该使用__weak。在MRC的编译环境下，block如果作为成员参数要copy一下将栈上的block拷贝到堆上.

5.在block使用之后要对，block指针做赋空值处理，如果是MRC的编译环境下，要先release掉block对象。
block作为类对象的成员变量，使用block的人有可能用类对象参与block中的运算而产生循环引用。
将block赋值为空，是解掉循环引用的重要方法。
typedef void(^SuccBlock)(id data);
@interface NetworkClass {
    SuccessBlock _sucBlock;
}
@property (nonatomic,assign)BOOL propertyUseInCallBack;
- (void) requestWithSucBlock: (SuccessBlock) callbackBlock;
@end
 
@implementation NetworkClass
- (void) requestWithSucBlock: (SuccessBlock) callbackBlock {
    _sucBlock = callbackBlock;//MRC下：_sucBlock = [callbackBlock copy]; 不copy block会在栈上被回收。
}
 
- (void) netwrokDataBack: (id) data {
    if (data != nil && _sucBlock != NULL) {
        _sucBlock(data);
    }
    //MRC下：要先将[_sucBlock release];（之前copy过）
    _sucBlock = nil; //Importent: 在使用之后将Block赋空值，解引用 !!!
}
@end
 
//=======================以下是使用方===========================
@implementation UserCode
- (void) temporaryNetworkCall
{
    NetworkClass *netObj = [[NetworkClass alloc] init];
    netObj.propertyUseInCallBack = NO;
    [netObj requestWithSucBlock: ^(id data) {
        //由于block里面引用netObj的指针所以这里产生了循环引用，且由于这个block是作为参数传入对象的，编译器不会报错。
        //因此，NetworkClass使用完block之后一定要将作为成员变量的block赋空值。
        if (netObj.propertyUseInCallBack == YES) {
            //Do Something...
        }
    }];
}
@end

6.创建block
myblock=^(int a){
	int result = a + a;
	return result;
}
 调用 block
int number = myblock(4); 

（2）声明一个 block 作为参数 
《1》- (void)funtion:(int ^()(int))block
《2》typedef int (^myblock)(int)
-(void)funtion:(myblock)block



