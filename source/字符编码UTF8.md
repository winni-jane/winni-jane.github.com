[newUrl stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]]
相反的，转汉字：
[str1stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
ios9同样废弃了这个方法 现在使用
NSString *str2 = [str1 stringByRemovingPercentEncoding];
