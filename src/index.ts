declare const define:any;
declare const module:any;

((() => {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = new Object();
  } else if (typeof define === 'function' && define.amd) {
    define(new Object());
  }
}).call(this));
