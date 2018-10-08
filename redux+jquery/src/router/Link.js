const Link = props => {
  return `<a href="#${props.path}" class="${props.classname || ""}">${
    props.children
  }</a>`;
};

export default Link;
