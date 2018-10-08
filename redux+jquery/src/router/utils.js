import pathToRegexp from "path-to-regexp";

/* 
*   var keys = []
*   var re = pathToRegexp('/foo/:bar', keys)
*   // re = /^\/foo\/([^\/]+?)\/?$/i
*   // keys = [{ name: 'bar', prefix: '/', delimiter: '/', optional: false, repeat: false, pattern: '[^\\/]+?' }]
*/
export const compilePath = (pattern = "/", options) => {
  const { exact = false, strict = false, sensitive = false } = options;
  const keys = [];
  const re = pathToRegexp(pattern, keys, { end: exact, strict, sensitive });
  return { re, keys };
};

export const matchPath = (pathname, props, pathReAndKeys) => {
  const { path = "/", exact = false } = props;
  const { re, keys } = pathReAndKeys;
  const match = re.exec(pathname);

  if (!match) return null;

  const [url, ...values] = match;
  const isExact = pathname === url;
  if (exact && !isExact) return null;

  return {
    path,
    url: path === "/" && url === "" ? "/" : url,
    isExact,
    params:
      keys.length &&
      keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
  };
};
