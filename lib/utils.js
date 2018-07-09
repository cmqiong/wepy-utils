var Utils = {
  /**
   * [时间戳]
   * UTILS.now()
   */
  now () {
    return new Date().getTime()
  },

  /**
   * [随机数]
   * UTILS.random(min, max)
   */
  random (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  },

  /**
   * 类型判断
   * @param {Any} value 任意需要判断的参数
   * @return {String} 返回的类型
   */
  getObjectType(value) {
    let str = Object.prototype.toString.call(value).split(' ')[1];
    str = str.substr(0, str.length - 1);

    /* Object Array Boolean String Function Number ... */
    return str;
  }
}

module.exports = Utils;
