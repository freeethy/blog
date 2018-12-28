# ajax 及跨域

[AJAX](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434499861493e7c35be5e0864769a2c06afb4754acc6000)

```
var request;
if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
} else {
    // 对于低版本IE，新建Microsoft.XMLHTTP对象
    request = new ActiveXObject('Microsoft.XMLHTTP');
}

request.onreadystatechange = function(){
    if(request.readyState === 4){
        if(request.status === 200){
            return (request.responseText)=>{}
        } else {
            return (request.status)=>{}
        }
    }
}

request.open('GET','/api/xxx')
request.send()
```

## 跨域

浏览器同源策略的限制，请求接口的 url 域名/协议/端口当前不一致时会跨域

### 解决方法

#### 在同源域名下架设代理服务器转发

#### jsonp

只能用 GET 请求，并且要求返回 javascript，利用浏览器允许跨域引用 javascript

```
window.callback = function(data){console.log(data)}
```

对于接口 /api/xxx?callback=callback，返回 callback({code:0})，会调用 window.callback

#### CORS

CORS 全称 Cross-Origin Resource Sharing，是 HTML5 规范定义的如何跨域访问资源。

##### Access-Control-Allow-Origin

Origin 表示本域，也就是浏览器当前页面的域。当 JavaScript 向外域（如 sina.com）发起请求后，浏览器收到响应后，首先检查 Access-Control-Allow-Origin 是否包含本域，如果是，则此次跨域请求成功，如果不是，则请求失败，JavaScript 将无法获取到响应的任何数据。
假设本域是 my.com，外域是 sina.com，只要响应头 Access-Control-Allow-Origin 为http://my.com，或者是*，本次请求就可以成功。

上面这种跨域请求，称之为“简单请求”。

> 简单请求包括 GET、HEAD、POST（POST 的 Content-Type 类型仅限 application/x-www-form-urlencoded、multipart/form-data、text/plain）,并且不能出现自定义头（如 X-Custom: xxx）

**在引用外域资源时，除了 JavaScript 和 CSS 外，都要验证 CORS，字体资源也会验证 CORS**

> 复杂请求，对于 PUT、DELETE 以及其他类型如 application/json 的 POST 请求，在发送 AJAX 请求之前，浏览器会先发送一个 OPTIONS 请求（称为 preflighted 请求）到这个 URL 上，询问目标服务器是否接受：

```
OPTIONS /path/to/resource HTTP/1.1
Host: bar.com
Origin: http://my.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-Custom-Header
```

服务器必须响应并明确指出允许的 Method：

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://my.com
Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Max-Age: 86400
```

浏览器确认服务器响应的 Access-Control-Allow-Methods 头确实包含将要发送的 AJAX 请求的 Method，才会继续发送 AJAX，否则，抛出一个错误。

由于以 POST、PUT 方式传送 JSON 格式的数据在 REST 中很常见，所以要跨域正确处理 POST 和 PUT 请求，服务器端必须正确响应 OPTIONS 请求。

[MDN: Access-Control-Allow-Credentials](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)

> Access-Control-Allow-Credentials:响应头表示是否可以将对请求的响应暴露给页面。返回 true 则可以，其他值均不可以。
> Credentials 可以是 cookies, authorization headers 或 TLS client certificates.
> Access-Control-Allow-Credentials 头 工作中与 XMLHttpRequest.withCredentials 或 Fetch API 中的 Request() 构造器中的 credentials 选项结合使用。Credentials 必须在前后端都被配置（即 the Access-Control-Allow-Credentials header 和 XHR 或 Fetch request 中都要配置）才能使带 credentials 的 CORS 请求成功。
