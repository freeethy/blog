# web historyAPI

[web historyAPI](https://developer.mozilla.org/en-US/docs/Web/API/History)

- History.length
- History.state
- History.back()
- History.forward()
- History.go()
- History.pushState()
- History.replaceState()

## popstate

[MDN popstate](https://developer.mozilla.org/en-US/docs/Web/Events/popstate)
history.pushState() 或者 history.replaceState() 不会触发 popstate 事件，
在点击浏览器的前进、后退按钮或是调用 history.back() 或 history.forward()时会触发 popstate 事件

```javascript
window.onpopstate = function(event) {
  console.log(
    "location: " + document.location + ", state: " + JSON.stringify(event.state)
  );
};
history.pushState({ page: 1 }, "title 1", "?page=1");
history.pushState({ page: 2 }, "title 2", "?page=2");
history.replaceState({ page: 3 }, "title 3", "?page=3");
history.back(); // Logs "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // Logs "location: http://example.com/example.html, state: null
history.go(2); // Logs "location: http://example.com/example.html?page=3, state: {"page":3}
```
