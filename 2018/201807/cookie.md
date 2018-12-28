# cookie

cookie 是由服务端生成，保存在客户端的，客户端请求 header 中会带上 cookie

## cookie 属性

Expires，max-age， 默认只在浏览器会话期间存在，只在浏览器会话期间存在
Domain， 向上通配，如 example.com 中写入的 cookie 在 www.example.com 中可以读取
Path，向下统配，如/test/目录可以访问/目录下的 cookie，子路径可以访问父路径
Secure，设置后，cookie 只能通过 https 传输，http 不传
HttpOnly，设置后不可以通过 js 等操作 cookie

Domain，path，name 可以唯一确定一个 cookie
