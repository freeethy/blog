# url

## 获取 url 参数 getParameterByName

```
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
```

## loadScript

```
function loadScript(n) {
    for (var i = 0; i < n.length; i++) {
      var s = document.createElement('script');
      s.src = n[i];
      s.async = false;
      document.body.appendChild(s);
    }
  }
```
