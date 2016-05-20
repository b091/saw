define(["require", "exports", './findAPI', './StatusCode'], function (require, exports, findAPI_1, StatusCode_1) {
    "use strict";
    var APIWrapper = (function () {
        function APIWrapper() {
            this.LMSInitialized = false;
            this.API = null;
            this.sessionLogs = [];
        }
        APIWrapper.prototype.unset = function () {
            this.LMSInitialized = false;
            this.API = null;
        };
        APIWrapper.prototype.configure = function () {
            this.API = findAPI_1.findAPI(window);
            if ((this.API == null) && (window.opener != null) && (typeof (window.opener) != 'undefined')) {
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
            return this.LMSInitialized;
        };
        APIWrapper.prototype.lmsInitialize = function () {
            //see 3.2.2.1 LMSInitialize
            this.LMSInitialized = 'true' === String(this.API.LMSInitialize(''));
            this.logOperation('LMSInitialize');
            if (!this.isInitialized()) {
                this.abort('LMSInitialize');
            }
        };
        APIWrapper.prototype.lmsCommit = function () {
            var succeeded = 'true' === String(this.API.LMSCommit(''));
            this.logOperation('LMSCommit');
            if (!succeeded) {
                this.abort('LMSCommit');
            }
        };
        APIWrapper.prototype.lmsFinish = function () {
            var succeeded = 'true' === String(this.API.LMSFinish(''));
            this.logOperation('LMSFinish');
            if (!succeeded) {
                this.abort('LMSFinish');
            }
            this.unset();
        };
        APIWrapper.prototype.setScormValue = function (parameter, value) {
            var succeeded = 'true' === String(this.API.LMSSetValue(parameter, value));
            this.logOperation('LMSSetValue', { 'parameter': parameter, 'value': value });
            if (!succeeded) {
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
            this.LMSInitialized = false;
            this.API = null;
            throw new Error(action + " failed");
        };
        APIWrapper.prototype.getLastError = function () {
            var error = this.API.LMSGetLastError();
            return {
                code: parseInt(error, 10),
                message: StatusCode_1.StatusCode[error]
            };
        };
        APIWrapper.prototype.logOperation = function (scormAPIFn, scormAPIFnArguments) {
            var scormLastErrCode = this.API.LMSGetLastError();
            var log = {
                'timestamp': Date.now(),
                'scormFn': scormAPIFn,
                'scormFnArgs': scormAPIFnArguments,
                'errorCode': scormLastErrCode,
                'errorCodeString': StatusCode_1.StatusCode[scormLastErrCode],
                'errorCodeStringLMS': this.API.LMSGetErrorString(scormLastErrCode),
                'diagnostic': this.API.LMSGetDiagnostic('')
            };
            this.sessionLogs.push(log);
        };
        return APIWrapper;
    }());
    exports.APIWrapper = APIWrapper;
});
//# sourceMappingURL=APIWrapper.js.map