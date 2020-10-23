
## 简介

`RSS`是英文*Really Simple Syndication*的缩写，中文翻译叫**简易信息聚合**。

准确的说，`RSS`仅仅是一种协议，或者说一种规范，规定了一套信息组合的规则，同样作用的协议还有`Atom`，关于两种协议的细节可以查阅以下文档：

[RSS2.0协议](http://cyber.law.harvard.edu/rss/index.html)

[Atom协议](http://www.ietf.org/rfc/rfc4287.txt)

二者都是以XML格式作为信息聚合的组织标准，RSS2.0协议目前已经冻结，今后不会再做修改。Atom协议是改进版的RSS，今后仍有可能进行调整。

## 订阅源

RSS和Atom协议提供的是数据组织的规范和标准，**订阅源**则是众多网站和博客将内容按照RSS或Atom等协议为用户提供的**标准化内容输出接口**，这些接口以URL（统一资源定位符）的形式公布在互联网上，使用HTTP协议访问，和普通的网址没有什么区别。当你使用一般的浏览器访问的时候，只能看到接口提供的XML原始数据，只有使用RSS阅读器订阅这些源，才能将其中的内容转换为多媒体网页进行浏览。

例如下面是优质的订阅源**知乎每日精选**的URL

```
https://www.zhihu.com/rss
```

## 时效性

和一般的网站一样，订阅源的URL会失效的，当一个订阅源突然断更，没有更新的文章提供的时候，请查看源网站rss链接是否可用。

订阅源并不提供旧文章的回查功能。从订阅开始后，只要不执行清除文章，你能看到一个区间的文章，更早的文章将无法查看。

## 全文订阅

再一次提到上面说的优秀源**知乎每日精选**，她是一个全文输出源，当你订阅她的时候，每一篇文章的全部内容她都会包装在订阅包中，在程序中中可以直接全文浏览内容。

但优秀的全文订阅源并不多，更多的订阅源采取的策略是摘要输出，而将全文留在了改源网站上，所以当你订阅了一些没办法看到全文，这个时候你可以尝试打开后台离线，这样程序在后台执行下载原文，然后通过**算法**获取最理想的离线原文。如果效果过不理想请告知我们，然后改进算法。后期会开发用户自定义离线原文部分。

## 不合规矩

规矩是RSS和Atom协议定的，但也会有许多不合规矩的订阅源，这些源让我在做解析的时候会非常头疼。虽然我已经适应了很多特别订阅源的“不合规矩”，但仍不能保证能兼容全部的订阅源。

最显而易见的是时间戳格式问题，有些订阅源的时间格式不规范，会导致我无法正确解析文章发布的时间，从而无法按照时间对文章进行归类。如果有这种请求请联系我们，我会进行适配。

## 高级自定义订阅

对于你感兴趣的链接，如果你感兴趣，可以学习此方法，进行自定义订阅，脚本位置在**我的文件**的 **ParserScripte** 目录下。
#### 订阅步骤
- 通过订阅列表中选择**自定义订阅**。
- 然后输入显示的**名称**。
- 数据对应的链接**地址**，如果使用脚本中的请求中，将自动绑定，填入的链接将最为参考（保持唯一）。
- 选择一个对应的**脚本**,文件名称为脚本名称（**demo.xml**）。
- 选择解析链接返回数据的格式，包括xml,json,text,html 四种格式。
- 绑定脚本中一个解析器，不选择将自动模式解析。

你可以查看绑定脚本的样式：
[详细请看](https://inread.github.io/documents/feeds/scripte.md) 

## Demo

```xml

<site version="1.18" xmlns:feature="http://www.w3.org/1999/feature" xmlns:object="http://www.w3.org/1999/object" xmlns:parsers="http://www.w3.org/1999/parsers" xmlns:path="http://www.w3.org/1999/path" xmlns:request="http://www.w3.org/1999/request" xmlns:scope="http://www.w3.org/1999/scope" xmlns:src="http://www.w3.org/1999/src" xmlns:wrap="http://www.w3.org/1999/wrap" xmlns:page="http://www.w3.org/1999/page" xmlns:out="http://www.w3.org/1999/out" >
    <configure/>

   <feature:topic>
       <request alias="bbs" method="get" interval="18000" parser="mhome" range="{0,99}" value="https://www.tianya.cn/m/" type="html" />
       <request alias="hot" interval="18000" value = "https://mydomain.com/api?method=bbs.ice.getHotArticleList&amp;params.type=&amp;params.pageSize=20&amp;params.pageNum=1" parser ="jshot" type = "json"/>
   </feature:topic>
   
   <parsers:topic>
       <html>
        <condition equal="notnil" name="mhome" scope="body" xpath="//div[contains(@class,'news_list')]//ul/li">
            <out>
                <group>
                    <wrap:array scope="body" xpath="//div[@class='item']/a[contains(@href,'bbs.tianya.cn')]/..">
                        <object:item>
                            <request express="getLink" scope="self" xpath="/a[contains(@href,'bbs.tianya.cn')]"/>
                            <orignalurl express="getLink" scope="self" xpath="/a[contains(@href,'bbs.tianya.cn')]"/>
                            <oid express="getTYThreadID" scope="self" xpath="/a[contains(@href,'bbs.tianya.cn')]"/>
                            <title express="getContent" scope="self" xpath="/p[@class='caption']"/>
                            <from value="from name"/>
                            <wrap:images scope="self" xpath="//img">
                                <image imagelayout="3">
                                    <src express="getOriginalImageLink" scope="self" xpath="./"/>
                                    <src:referer value="{{local.url}}"/>
                                </image>
                            </wrap:images>
                        </object:item>
                    </wrap:array>
                    <wrap:array scope="body" xpath="//div[contains(@class,'news_list')]//ul/li">
                        <object:item>
                            <request express="getRefLink" scope="self" xpath="/div[@data-link]"/>
                            <orignalurl express="getRefLink" scope="self" xpath="/div[@data-link]"/>
                            <oid express="getTYThreadID" scope="self" xpath="/div[@data-link]"/>
                            <title express="getContent" scope="self" xpath="//h3"/>
                            <desc express="getContent" scope="self" xpath="//p[@class='list_summary']"/>
                            <author express="getTYAuthor" scope="self" xpath="//span[contains(@class,'list_author')]"/>
                            <access express="getContent" scope="self" xpath="//span[@class='look-v-num']/em"/>
                            <parenttitle express="getContent" scope="self" xpath="//span[contains(@class,'list_from')]"/>
                            <from  value=""/>
                            <wrap:images scope="self" xpath="//div[@class='list_img']/img">
                                <image>
                                    <src express="getOriginalImageLink" scope="self" xpath="./"/>
                                </image>
                            </wrap:images>
                        </object:item>
                    </wrap:array>
                </group>
            </out>
        </condition>
    </html>
        <json>
            <condition name = "jshot" equal="notnil" scope="doc" xpath="/data/rows">
                <out>
                    <group>
                        <wrap:array scope = "doc" xpath ="/data/rows">
                            <object:item>
                                <request scope = "self" xpath = "/url" express="getLink" />
                                <oid scope = "self" xpath = "/id" express = "getContent"/>
                                <title scope = "self" xpath = "/title" express = "getContent" />
                                <author scope = "self" xpath="/author_name" express="getContent" />
                                <authorid scope = "self" xpath="/author_id" express="getContent" />
                                <parentoid scope = "self" xpath="/item" express="getContent" />
                                <parenttitle scope = "self" xpath="/item_name" express="getContent" />
                                <reply scope = "self" xpath="/count" express="getContent" />
                                <pdate scope = "self" xpath = "/time" express = "getContent"/>
                                <desc scope = "self" xpath = "/content" express = "getContent"/>
                                <wrap:images scope="self" xpath="/pics">
                                    <image>
                                        <src express="getContent" scope="self" xpath="./"/>
                                    </image>
                                </wrap:images>
                            </object:item>
                        </wrap:array>
                    </group>
                </out>
            </condition>
        </json>
    </parsers:topic>
    <expresses>
        <express name = "getLink" scope = "attr"  keys = "href|data-link"/>
        <express name="getContent" scope="text"/>
        <express keys="data-href|data-url|data-link" name="getRefLink" scope="attr"/>
        <express capture="1" key="data-link|href" name="getTYThreadID" regex="-(\d+)-" scope="attr"/>
        <express name="getTYAuthor" regex="[/]*(\w+)" regex1="[/]*(\W+)" scope="text"/>
        <express keys="data-original|data-src|original|src" name="getOriginalImageLink" scope="attr"/>
    </expresses>
</site>

```
 
