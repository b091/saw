import {APIWrapper} from './SCORM/APIWrapper';
declare const define:any;

((() => {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = new APIWrapper();
    }
    else if (typeof define === 'function' && define.amd) {
        define(new APIWrapper());
    }
}).call(this));
