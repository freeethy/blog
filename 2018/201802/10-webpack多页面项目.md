# webpack搭建多页面项目
此文章提供一种基于webpack搭建多页面项目的方式

## 背景
公司官网需要改版，主要是静态页面和css3动画，因此直接使用jquery，用webpack打包

## 目录结构
![目录结构](https://github.com/freeethy/blog/blob/master/201802/images/webpack-multiple-page.png)

## 思路
多页面需要多个入口，使用webpack插件html-webpack-plugin生成页面  
components 用来存放公用的组件信息，如header,footer,sidebar等
```
var globInstance = new glob.Glob('!(_)*', {
    cwd: path.resolve(__dirname, 'src/views/'), // 在views目录里找
    sync: true, // 这里不能异步，只能同步
}); // 考虑到多个页面共用HTML等资源的情况，跳过以'_'开头的目录
globInstance.found.forEach(function (name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    packConfig.entry[name] = path.resolve(__dirname, 'src/views/' + name + '/index.js')
    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: 'src/views/' + name + '/index.html',
        // 自动将引用插入html
        inject: true,
        chunks: [name]
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        // chunks: ['vendor', name]
    });
    packConfig.plugins.push(plugin);
})
```