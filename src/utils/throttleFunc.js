/**
 *
 * @param {func} 函数作为参数
 * @param {delay} 延迟时间，单位毫秒
 */
const throttle = (func, delay) => {
  clearTimeout(func.tId);
  func.tId = setTimeout(function () {
    func.call();
  }, delay);
};

export { throttle };
