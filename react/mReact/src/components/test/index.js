import { h } from "../../mReact";
import Component from "../../mReact/component";

export default class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
