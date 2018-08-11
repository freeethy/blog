# websocket

[The WebSocket Protocol](https://tools.ietf.org/html/rfc6455)

## 背景

过去，使用 ajax 轮询或 long poll 方式处理实时性要求比较高的应用。  
缺点：1、http 请求是无状态的，每次请求都会带 header；2、server 需要为每个 client 维护两个 TCP 连接（一个用于给 client 发送信息，一个用户接收数据）

HTML5 中出现了一个新的协议 websocket，支持在客户端和服务器间使用全双工通信，可用于实时性要求比较高的应用，如游戏，股票交易，多用户协作等。

## 协议概览

协议跟为两个部分：握手和数据传输

### 握手

websocket 是独立于 TCP 协议，基于 HTTP 协议实现 Upgrade 请求，使用 80/443 端口

1、 客户端发送一个请求：

```
GET /xxx HTTP/1.1
Request URL: wss://xxx.xxx.xxx/ws
Connection: Upgrade
Host: xxx.xxx.xxx
Origin: https://xxx.xxx
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
Sec-WebSocket-Key: Wul5+39fW+VU4hdALTiCWw==
Sec-WebSocket-Version: 13
Sec-WebSocket-Protocol: chat, superchat
Upgrade: websocket
```

2、 然后服务器会返回下列东西，表示已经接受到请求，成功建立 Websocket，告诉客户端即将升级的是 Websocket 协议

```
HTTP/1.1 101 Switching Protocols
Connection: upgrade
Date: Thu, 09 Aug 2018 06:19:08 GMT
Sec-WebSocket-Accept: ERPVeRRPyTlkPDZoozDLvc0mBsM=
Sec-WebSocket-Protocol: chat
Server: nginx/1.13.12
Upgrade: websocket
```

- Sec-WebSocket-Key 是一个 Base64 encode 的值，这个是浏览器随机生成的
- Sec_WebSocket-Protocol 是一个用户定义的字符串，用来区分同 URL 下，不同的服务所需要的协议
- Sec-WebSocket-Version 是告诉服务器所使用的 Websocket Draft（协议版本）

- Sec-WebSocket-Accept 这个则是经过服务器确认，并且加密过后的 Sec-WebSocket-Key
- Sec-WebSocket-Protocol 则是表示最终使用的协议

> Sec-WebSocket-Accept 计算方式: base64-encoded(SHA-1(Sec-WebSocket-Key+258EAFA5-E914-47DA-95CA-C5AB0DC85B11))

### 传输数据

支持格式：textual data（文本格式），binary data（二进制数据），control frames（控制帧）等

## WebSocket URIs

```
ws-URI = "ws:" "//" host [ ":" port ] path [ "?" query ]
wss-URI = "wss:" "//" host [ ":" port ] path [ "?" query ]
```

## 数据帧

```
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
```

## 实践

有个 IM 项目，使用的 websocket，用的 google-protobuf 处理 arraybuffer 类型数据，前端建立连接发送数据

```
var conn = new WebSocket('wss://xxx.xxx/ws');
conn.binaryType = "arraybuffer";
conn.onopen = function() {
    console.log('连接成功')
};
conn.onclose = function(evt) {
    console.log('连接关闭')
};
conn.onmessage = function(evt) {
    console.log('收到消息')
};
conn.onerror = function(evt) {
    console.log('连接失败')
};

conn.send(message)
```
