define(["require", "exports", './SCORM/APIWrapper'], function (require, exports, APIWrapper_1) {
    "use strict";
    ((function () {
        if (typeof module === 'object' && typeof module.exports === 'object') {
            module.exports = new APIWrapper_1.APIWrapper();
        }
        else if (typeof define === 'function' && define.amd) {
            define(new APIWrapper_1.APIWrapper());
        }
    }).call(this));
});
//# sourceMappingURL=index.js.map