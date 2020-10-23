
##Script

文件名称为**脚本名称**，尽量简洁明了。

## 根节点

必须

```xml
<site version="1.18" xmlns:feature="http://www.w3.org/1999/feature" xmlns:object="http://www.w3.org/1999/object" xmlns:parsers="http://www.w3.org/1999/parsers" xmlns:path="http://www.w3.org/1999/path" xmlns:request="http://www.w3.org/1999/request" xmlns:scope="http://www.w3.org/1999/scope" xmlns:src="http://www.w3.org/1999/src" xmlns:wrap="http://www.w3.org/1999/wrap" xmlns:page="http://www.w3.org/1999/page" xmlns:out="http://www.w3.org/1999/out" >
    <configure/>
</site>
```

## configure节点,保留

```xml
<configure/>
```

## 可选请求节点

```xml
 <feature:topic>
       <request alias="bbs" method="get" interval="18000" parser="mhome" range="{0,99}" value="https://mydomain.com/m/" type="html" />
       <request alias="hot" interval="18000" value = "https://mydomain.com/api?method=bbs.ice.getHotArticleList&amp;params.type=&amp;params.pageSize=20&amp;params.pageNum=1" parser ="jshot" type = "json"/>
   </feature:topic>
```

### request 支持的属性
用于请求数据，和返回结果数据解析的定义
- alias，名称。
- method，http/https 请求方法（get/post），不些默认get。
- type， 请求返回数据对应的解析类型，包括html/xml/json/text。
- value, 对应的请求链接。
- interval， 请求间隔，不些将不限制。
- parser， 名称对应 parsers:topic-> html(xml/json) -> condition:name 的值。

### condition 支持的属性
解析器执行的**条件**
- name，名称
- scope， 表示文档的对应位置，有 doc/body/head/self 等
- xpath， 从单前scope指定位置为root的xpath
- express， 对获得结果进行表达式计算，值为指向 expresses>express name属性值，条件成立，执行子输出

```xml
<condition equal="notnil" name="mhome" scope="body" xpath="//div[contains(@class,'news_list')]//ul/li">
```


### express 支持的属性
对xpath获得结果的节点**取值**，或者**属性值**，对值在进行**正则表达式**取值
- name，名称
- scope， 操作的位置，attr表示属性,text表示值,alltext 表示所有的文本
- keys，表示属性的名称，多个用|分割
- regex 正则表达式
- capture 默认为‘1’， 与regx 配对使用

比如：
```xml
<express capture="1" keys="data-link|href" name="getTYThreadID" regex="-(\d+)-" scope="attr"/>
```


### wrap:array 支持的属性
取多个xpath的节点，然后对所有节点枚举，对每个节点处理，然后输出object:item
```xml
<wrap:array scope="body" xpath="//div[@class='item']/a/..">
```

### object:item 包括下面节点
- title 文章标题 ， 必须
- oid 文章链接或者对应唯一的当前站点id  
- orignalurl 文章源链接 
- request 文章请求链接 ， 必须
- src 链接节点
- src:referer 图片引用链接
- author 文章作者
- desc 文章摘要
- parentoid 文章类别id
- parenttitle 文章类别
- from 来源

- wrap:images 支持的属性
通过xpath取多个的图片节点，然后枚举，使用 image 来处理，输出image 对象
```xml
<wrap:images scope="self" xpath="//div[@class='list_img']/img">
```
###  image 节点 属性
- imagelayout，展示属性， 0 ，宽大于高度的图片； 1，宽小于高的图片； 2，显示三张图；  3 显示一张表示大图



## Demo.xml

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
                    <wrap:array scope="body" xpath="//div[@class='item']/a[contains(@href,'bbs..cn')]/..">
                        <object:item>
                            <request express="getLink" scope="self" xpath="/a[contains(@href,'bbs..cn')]"/>
                            <orignalurl express="getLink" scope="self" xpath="/a[contains(@href,'bbs..cn')]"/>
                            <oid express="getTYThreadID" scope="self" xpath="/a[contains(@href,'bbs..cn')]"/>
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
        <express capture="1" keys="data-link|href" name="getTYThreadID" regex="-(\d+)-" scope="attr"/>
        <express name="getTYAuthor" regex="[/]*(\w+)" regex1="[/]*(\W+)" scope="text"/>
        <express keys="data-original|data-src|original|src" name="getOriginalImageLink" scope="attr"/>
    </expresses>
</site>

```
 
