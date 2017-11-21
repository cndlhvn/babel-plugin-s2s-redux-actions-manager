module.exports = babel => {
  var t = babel.types;

  return {
    name: "s2s-redux-actions-manager",
    visitor: {
      Program: {
        enter(path, state) {

        }
      }
    }
  }
}
