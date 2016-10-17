1.
#import <Foundation/Foundation.h>

@interface BFURLProtocol : NSURLProtocol

@end
2.

//
//  BFURLProtocol.m
//  NFTesth5
//
//  Created by bfmac on 16/10/11.
//  Copyright © 2016年 inhouse. All rights reserved.
//

#import "BFURLProtocol.h"

static NSString *const TravinProtocolHandledKey = @"TravinProtocolHandledKey";

@interface BFURLProtocol()<NSURLSessionDelegate,NSURLSessionDataDelegate>

@property (nonatomic, strong) NSURLSession *session;
@property (nonatomic, strong) NSOperationQueue *operationQueue;
@end


@implementation BFURLProtocol

+ (BOOL)canInitWithRequest:(NSURLRequest *)request
{ 
    NSLog(@"%@",request.URL);
    //只处理http和https请求
    NSString *scheme = [[request URL] scheme];
    if ( ([scheme caseInsensitiveCompare:@"http"] == NSOrderedSame || [scheme caseInsensitiveCompare:@"https"] == NSOrderedSame))
    {
        //看看是否已经处理过了，防止无限循环
        if ([NSURLProtocol propertyForKey:TravinProtocolHandledKey inRequest:request]) {
            return NO;
        }
        
        return YES;
    }
    return NO;
} 
// 这个方法就是返回request,当然这里可以处理的需求有 :
// 1,规范化请求头的信息 2, 处理DNS劫持,重定向App中所有的请求指向等
+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
    
    return request;
}


// 这个方法主要用来判断两个请求是否是同一个请求，
// 如果是，则可以使用缓存数据，通常只需要调用父类的实现即可,默认为YES,而且一般不在这里做事情
+ (BOOL)requestIsCacheEquivalent:(NSURLRequest *)a toRequest:(NSURLRequest *)b
{
    return [super requestIsCacheEquivalent:a toRequest:b];
}

// 开始初始化一个NSURLProtocol抽象对象, 包含请求, cachedResponse , 和建立client
- (instancetype)initWithRequest:(NSURLRequest *)request cachedResponse:(NSCachedURLResponse *)cachedResponse client:(id<NSURLProtocolClient>)client
{
    self = [super initWithRequest:request cachedResponse:cachedResponse client:client];
    if (self) {
    }
    return self;
}

// 需要在该方法中发起一个请求，对于NSURLConnection来说，就是创建一个NSURLConnection，对于NSURLSession，就是发起一个NSURLSessionTask
// 另外一点就是这个方法之后,会回调<NSURLProtocolClient>协议中的方法,
- (void)startLoading
{
    NSMutableURLRequest *newRequest = [self.request mutableCopy];
    // 给我们处理过的请求设置一个标识符, 防止无限循环,
    [NSURLProtocol setProperty:@YES forKey:TravinProtocolHandledKey inRequest:newRequest];
    
    NSDictionary *proxyDict = @{
                                @"HTTPEnable":@YES,
                                (id)kCFStreamPropertyHTTPProxyHost:@"192.168.100.1",
                                (id)kCFStreamPropertyHTTPProxyPort:@1080,
                                (id)kCFStreamPropertySOCKSProxy:@"",
                                @"HTTPSEnable":@YES,
                                (id)kCFStreamPropertyHTTPSProxyHost:@"192.168.100.1",
                                (id)kCFStreamPropertyHTTPSProxyPort:@1080,
                                };
    
    
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    configuration.requestCachePolicy = NSURLRequestReloadIgnoringLocalCacheData;
    configuration.connectionProxyDictionary = proxyDict;
    self.operationQueue = [[NSOperationQueue alloc] init];
    self.operationQueue.maxConcurrentOperationCount = 1;
    self.session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:self.operationQueue]; // 创建connection
    
//    NSURLSessionDataTask *dataTask = [self.session dataTaskWithURL:self.request.URL];
//    
//    [dataTask resume];
    [[self.session dataTaskWithRequest:self.request] resume];

}
// 这个方法是和start是对应的 一般在这个方法中,断开Connection
// 另外一点就是当NSURLProtocolClient的协议方法都回调完毕后,就会开始执行这个方法了
- (void)stopLoading
{
    // 断开连接
    
    [self.session invalidateAndCancel];
    self.session = nil;
    NSLog(@"断开连接");
    
}
#pragma mark - NSURLSessionDataDelegate
-(void)URLSession:(NSURLSession*)session task:(NSURLSessionTask*)task willPerformHTTPRedirection:(NSHTTPURLResponse*)response newRequest:(NSURLRequest*)newRequest completionHandler:(void (^)(NSURLRequest*))completionHandler
{
    NSMutableURLRequest *request = newRequest.mutableCopy;
    [NSURLProtocol removePropertyForKey:TravinProtocolHandledKey inRequest:request];
    [self.client URLProtocol:self wasRedirectedToRequest:request redirectResponse:response];
    [task cancel];
    [self.client URLProtocol:self didFailWithError:[NSError errorWithDomain:NSCocoaErrorDomain code:NSUserCancelledError userInfo:nil]];
}
-(void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error
{
    if (error) {
        [self.client URLProtocol:self didFailWithError:error];
    } else {
        [self.client URLProtocolDidFinishLoading:self];
    }
}

-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveResponse:(NSURLResponse *)response completionHandler:(void (^)(NSURLSessionResponseDisposition))completionHandler
{
    [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
    completionHandler(NSURLSessionResponseAllow);
}

-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data
{
    [self.client URLProtocol:self didLoadData:data];
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
 willCacheResponse:(NSCachedURLResponse *)proposedResponse
 completionHandler:(void (^)(NSCachedURLResponse *cachedResponse))completionHandler
{
    completionHandler(proposedResponse);
}
@end
