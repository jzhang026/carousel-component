let css = require("css");

module.exports = function (source, map) {
  let styleSheet = css.parse(source);
  let pathArr = this.resourcePath.split("/");
  let pathName = `.${pathArr[pathArr.length - 2].toLowerCase()}`;

  for (const rule of styleSheet.stylesheet.rules) {
    rule.selectors = rule.selectors.map((selector) => {
      return new RegExp(`^${pathName}`).test(selector)
        ? selector
        : `${pathName} ${selector}`;
    });
  }
  let cssRules = JSON.stringify(css.stringify(styleSheet));

  return `
  let style  = document.createElement('style')
  style.innerHTML = ${cssRules}
  document.documentElement.appendChild(style)`;
};
