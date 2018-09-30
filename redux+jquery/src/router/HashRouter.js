import Component from "JqComponent";
import { compilePath, matchPath } from "./utils";

class HashRouter extends Component {
  constructor(props) {
    super(props);

    this.children = {};

    this.history = {
      push(hash) {
        window.location.hash = hash;
      }
    };

    this.routes = {};
  }

  getChildComponents() {
    return this.children;
  }

  componentDidMount() {
    window.location.hash = window.location.hash || "/";
    this.renderRoute();

    window.addEventListener("hashchange", () => {
      console.log(window.location.hash, "111");
      this.renderRoute();
    });
  }

  render() {
    return "";
  }

  renderRoute() {
    const { exact, strict, sensitive } = this.props;
    const routes = this.routes || {};
    let pathname = window.location.hash.slice(1) || "/";

    if (!this.requireAuth() && pathname !== "/") {
      this.history.push("/");
    }

    Object.keys(routes).map(v => {
      let { path, component: Component, domId } = routes[v];
      let pathReAndKeys = compilePath(path, {
        exact,
        strict,
        sensitive
      });

      let match = matchPath(pathname, { path, exact }, pathReAndKeys);

      if (match) {
        this.children[v] = new Component({
          domId,
          props: {
            history: this.history
          }
        });
        return;
      }
    });
  }

  requireAuth() {
    return true;
  }
}

export default HashRouter;
