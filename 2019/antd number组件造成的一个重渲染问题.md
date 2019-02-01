# antd number 组件造成的一个重渲染问题

## compositor

[简化绘制的复杂度、减小绘制区域](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas)

[坚持仅合成器的属性和管理层计数](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)

- 坚持使用 transform 和 opacity 属性更改来实现动画。
- 使用 will-change 或 translateZ 提升移动的元素。
- 避免过度使用提升规则；各层都需要内存和管理开销。

## 现象及解决

### 现象

使用 antd 写的一个自定义表单组件，其中有 Number 组件以及别的表单组件，出现了一个很奇怪的问题，
偶现鼠标移入移出数字组件时会导致别的组件重新渲染，会闪烁一下。

### 解决

调试发现表单组件的 render 没有执行，  
利用 chrome 的 Perfomance 看了一下出现此问题时的情况，Perfomance 只有 Animation 导致重新 paint，  
猜测是 number 组件的 Animation 造成的，然后看了下 Number 组件，.ant-input-number-handler-wrap 上  
transition: opacity 0.24s linear 0.1s; 鼠标移入时 opacity 由 0 变为 1，按理说 opacity 改变不会导致 reflow，  
但是这儿确实导致了 reflow，暂未知原因。  
想到可以使 Number 组件提升为 composition layer，不影响别的渲染，然后打开 chrome 的 layers，  
发现每次移入移出都 repaint，于是就提升为 composition layer。加上下面的代码后，Number 就被提升成单独的 composition layer 啦，  
看到 chrome layers 中 input#number 的 Compositing Reasons 变为 willChange 了，然后鼠标移入移除导致的闪烁也消失啦。

```css
.xxx .ant-input-number-handler-wrap {
  will-change: transform;
  transform: translateZ(0);
}
```
