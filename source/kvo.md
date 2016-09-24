1.[_walker addObserver:self
            forKeyPath:@"age"
                options:NSKeyValueObservingOptionNew
                 context:nil];
2.- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
 {
     if ([keyPath isEqualToString:@"age"] && object == _walker) {
         _ageLabel.text = [NSString stringWithFormat:@"%@现在的年龄是: %d", _walker.name, _walker.age];
     }
 }
 3.实现细节
 被观察对象的 isa 指针会指向一个中间类，而不是原来真正的类。
 当你观察一个对象时，一个新的类会动态被创建。这个类继承自该对象的原本的类，并重写了被观察属性的 setter 方法。
 自然，重写的 setter 方法会负责在调用原 setter 方法之前和之后，通知所有观察对象值的更改。
 最后把这个对象的 isa 指针 ( isa 指针告诉 Runtime 系统这个对象的类是什么 ) 指向这个新创建的子类，对象就神奇的变成了新创建的子类的实例。
 4.原来，这个中间类，继承自原本的那个类。不仅如此，Apple 还重写了 -class 方法，企图欺骗我们这个类没有变，就是原本那个类。更具体的信息，去跑一下 Mike Ash 的那篇文章里的代码就能明白，这里就不再重复。
 5.
    (1)当一个观察者观察多个对象的相同属性（即不同Object，但是KeyPath相同），可通过设定静态的Context变量来区分不同的通知。
    （2）使用NSStringFromSelector(@selector(method))来获取KeyPath，而不是直接通过NSString写属性名，这样编译器可以帮助发现属性名中的Typo。
    （3）通过方法：+ (NSSet *)keyPathsForValuesAffectingValueForKey:(NSString *)key，通过一个Key观察多个属性值的改变。 
6.KVO 依赖键

有时候一个属性的值依赖于其他属性值，那么如果其他属性值发生变更，那么必然也就导致该属性值的变更，也即 Dependent Poroperties。在KVO中，引入了依赖键。


    + (NSSet *)keyPathsForValuesAffectingInformation    
    {    
        NSSet * keyPaths = [NSSet setWithObjects:@"target.age", @"target.grade", nil];    
        return keyPaths;    
    }    
        
    + (NSSet *)keyPathsForValuesAffectingValueForKey:(NSString *)key    
    {    
        NSSet * keyPaths = [super keyPathsForValuesAffectingValueForKey:key];    
        NSArray * moreKeyPaths = nil;    
            
        if ([key isEqualToString:@"information"])    
        {    
            moreKeyPaths = [NSArray arrayWithObjects:@"target.age", @"target.grade", nil];    
        }    
            
        if (moreKeyPaths)    
        {    
            keyPaths = [keyPaths setByAddingObjectsFromArray:moreKeyPaths];    
        }    
            
        return keyPaths;    
    }  
要实现 keyPathsForValuesAffectingInformation  或 keyPathsForValuesAffectingValueForKey: 方法是告诉系统 information 属性依赖于哪些其他属性，这两个方法都返回一个key-path 的集合。
如果选择实现 keyPathsForValuesAffectingValueForKey，要先获取 super 返回的结果 set，然后判断 key 是不是目标 key，如果是就将依赖属性的 key-path 结合追加到 super 返回的结果 set 中，否则直接返回 super的结果。
