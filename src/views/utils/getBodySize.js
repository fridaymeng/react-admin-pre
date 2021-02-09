const getBodySize = (func, delay) => {
  return {
    height: document.documentElement.clientHeight || document.body.clientHeight,
    width: document.documentElement.clientWidth || document.body.clientWidth,
  };
};

export { getBodySize };
