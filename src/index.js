import {saw} from './saw';

((() => {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = new saw();
    }
    else if (typeof define === 'function' && define.amd) {
        define(new saw());
    }
}).call(this));
