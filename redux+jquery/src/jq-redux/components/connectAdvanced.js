import { Component } from "../../jq-component";
import Subscription from "../utils/Subscription";
import warning from "../utils/warning";

let store;

export function setStore(sto) {
  if (!store) {
    store = sto;
  }
}

function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  const selector = {
    run: function runComponentSelector(props) {
      try {
        const nextProps = sourceSelector(store.getState(), props);
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true;
          selector.props = nextProps;
          selector.error = null;
        }
      } catch (error) {
        selector.shouldComponentUpdate = true;
        selector.error = error;
      }
    }
  };

  return selector;
}

export default function connectAdvanced(
  selectorFactory,
  { ...connectOptions }
) {
  return function WrapWithConnect(WrappedComponent) {
    const selectorFactoryOptions = {
      ...connectOptions,
      WrappedComponent
    };

    class Connect {
      constructor(props) {
        if (!store) {
          warning("调用connect需要先调用setStore方法传入store");
        }

        this.store = store;
        this.initComponent(props);
        this.initSelector();
        this.initSubscription();
      }

      initSelector() {
        const sourceSelector = selectorFactory(
          this.store.dispatch,
          selectorFactoryOptions
        );
        this.selector = makeSelectorStateful(sourceSelector, this.store);
        this.onStateChange();
      }

      initSubscription() {
        this.subscription = new Subscription(
          this.store,
          this.onStateChange.bind(this)
        );
      }

      onStateChange() {
        this.selector.run();
        if (this.selector.shouldComponentUpdate) {
          this.wrappedComponent.props = this.selector.props;
          this.selector.shouldComponentUpdate = false;
        }
      }

      ////////非react-redux方法/////////
      initComponent(props) {
        this.wrappedComponent = new WrappedComponent(props);
      }
    }

    return Connect;
  };
}
