# Worker

## 使用 Worker 处理定时器问题

### 背景

有个项目使用定时器判断超时，但是页面长期失去焦点等导致页面冻结的时候会导致定时器停止运行，因此计时不准确。

### 解决

当使用定时器的 tab 页失去焦点时，可能会出现页面冻结，定时器停止工作的情况，使用 worker 可以解决此问题，详细的代码见 TimerDemo。

#### demo

- 浏览器打开 index.html 页面，WorkerTimer 为使用 Worker 封装的定时器，WindowTimer 为浏览器定时器
- 新建 tab 打开 chrome://discards/ （参考 [新一代页面生命周期 API：来自 Chrome 官方博客的介绍](https://mp.weixin.qq.com/s/sxbs2W8IkURo-agamUDivw)）
- 找到 index.html 的 tab 页，点击 freeze 使页面冻结
- 过段时间后切换到 index.html 页面，查看结果
