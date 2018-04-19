# react-native 字体图标

[https://github.com/oblador/react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)

## 生成自定义图标

[https://www.npmjs.com/package/react-native-vector-icons#generating-your-own-icon-set-from-a-css-file](Generating your own icon set from a CSS file)

```
./node_modules/.bin/generate-icon src/assets/fonts/iconfont.css --componentName=iconfont --fontFamily=iconfont > src/assets/fonts/iconfont.js
```

使用方式如下，如果编译失败，可能是编码问题

```
import Iconfont from '../../assets/iconfont';
<Iconfont name="mima" size={20} color="#4F8EF7" />
```

### 问题

自定义图标 android 中可以正常使用，ios 中需要配置字体指向 src/assets/fonts/iconfont.ttf
