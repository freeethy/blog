import { Component } from "JqComponent";
import history from "./history";
import { compilePath, matchPath } from "./utils";

class Route extends Component {
  constructor(props) {
    super(props);

    this.pathReAndKeys = compilePath(props.path, {
      exact: props.exact,
      strict: props.strict,
      sensitive: props.sensitive
    });

    this.state = {
      match: matchPath(location.pathname, props, this.pathReAndKeys)
    };

    this.unlisten = history.listen(this.urlChange);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { match } = this.state;
    if (!match) return;
  }

  urlChange = () => {
    this.setState({
      match: matchPath(location.pathname, this.props, this.pathReAndKeys)
    });
  };
}
