export default function createElement(tagName, props, ...children) {
  props = props || {};

  return {
    tagName,
    props,
    children,
    key: props.key || null
  };
}
