# React

## 生命周期
![生命周期](https://user-images.githubusercontent.com/20860159/29051854-318bdb44-7c18-11e7-918c-a51f5e96fde4.png)

## jsx
```
const element = <h1>Hello, world!</h1>;
```

### jsx中使用表达式
```
<h1>{title}</h1>
```

### className
class 是保留词，所以添加样式时，需用 className 代替 class 。

```
<h1 className="loading">Hello world</h1>
```

### Mapping Arrays to JSX

```
<div>
    {text.map(item => (
        <p key={item.id}>{item.id}</p>
    ))}
</div>
```

## React组件的3种形式
### React.createClass(React v15.*短期保留，在v16.0版本会被移除) 
```
var MyComponent = React.createClass({
  componentWillMount: function(){

  },
  render: function() {
    return (
      <div>ES5</div>
    );
  },
});
```

### stateless function
const MyConponent = () => (
    <div>
        ES6
    </div>
)

### class
class MyComponent extends React.Component {
    render(){
        return (
            <div>ES6</div>
        )
    }
}

## PropTypes
检查props

ES6写法
```
import Proptypes from 'prop-types'
class Video extends React.Component {
  render() {
      return (
          <View />
      );
  }
}
Video.defaultProps = {
    autoPlay: false,
    maxLoops: 10,
};
Video.propTypes = {
    autoPlay: PropTypes.bool.isRequired,
    maxLoops: PropTypes.number.isRequired
};
```

ES 试验特性写法：
static是类的静态属性，不会被实例继承
```
class Video extends React.Component {
  static defaultProps = {
    autoPlay: false,
    maxLoops: 10,
  }
  static propTypes = {
    autoPlay: PropTypes.bool.isRequired,
    maxLoops: PropTypes.number.isRequired
  }
  state = {
    loopsRemaining: this.props.maxLoops,
  }
}
```

## state
initialState 的设定应放在constructor中
```
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title
    };
  }
}
```

也可以按照ES 试验特性写法
```
export default class Header extends Component {
  state = {
    title: this.props.title
  };
    
  // followed by constructor...
}
```

## destructuring & spread attributes
```
class AutoloadingPostsGrid extends React.Component {
  render() {
    const {
      className,
      ...others,  // contains all properties of this.props except for className
    } = this.props;
    return (
      <div className={className}>
        <PostsGrid {...others} />
        <button onClick={this.handleLoadMoreClick}>Load more</button>
      </div>
    );
  }
}

// with arrow function
const App = ({className, ...rest}) => (
  <div className={classnames(className)} {...rest}>
    <MyComponent />
  </div>
);
```

## ps 
counstruct方法的作用：设置初始state或者绑定方法，在其他任何表达式前应调用super(props)

super(props)：super方法提供this给其他表达式引用，提供props给其他表达式调用。

this.chang.bind(this)