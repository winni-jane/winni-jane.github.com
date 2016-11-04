如果需要每个属性或每个方法都去指定nonnull和nullable，是一件非常繁琐的事。苹果为了减轻我们的工作量，专门提供了两个宏：NS_ASSUME_NONNULL_BEGIN和NS_ASSUME_NONNULL_END。
在这两个宏之间的代码，所有简单指针对象都被假定为nonnull.

NS_ASSUME_NONNULL_BEGIN
@interface TestNullabilityClass () 
 @property (nonatomic, copy) NSArray * items; 
 - (id)itemWithName:(nullable NSString *)name; 
 
@end 
NS_ASSUME_NONNULL_END
