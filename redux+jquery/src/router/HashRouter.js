import Component from "JqComponent";
import { compilePath, matchPath } from "./utils";

/*
* props: {
*   history,
*   routes,
*   onEnter,
*   exact,
*   strict,
*   sensitive
* }
*/
class HashRouter extends Component {
  constructor(props) {
    super(props);

    this.children = {};
    this.history = props.history || {
      push(hash) {
        window.location.hash = hash;
      }
    };

    this.routes = props.routes || {};
    // 触发后续生命周期
    this.props = props;
  }

  getChildComponents() {
    return this.children;
  }

  componentDidMount() {
    this.unlistener = this.history.listen(this.renderRoute.bind(this));
    this.history.push(window.location.hash || "/");

    window.addEventListener("hashchange", e => {
      this.history.push(window.location.hash.slice(1));
    });
  }

  componentWillUnmount() {
    this.unlistener();
  }

  render() {
    return "";
  }

  onEnter = () => {
    return true;
  };

  renderRoute() {
    const { exact, strict, sensitive, onEnter = this.onEnter } = this.props;
    const routes = this.routes || {};
    let pathname = window.location.hash.slice(1) || "/";

    if (!onEnter() && pathname !== "/") {
      this.history.push("/");
      return;
    }

    Object.keys(routes).map(v => {
      let { path, component: Element, domId, onEnter = this.onEnter } = routes[
        v
      ];
      let pathReAndKeys = compilePath(path, {
        exact,
        strict,
        sensitive
      });

      let match = matchPath(pathname, { path, exact }, pathReAndKeys);

      if (!match || !onEnter()) return;

      let { path: matchpath, params } = match;
      this.children[v] = new Element({
        domId,
        props: {
          history: this.history,
          location: { pathname: matchpath },
          params
        }
      });
    });
  }
}

export default HashRouter;
