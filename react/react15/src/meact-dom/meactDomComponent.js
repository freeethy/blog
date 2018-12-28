class MeactDOMTextComponent {
  constructor(element) {
    this._currentElement = element;
    this._rootNodeID = null;
  }
  mountComponent(rootID) {
    this._rootNodeID = rootID;
    return `<span data-reactid="${rootID}">${this._currentElement}</span>`;
  }
  receiveComponent(nextText) {
    const nextStringText = "" + nextText;
    //跟以前保存的字符串比较
    if (nextStringText !== this._currentElement) {
      this._currentElement = nextStringText;
      //替换整个节点
      $('[data-reactid="' + this._rootNodeID + '"]').html(this._currentElement);
    }
  }
}

//全局的更新深度标识
let updateDepth = 0;
//全局的更新队列，所有的差异都存在这里
let diffQueue = [];
//差异更新的几种类型
var UPATE_TYPES = {
  MOVE_EXISTING: 1,
  REMOVE_NODE: 2,
  INSERT_MARKUP: 3
};

//普通的children是一个数组，此方法把它转换成一个map,key就是element的key,如果是text节点或者element创建时并没有传入key,就直接用在数组里的index标识
function flattenChildren(componentChildren) {
  var child;
  var name;
  var childrenMap = {};
  for (var i = 0; i < componentChildren.length; i++) {
    child = componentChildren[i];
    name =
      child && child._currentelement && child._currentelement.key
        ? child._currentelement.key
        : i.toString(36);
    childrenMap[name] = child;
  }
  return childrenMap;
}

//主要用来生成子节点elements的component集合
//这边注意，有个判断逻辑，如果发现是更新，就会继续使用以前的componentInstance,调用对应的receiveComponent。
//如果是新的节点，就会重新生成一个新的componentInstance，
function generateComponentChildren(prevChildren, nextChildrenElements) {
  var nextChildren = {};
  nextChildrenElements = nextChildrenElements || [];
  $.each(nextChildrenElements, function(index, element) {
    var name = element.key ? element.key : index;
    var prevChild = prevChildren && prevChildren[name];
    var prevElement = prevChild && prevChild._currentElement;
    var nextElement = element;

    //调用_shouldUpdateReactComponent判断是否是更新
    if (_shouldUpdateReactComponent(prevElement, nextElement)) {
      //更新的话直接递归调用子节点的receiveComponent就好了
      prevChild.receiveComponent(nextElement);
      //然后继续使用老的component
      nextChildren[name] = prevChild;
    } else {
      //对于没有老的，那就重新新增一个，重新生成一个component
      var nextChildInstance = instantiateReactComponent(nextElement, null);
      //使用新的component
      nextChildren[name] = nextChildInstance;
    }
  });

  return nextChildren;
}
class MeactDOMComponent {
  constructor(element) {
    this._currentElement = element;
    this._rootNodeID = null;
  }
  mountComponent(rootID) {
    this._rootNodeID = rootID;
    const props = this._currentElement.props;
    const propAttrs = "";

    for (let propKey in props) {
      if (/^on[A-za-z]/.test(propKey)) {
        let eventType = propKey.replace("on", "");
        document.addEventListener(
          `[data-reactid="${rootID}"]`,
          `${eventType}.${rootID}`,
          props[propKey]
        );
      }

      //对于children属性以及事件监听的属性不需要进行字符串拼接
      //事件会代理到全局。这边不能拼到dom上不然会产生原生的事件监听
      if (
        props[propKey] &&
        propKey != "children" &&
        !/^on[A-Za-z]/.test(propKey)
      ) {
        propAttrs += ` ${propKey}=${props[propKey]}`;
      }
    }

    //获取子节点渲染出的内容
    const children = props.children || [];
    let content = "";
    let childrenInstances = [];
    children.forEach((key, child) => {
      let childComponentInstance = instantiateMeactComponent(child);
      childComponentInstance._mountIndex = key;

      childrenInstances.push(childComponentInstance);
      let curRootID = this._rootNodeID + "." + key;
      let childMarkup = childComponentInstance.mountComponent(curRootID);
      content += " " + childMarkup;
    });

    this.renderedChildren = childrenInstances;

    const tagOpen = `<${
      this._currentElement.type
    } data-reactid="${rootID}" ${propAttrs}`;
    const tagClose = `</${this._currentElement.type}>`;

    return tagOpen + ">" + content + tagClose;
  }
  receiveComponent(nextElement) {
    const lastProps = this._currentElement.props;
    const nextProps = nextElement.props;
    this._currentElement = nextElement;

    //需要单独的更新属性
    this._updateDOMProperties(lastProps, nextProps);
    //再更新子节点
    this._updateDOMChildren(nextElement.props.children);
  }

  _updateDOMProperties(lastProps, nextProps) {
    let propKey;

    for (propKey in lastProps) {
      //新的属性里有，或者propKey是在原型上的直接跳过。这样剩下的都是不在新属性集合里的。需要删除
      if (
        nextProps.hasOwnProperty(propKey) ||
        !lastProps.hasOwnProperty(propKey)
      ) {
        continue;
      }

      //对于那种特殊的，比如这里的事件监听的属性我们需要去掉监听
      if (/^on[A-Za-z]/.test(propKey)) {
        var eventType = propKey.replace("on", "");
        //针对当前的节点取消事件代理
        document.removeEventListener(
          '[data-reactid="' + this._rootNodeID + '"]',
          eventType,
          lastProps[propKey]
        );
        continue;
      }

      //从dom上删除不需要的属性
      $('[data-reactid="' + this._rootNodeID + '"]').removeAttr(propKey);
    }

    //对于新的属性，需要写到dom节点上
    for (propKey in nextProps) {
      //对于事件监听的属性我们需要特殊处理
      if (/^on[A-Za-z]/.test(propKey)) {
        var eventType = propKey.replace("on", "");
        //以前如果已经有，说明有了监听，需要先去掉
        lastProps[propKey] &&
          document.removeEventListener(
            '[data-reactid="' + this._rootNodeID + '"]',
            eventType,
            lastProps[propKey]
          );
        //针对当前的节点添加事件代理,以_rootNodeID为命名空间
        document.addEventListener(
          '[data-reactid="' + this._rootNodeID + '"]',
          eventType + "." + this._rootNodeID,
          nextProps[propKey]
        );
        continue;
      }

      if (propKey == "children") continue;

      //添加新的属性，或者是更新老的同名属性
      $('[data-reactid="' + this._rootNodeID + '"]').prop(
        propKey,
        nextProps[propKey]
      );
    }
  }

  _updateDOMChildren(nextChildrenElements) {
    updateDepth++;
    //_diff用来递归找出差别,组装差异对象,添加到更新队列diffQueue。
    this._diff(diffQueue, nextChildrenElements);
    updateDepth--;
    if (updateDepth == 0) {
      //在需要的时候调用patch，执行具体的dom操作
      this._patch(diffQueue);
      diffQueue = [];
    }
  }
  _diff(diffQueue, nextChildrenElements) {
    //拿到之前的子节点的 component类型对象的集合,这个是在刚开始渲染时赋值的，记不得的可以翻上面
    //_renderedChildren 本来是数组，我们搞成map
    var prevChildren = flattenChildren(this._renderedChildren);
    //生成新的子节点的component对象集合，这里注意，会复用老的component对象
    var nextChildren = generateComponentChildren(
      prevChildren,
      nextChildrenElements
    );
    //重新赋值_renderedChildren，使用最新的。
    this._renderedChildren = [];
    $.each(nextChildren, (key, instance) => {
      this._renderedChildren.push(instance);
    });

    let nextIndex = 0; //代表到达的新的节点的index

    for (let name in nextChildren) {
      if (!nextChildren.hasOwnProperty(name)) {
        continue;
      }

      let prevChild = prevChildren && prevChildren[name];
      let nextChild = nextChildren[name];

      //相同的话，说明是使用的同一个component,所以我们需要做移动的操作
      if (prevChild === nextChild) {
        diffQueue.push({
          parentId: this._rootNodeID,
          parentNode: $("[data-reactid=" + this._rootNodeID + "]"),
          type: UPATE_TYPES.MOVE_EXISTING,
          fromIndex: prevChild._mountIndex,
          toIndex: nextIndex
        });
      } else {
        if (prevChild) {
          diffQueue.push({
            parentId: this._rootNodeID,
            parentNode: $("[data-reactid=" + this._rootNodeID + "]"),
            type: UPATE_TYPES.REMOVE_NODE,
            fromIndex: prevChild._mountIndex,
            toIndex: null
          });

          //如果以前已经渲染过了，记得先去掉以前所有的事件监听，通过命名空间全部清空
          if (prevChild._rootNodeID) {
            $(document).undelegate("." + prevChild._rootNodeID);
          }

          diffQueue.push({
            parentId: this._rootNodeID,
            parentNode: $("[data-reactid=" + this._rootNodeID + "]"),
            type: UPATE_TYPES.INSERT_MARKUP,
            fromIndex: prevChild._mountIndex,
            toIndex: nextIndex,
            markup: nextChild.mountComponent()
          });
        }
      }
      //更新mount的index
      nextChild._mountIndex = nextIndex;
      nextIndex++;
    }

    //对于老的节点里有，新的节点里没有的那些，也全都删除掉
    for (let name in prevChildren) {
      if (
        prevChildren.hasOwnProperty(name) &&
        !(nextChildren && nextChildren.hasOwnProperty(name))
      ) {
        diffQueue.push({
          parentId: this._rootNodeID,
          parentNode: $("[data-reactid=" + this._rootNodeID + "]"),
          type: UPATE_TYPES.REMOVE_NODE,
          fromIndex: prevChild._mountIndex,
          toIndex: null
        });

        //如果以前已经渲染过了，记得先去掉以前所有的事件监听
        if (prevChildren[name]._rootNodeID) {
          $(document).undelegate("." + prevChildren[name]._rootNodeID);
        }
      }
    }
  }
}

class MeactCompositeComponent {
  constructor(element) {
    this._currentElement = element;
    this._rootNodeID = null;
    this._instance = null;
  }

  mountComponent(rootID) {
    this._rootNodeID = rootID;
    const publicProps = this._currentElement.props;
    const MeactClass = this._currentElement.type;
    let inst = new MeactClass(publicProps);
    this._instance = inst;
    //保留对当前comonent的引用，下面更新会用到
    inst._reactInternalInstance = this;

    if (inst.componentWillMount) {
      inst.componentWillMount();
      //这里在原始的reactjs其实还有一层处理，就是  componentWillMount调用setstate，不会触发rerender而是自动提前合并，这里为了保持简单，就略去了
    }

    //调用ReactClass的实例的render方法,返回一个element或者一个文本节点
    let renderedElement = this._instance.render();

    let renderedComponentInstance = instantiateMeactComponent(renderedElement);
    this._renderedComponent = renderedComponentInstance;

    let renderedMarkup = renderedComponentInstance.mountComponent(
      this._rootNodeID
    );

    //之前我们在React.render方法最后触发了mountReady事件，所以这里可以监听，在渲染完成后会触发。
    inst.componentDidMount && inst.componentDidMount();
    // $(document).on("mountReady", function() {
    //   //调用inst.componentDidMount
    //   inst.componentDidMount && inst.componentDidMount();
    // });

    return renderedMarkup;
  }
  receiveComponent(nextElement, newState) {
    //如果接受了新的，就使用最新的element
    this._currentElement = nextElement || this._currentElement;

    let inst = this._instance;
    //合并state
    let nextState = { ...inst.state, ...newState };
    let nextProps = this._currentElement.props;

    //改写state
    inst.state = nextState;

    //如果inst有shouldComponentUpdate并且返回false。说明组件本身判断不要更新，就直接返回。
    if (
      inst.componentWillUpdate &&
      inst.shouldComponentUpdate(nextProps, nextState) === false
    )
      return;

    //生命周期管理，如果有componentWillUpdate，就调用，表示开始要更新了。
    if (inst.componentWillUpdate)
      inst.componentWillUpdate(nextProps, nextState);

    let prevComponentInstance = this._renderedComponent;
    let prevRenderedElement = prevComponentInstance._currentElement;
    //重新执行render拿到对应的新element;
    let nextRenderedElement = this._instance.render();

    //判断是需要更新还是直接就重新渲染
    //注意这里的_shouldUpdateMeactComponent跟上面的不同哦 这个是全局的方法
    if (_shouldUpdateMeactComponent(prevRenderedElement, nextRenderedElement)) {
      //如果需要更新，就继续调用子节点的receiveComponent的方法，传入新的element更新子节点。
      prevComponentInstance.receiveComponent(nextRenderedElement);
      //调用componentDidUpdate表示更新完成了
      inst.componentDidUpdate && inst.componentDidUpdate();
    } else {
      //如果发现完全是不同的两种element，那就干脆重新渲染了
      var thisID = this._rootNodeID;
      //重新new一个对应的component，
      this._renderedComponent = this._instantiateReactComponent(
        nextRenderedElement
      );
      //重新生成对应的元素内容
      var nextMarkup = _renderedComponent.mountComponent(thisID);
      //替换整个节点
      $('[data-reactid="' + this._rootNodeID + '"]').replaceWith(nextMarkup);
    }
  }
}

function instantiateMeactComponent(node) {
  if (typeof node === "string" || typeof node === "number") {
    return new MeactDOMTextComponent(node);
  }

  if (typeof node === "object" && typeof node.type === "string") {
    return new MeactDOMComponent(node);
  }

  if (typeof node === "object" && typeof node.type === "function") {
    return new MeactCompositeComponent(node);
  }
}

//用来判定两个element需不需要更新
//这里的key是我们createElement的时候可以选择性的传入的。用来标识这个element，当发现key不同时，我们就可以直接重新渲染，不需要去更新了。
const _shouldUpdateMeactComponent = function(prevElement, nextElement) {
  if (prevElement != null && nextElement != null) {
    const prevType = typeof prevElement;
    const nextType = typeof nextElement;
    if (prevType === "string" || prevType === "number") {
      return nextType === "string" || nextType === "number";
    } else {
      return (
        nextType === "object" &&
        prevElement.type === nextElement.type &&
        prevElement.key === nextElement.key
      );
    }
  }
  return false;
};

function MeactElement(type, key, props) {
  this.type = type;
  this.key = key;
  this.props = props;
}

class MeactClass {
  constructor() {}

  render() {}

  setState(newState) {
    this._reactInternalInstance.receiveComponent(null, newState);
  }
}

const Meact = {
  nextMeactRootIndex: 0,
  createClass: function(spec) {
    let Constructor = function(props) {
      this.props = props;
      this.state = this.getInitialState ? this.getInitialState() : null;
    };
    Constructor.prototype = new MeactClass();
    Constructor.prototype.constructor = Constructor;
    Object.assign(Constructor.prototype, spec);
    return Constructor;
  },
  createElement: function(type, config, ...children) {
    let props = {},
      propName;

    config = config || {};
    let key = config.key || null;

    for (propName in config) {
      if (config.hasOwnProperty(propName) && propName !== "key") {
        props[propName] = config[propName];
      }
    }

    props.children = children;

    return new MeactElement(type, key, props);
  },
  render: function(element, container) {
    const componentInstance = instantiateMeactComponent(element);
    const markup = componentInstance.mountComponent(Meact.nextMeactRootIndex++);
    document.querySelector(container).innerHTML = markup;
    // trigger mountReady
  }
};
