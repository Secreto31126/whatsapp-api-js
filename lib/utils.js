function escapeUnicode(str) {
  return str.replace(/[^\0-~]/g, (ch) => {
    return "\\u" + ("000" + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
export {
  escapeUnicode
};
//# sourceMappingURL=utils.js.map
