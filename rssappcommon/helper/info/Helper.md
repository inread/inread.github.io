
## Introduction

`RSS` (*Really Simple Syndication*)

To be precise, `RSS' is simply a protocol, or specification, that defines a set of rules for combining information, as is `Atom', the details of which can be found in the following documents

[RSS2.0](http://cyber.law.harvard.edu/rss/index.html)

[Atom](http://www.ietf.org/rfc/rfc4287.txt)

Both use the XML format as an organizing standard for information aggregation, and the RSS 2.0 protocol is currently frozen and will not be modified in the future. the Atom protocol is an improved version of RSS and may still be adjusted in the future.

## Feeds

RSS and Atom protocols provide specifications and standards for data organization, **subscription sources** are the **standardized content output interfaces** that many websites and blogs provide to their users in accordance with protocols such as RSS or Atom, which are published on the Internet in the form of URLs (Uniform Resource Locators) and accessed using the HTTP protocol, which are no different from ordinary web addresses. When you use a normal browser to access, you can only see the XML raw data provided by the interface, only use RSS readers to subscribe to these sources, you can convert the content into multimedia web pages to browse.

E.g:

```
https://www.techmeme.com/feed.xml
```

## Timeliness

When a subscription source is suddenly out of order and no newer articles are available, please check if the rss link to the source site is available.

Subscription feeds do not provide a back-check for old articles. From the beginning of the subscription, you can see a range of articles as long as you don't perform a purge of the articles, older articles will not be viewable.

## Full text subscription

The **Feeds** of an excellent source will have a full text output source. When you subscribe to her, all the content of each article will be packaged in a subscription package, and you can browse the content directly in the program.

However, there are not many excellent full-text feeds. More feeds adopt the strategy of abstract output, and leave the full text on the modified source website.

## Original offline
So when you subscribe to something and you can't see the full text, you can try to open the background offline, so that the program executes in the background to download the original text, and then get the most ideal full text through **algorithm**. If the effect is not satisfactory, please let us know and improve our algorithm.

## Non-compliance

The rules are negotiated between RSS and Atom, but there will also be many non-compliant feeds. These sources make me a headache when doing analysis. Although I have adapted to the "non-compliance" of many special feeds, I still cannot guarantee compatibility with all feeds.

The most obvious problem is the timestamp format. The time format of some feeds is not standardized, which will cause me to be unable to correctly parse the time when the article was published, so I cannot classify the article according to the time. If you have such a request, please contact us and I will adapt it.

## Advanced custom subscription

For the links you are interested in, if you are interested, you can learn this method and make a custom subscription. The script location is in the **ParserScripte** directory of **My Documents**.
#### Subscription steps
-Select **Custom Subscription** from the subscription list.
-Then enter the displayed **Name**.
-The link **address** corresponding to the data will be automatically bound if used in the request in the script, and the filled-in link will be the most reference (keep it unique).
-Select a corresponding **script**, the file name is the script name (**demo.xml**).
-Choose the format of the data returned by the parse link, including four formats: xml, json, text, and html.
-Bind a parser in the script, if it is not selected, the mode will be resolved automatically.


## Script

The file name is **script name**, try to be concise and clear.

## Root node

The following declaration is required:
```xml
<site version="1.18" xmlns:feature="http://www.w3.org/1999/feature" xmlns:object="http://www.w3.org/1999/object" xmlns:parsers="http://www.w3.org/1999/parsers" xmlns:path="http://www.w3.org/1999/path" xmlns:request="http://www.w3.org/1999/request" xmlns:scope="http://www.w3.org/1999/scope" xmlns:src="http://www.w3.org/1999/src" xmlns:wrap="http://www.w3.org/1999/wrap" xmlns:page="http://www.w3.org/1999/page" xmlns:out="http://www.w3.org/1999/out" >
    <configure/>
</site>
```

## configure node, reserved

```xml
<configure/>
```

## Optional request node
You can add the defined request under the topic to keep the alias different;

```xml
 <feature:topic>
       <request alias="bbs" method="get" interval="18000" parser="mhome" range="{0,99}" value="https://mydomain.com/m/" type="html" />
       <request alias="hot" interval="18000" value = "https://mydomain.com/api?method=bbs.ice.getHotArticleList&amp;params.type=&amp;params.pageSize=20&amp;params.pageNum=1" parser ="jshot" type = "json"/>
   </feature:topic>
```

### Request attributes supported
Used to request data, and return the definition of the result data analysis
-alias, name.
-method, http/https request method (get/post), some default get.
-type, the parse type corresponding to the data returned by the request, including html/xml/json/text.
-value, the corresponding request link.
-interval, request interval, some will not limit.
-parser, the name corresponds to the value of parsers:topic->html(xml/json) -> condition:name.

### Condition supported attributes
**Condition** executed by the parser
-name
-scope, indicating the corresponding position of the document, such as doc/body/head/self
-xpath, the xpath whose scope is specified as root from the previous order
-express, perform expression calculation on the obtained result, the value points to the expresses>express name attribute value, the condition is met, and the sub-output is executed

```xml
<condition equal="notnil" name="mhome" scope="body" xpath="//div[contains(@class,'news_list')]//ul/li">
```

### Express supported attributes
**Value** or **attribute value** for the node where the result of xpath is obtained, and **regular expression** for the value
-name
-scope, the location of the operation, attr means attribute, text means value, alltext means all text
-keys, indicate the name of the attribute, multiple use | to separate
-regex regular expression
-Capture defaults to ‘1’, paired with regx

such as:

```xml
<express capture="1" keys="data-link|href" name="getTYThreadID" regex="-(\d+)-" scope="attr"/>
```


### wrap:array supported attributes
Take multiple xpath nodes, then enumerate all nodes, process each node, and output object:item

```xml
<wrap:array scope="body" xpath="//div[@class='item']/a/..">
```

### object:item includes the following nodes
-title The title of the article, must
-oid article link or corresponding unique current site id
-orignalurl article source link
-request article request link, must
-src link node
-src:referer image reference link
-author Article author
-desc article abstract
-parentoid article category id
-parenttitle article category
-from source

- wrap:images Supported attributes

Take multiple image nodes through xpath, then enumerate, use image to process, and output image objects.

```xml
<wrap:images scope="self" xpath="//div[@class='list_img']/img">
```

###  image attributes

- imagelayout, display attributes, 0, the picture with width greater than height; 1, the picture with width less than height; 2, display three pictures; 3 display one large picture


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
 
