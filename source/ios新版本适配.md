ios新版本适配:
1.ios9:
网络适配_改用更安全的HTTPS;
更灵活的后台定位;
Bitcode;
iOS9之前，企业级分发十分方便：点击App出现“信任按钮”;
在iOS9中，如果使用URL scheme必须在"Info.plist"中将你要在外部调用的URL scheme列为白名单;
iPad适配Slide Over 和 Split View;
http://www.cocoachina.com/ios/20150703/12392.html
2.ios 10
判断系统版本;
访问了隐私数据,比如:相机,相册,联系人等;
UIColor的问题 sRGB;
真彩色的显示会根据光感应器来自动的调节达到特定环境下显示与性能的平衡效果;
从2017年1月1日起,,所有新提交的 app 默认不允许使用NSAllowsArbitraryLoads来绕过ATS的限制,默认情况下你的 app 可以访问加密足够强的(TLS V1.2以上)HTTPS内容;
在iOS 10 中info.plist文件新加入了NSAllowsArbitraryLoadsInWebContent键,允许任意web页面加载,同时苹果会用 ATS 来保护你的app;
安全传输不再支持SSLv3, 建议尽快停用SHA1和3DES算法;
在iOS10中,如果还使用以前设置UIStatusBar类型或者控制隐藏还是显示的方法,会报警告,方法过期;
在iOS 10 中,UITextField新增了textContentType字段,是UITextContentType类型,它是一个枚举,作用是可以指定输入框的类型;
iOS 10 中将通知相关的 API 都统一了,在此基础上很多用户定义的通知,并且可以捕捉到各个通知状态的回调;
UICollectionViewCell的的优化;
在iOS 10 中, UIRefreshControl可以直接在UICollectionView和UITableView中使用,并且脱离了UITableViewController.现在RefreshControl是UIScrollView的一个属性;
