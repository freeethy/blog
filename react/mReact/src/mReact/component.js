import { renderComponent } from "./DomRender";

export default class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(newState) {
    // this._reactInternalInstance.updateComponent(null, newState);
    Object.assign(this.state, newstate);
    renderComponent(this);
  }
}
