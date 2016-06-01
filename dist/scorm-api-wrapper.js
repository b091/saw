define("SCORM/API", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("SCORM/findAPI", ["require", "exports"], function (require, exports) {
    "use strict";
    var findAPITries = 0;
    // The function charged to locate the API adapter object presented by the LMS.
    // As described in section 3.3.6.1 of the documentation.
    function findAPI(win) {
        if (win == null) {
            return null;
        }
        while ((win.API == null) && (win.parent != null) && (win.parent !== win)) {
            findAPITries++;
            if (findAPITries > 7) {
                return null;
            }
            win = win.parent;
        }
        return win.API;
    }
    exports.findAPI = findAPI;
});
define("SCORM/STATUS_CODE", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.STATUS_CODE = {
        '0': 'NoError',
        '101': 'GeneralException',
        '102': 'ServerBusy',
        '201': 'InvalidArgumentError',
        '202': 'ElementCannotHaveChildren',
        '203': 'ElementIsNotAnArray',
        '301': 'NotInitialized',
        '401': 'NotImplementedError',
        '402': 'InvalidSetValue',
        '403': 'ElementIsReadOnly',
        '404': 'ElementIsWriteOnly',
        '405': 'IncorrectDataType'
    };
});
define("SCORM/APIWrapper", ["require", "exports", "SCORM/findAPI", "SCORM/STATUS_CODE"], function (require, exports, findAPI_1, STATUS_CODE_1) {
    "use strict";
    var APIWrapper = (function () {
        function APIWrapper() {
            this.sessionLogs = [];
            this.LMS_INITIALIZED = false;
            this.API = null;
        }
        APIWrapper.prototype.unset = function () {
            this.LMS_INITIALIZED = false;
            this.API = null;
        };
        APIWrapper.prototype.configure = function () {
            this.API = findAPI_1.findAPI(window);
            if ((this.API == null) && (window.opener != null) && (typeof (window.opener) !== 'undefined')) {
                this.API = findAPI_1.findAPI(window.opener);
            }
            if (this.API == null) {
                throw new Error('A valid SCORM API Adapter can not be found in the window or in the window.opener');
            }
        };
        APIWrapper.prototype.isConfigured = function () {
            return !(this.API == null);
        };
        APIWrapper.prototype.isInitialized = function () {
            return this.LMS_INITIALIZED;
        };
        APIWrapper.prototype.lmsInitialize = function () {
            // see 3.2.2.1 LMSInitialize
            var operationName = 'LMSInitialize';
            this.LMS_INITIALIZED = this.isSucceeded(this.API.LMSInitialize(''));
            this.logOperation(operationName);
            if (!this.isInitialized()) {
                this.abort(operationName);
            }
        };
        APIWrapper.prototype.lmsCommit = function () {
            var operationName = 'LMSCommit';
            this.logOperation(operationName);
            if (!this.isSucceeded(this.API.LMSCommit(''))) {
                this.abort(operationName);
            }
        };
        APIWrapper.prototype.lmsFinish = function () {
            var operationName = 'LMSFinish';
            this.logOperation(operationName);
            if (!this.isSucceeded(this.API.LMSFinish(''))) {
                this.abort(operationName);
            }
            this.unset();
        };
        APIWrapper.prototype.setScormValue = function (parameter, value) {
            this.logOperation('LMSSetValue', { 'parameter': parameter, 'value': value });
            if (!this.isSucceeded(this.API.LMSSetValue(parameter, value))) {
                this.abort('LMSSetValue');
            }
        };
        APIWrapper.prototype.getScormValue = function (parameter) {
            var value = this.API.LMSGetValue(parameter);
            this.logOperation('LMSGetValue', { 'parameter': parameter, 'value': value });
            return value;
        };
        // A convenience method that do the correct sequence of calls to initialize the communication with the lms
        APIWrapper.prototype.initialize = function () {
            this.configure();
            this.lmsInitialize();
        };
        // A convenience method with a more
        APIWrapper.prototype.commit = function () {
            this.lmsCommit();
        };
        // A convenience method that do the correct sequence of calls to close the communication with the lms
        APIWrapper.prototype.finish = function () {
            this.lmsCommit();
            this.lmsFinish();
        };
        APIWrapper.prototype.abort = function (action) {
            this.LMS_INITIALIZED = false;
            this.API = null;
            throw new Error(action + " failed");
        };
        APIWrapper.prototype.getLastError = function () {
            var error = this.API.LMSGetLastError();
            return {
                code: parseInt(error, 10),
                message: STATUS_CODE_1.STATUS_CODE[error]
            };
        };
        APIWrapper.prototype.logOperation = function (scormAPIFn, scormAPIFnArguments) {
            var scormLastErrCode = this.API.LMSGetLastError();
            this.sessionLogs.push({
                'timestamp': Date.now(),
                'scormFn': scormAPIFn,
                'scormFnArgs': scormAPIFnArguments,
                'errorCode': scormLastErrCode,
                'errorCodeString': STATUS_CODE_1.STATUS_CODE[scormLastErrCode],
                'errorCodeStringLMS': this.API.LMSGetErrorString(scormLastErrCode),
                'diagnostic': this.API.LMSGetDiagnostic(scormLastErrCode)
            });
        };
        APIWrapper.prototype.isSucceeded = function (apiCall) {
            return 'true' === String(apiCall);
        };
        return APIWrapper;
    }());
    exports.APIWrapper = APIWrapper;
});
define("index", ["require", "exports", "SCORM/APIWrapper"], function (require, exports, APIWrapper_1) {
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
