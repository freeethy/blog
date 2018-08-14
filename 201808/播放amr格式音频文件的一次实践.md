# 播放 amr 格式音频文件的一次实践

## 背景

最近负责的 IM 项目需要接入微博,微博发送过来的语音文件是.amr 格式的,之前使用 Audio 标签直接播放.mp3 格式的方式不适用了,需要新的方式来播放语音.

## 解决方案

### benz-amr-recorder

网上搜索了一下播放.amr 文件方式,找到一个 npm 包 [benz-amr-recorder](https://github.com/BenzLeung/benz-amr-recorder),纯前端解码、播放、录音、编码 AMR 音频，无须服务器支持，基于 [amr.js](https://github.com/jpemartins/amr.js) 和 [RecorderJs](https://github.com/jergason/Recorderjs)。

ps:虽然星星不多,但是公司内部有搭建私有 npm,因此还是使用 npm 安装了此库进行使用

### 使用

有两个场景需要使用到此库:
A. 一个是 IM 中的客服侧,客服与用户是一对多,用户与音频也是一对多;
B. 还有一个场景是 IM 系统的后台统计监控系统的历史会话记录,需要播放音频文件.

### 场景 A

场景 A 是基于 es6 以及观察者模式,利用 websocket 实现客服与用户通信的系统,使用 jquery 开发.

```html
`<div class="audio-msg" data-src="${content}" data-amr=""><i class="iconfont icon-sounds"></i><span></span></div>`
```

```javascript
$(".chat").on("click", ".audio-msg i", e => {
  let $this = $(e.target).closest(".audio-msg");
  let amr = $this.data("amr");

  // 已经实例化,判断是否在播放中,是则暂停,否则播放
  if (amr) {
    if (amr.isPlaying()) {
      amr.stop();
    } else {
      amr.play();
      $this.addClass("isplaying");
    }
    return false;
  }

  amr = new BenzAMRRecorder();
  $this.data("amr", amr);

  // 处理协议的http和https
  amr.initWithUrl($this.data("src").replace(/^http(s)?:/, "")).then(function() {
    amr.play();
    $this.addClass("isplaying");
    $this.find("span").text(amr.getDuration().toFixed(2) + "''");
  });
  amr.onEnded(function() {
    $this.removeClass("isplaying");
  });
  return false;
});
```

> 碰到的问题: benz-amr-recorder 需要先用 ajax 请求去获取.amr 文件的内容,此项目的.amr 文件存储在阿里云,直接请求会跨域,用 nginx 将阿里云地址做了一层转换,并对转换后的地址加了允许跨域的 header

### 场景 B

此场景是使用 react 构建的项目,历史记录部分是用如下方式渲染的,没办法使用 react 事件系统提供的方式,因此使用原生方式完成

```jsx
<div key="noContent" className="session-chat-info">
  <div dangerouslySetInnerHTML={{ __html: html }} />
</div>
```

```html
`<div class="audio-msg"><i class="iconfont icon-sounds audio-btn" data-src="${content}" data-amr=""></i><span></span></div>`
```

```javascript
this.audios = {};
this.index = 0;
function audio() {
  // 音频播放
  let that = this;
  let container = document.getElementsByClassName("session-record-modal")[0];
  container.onclick = function(ev) {
    var ev = ev || window.event;
    let target = ev.target || ev.srcElement;
    let amr;
    let index;

    if (
      target.className &&
      target.className.toLowerCase().indexOf("audio-btn") !== -1
    ) {
      index = target.dataset.amr;
      amr = that.audios[index];
      if (amr) {
        if (amr.isPlaying()) {
          amr.stop();
        } else {
          amr.play();
          target.setAttribute("data-isplaying", true);
        }
        return;
      }

      amr = new BenzAMRRecorder();
      target.dataset.amr = that.index;
      that.audios[that.index++] = amr;
      amr
        .initWithUrl(target.getAttribute("data-src").replace(/^http(s)?:/, ""))
        .then(function() {
          let duration = amr.getDuration().toFixed(2) + "''";
          amr.play();
          target.setAttribute("data-isplaying", true);
          target.parentNode.childNodes[1].innerText = duration;
        });
      amr.onEnded(function() {
        target.setAttribute("data-isplaying", false);
      });
    }
  };
}
```

组件销毁时会遍历 this.audios,暂停播放的音频,并还原 this.audios 和 this.index

## 总结

第三方库使用的是 HTML5 Web Audio API AudioContext 来完成音频的播放,需要去了解下 AudioContext.
