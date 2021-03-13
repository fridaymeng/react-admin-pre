/**
 *
 * @param {func} 接受纯函数作为参数
 */
import { throttle } from "./throttleFunc";

const resize = (func) => {
  function onResize() {
    if (func && typeof func === "function") {
      throttle(func, 1000);
    }
  }

  window.addEventListener("resize", onResize);
};

export { resize };
