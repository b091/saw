// __tests__/saw-test.js
jest.dontMock('../saw.js');

describe('saw', () => {
    var saw;
    beforeEach(() => {
        saw = require('../saw.js');
    });

    afterEach(() => {
        saw = null;
    });

    it('should be an object', () => {
        expect(saw).toBeDefined();
    });

    it('should have an attribute to store the API handle', () => {
        expect(saw.API).toBeDefined();
    });

    it('should have an attribute to store the LMS initialization status', () => {
        expect(saw.LMSInitialized).toBeDefined();
    });

    it('should have an attribute to store session logs (interactio with the API hanlde)', () => {
        expect(saw.sessionLogs).toBeDefined();
        expect(saw.sessionLogs.length).toEqual(0);
    });

    it('should have an isConfigured function', () => {
        expect(saw.isConfigured).toBeDefined();
    });

    it('should not be configured before init invocation', () => {
        expect(saw.isConfigured()).toBe(false);
    });

    it('should have an lmsInitialize function', () => {
        expect(saw.lmsInitialize).toBeDefined();
    });

    it('should have a lmsCommit function', () => {
        expect(saw.lmsCommit).toBeDefined();
    });

    it('should have a lmsFinish function', () => {
        expect(saw.lmsFinish).toBeDefined();
    });

    it('should have a setScormValue function', () => {
        expect(saw.setScormValue).toBeDefined();
    });

    it('should have a getScormValue function', () => {
        expect(saw.getScormValue).toBeDefined();
    });

    it('should not be initialize before init invocation', () => {
        expect(saw.isInitialized()).toBe(false);
    });

    it('should have an initialize function', () => {
        expect(saw.initialize).toBeDefined();
    });

    it('should have a logOperation function', () => {
        expect(saw.logOperation).toBeDefined();
    });

    it('should have a abort function', () => {
        expect(saw.abort).toBeDefined();
    });

    it('should have a commit function', () => {
        expect(saw.commit).toBeDefined();
    });

    it('should have a finish function', () => {
        expect(saw.finish).toBeDefined();
    });

    it('should have an unset function', () => {
        expect(saw.unset).toBeDefined();
    });

    /**
     * saw.configure()
     */
    describe('configure()', () => {
        describe('configure() with a not available API Adapter', () => {

            it('should throw an error if no API Adapter is available', () => {
                expect(() => {
                    saw.configure()
                }).toThrow(new Error("A valid SCORM API Adapter can not be found in the window or in the window.opener"));
                expect(saw.isConfigured()).toBe(false);
            });
        });

        describe('configure() with an available API Adapter', () => {

            it('should be initialized after init invocation if the adapted is defined in the current window', () => {
                window.API = {};
                saw.configure();
                expect(saw.isConfigured()).toBe(true);
            });

            it('should be initialized after init invocation if the API is defined in the window.opener', () => {
                var opener = window.opener;
                var parent = {};
                // building the nested parent structure with max level of deep in parent search
                for (var i = 0; i++; i <= 7) {
                    parent = {'parent': parent};
                }
                window.parent = parent;
                window.opener = {};
                window.opener.API = {};

                saw.configure();
                expect(saw.isConfigured()).toBe(true);
                window.opener = opener;
            });
        });
    });

    /**
     *saw.lmsInitialize()
     */
    describe('lmsInitialize', () => {
        var LMSInit = jest.genMockFunction();
        var logOperation = jest.genMockFunction();

        beforeEach(() => {
            saw = require('../saw.js');
            saw.logOperation = logOperation;
            window.API = {
                LMSInitialize: LMSInit
            };

        });

        afterEach(() => {
            saw = null;
            delete window.API;
        });

        it('should be ok if the LMS can be initialized', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");

            saw.initialize();
            expect(saw.isInitialized()).toBe(true);
            expect(LMSInit).toBeCalled();
            expect(LMSInit).toBeCalledWith('');
        });

        it('should be ok if the LMS can be initialized but do not return a standard String "true"', () => {
            LMSInit.mockReturnValueOnce(true);

            saw.initialize();
            expect(saw.isInitialized()).toBe(true);
            expect(LMSInit).toBeCalled();
            expect(LMSInit).toBeCalledWith('');
        });

        it('should throw an error if LMS can not be initialized', () => {
            //SCORM standard expect a String "false" to be returned
            LMSInit.mockReturnValueOnce("false");

            expect(() => {
                saw.initialize();
            }).toThrow(new Error('LMSInitialize failed'));
            expect(saw.isInitialized()).toBe(false);
        });

    });

    /**
     *saw.logOperation()
     */
    describe('logOperation', () => {
        var LMSInit = jest.genMockFunction();
        var LMSGetLastErr = jest.genMockFunction();
        var LMSGetErrStr = jest.genMockFunction();
        var LMSGetDia = jest.genMockFunction();

        beforeEach(() => {
            saw = require('../saw.js');
            window.API = {
                LMSInitialize: LMSInit,
                LMSGetLastError: LMSGetLastErr,
                LMSGetErrorString: LMSGetErrStr,
                LMSGetDiagnostic: LMSGetDia
            };

        });

        afterEach(() => {
            saw = null;
            delete window.API;
        });

        it('should correctly initialized sessionLogs attribute', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");

            saw.initialize();
            expect(saw.sessionLogs.length).toEqual(1);
            expect(saw.sessionLogs[0].scormFn).toEqual('LMSInitialize');
        });

        it('should add a log entry to the sessionLogs attribute when invoked', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSGetLastErr.mockReturnValue("0");
            LMSGetErrStr.mockReturnValue("NoErrorStr");
            LMSGetDia.mockReturnValue("Diagnostic");
            saw.initialize();
            saw.logOperation("foo", "bar");
            expect(saw.sessionLogs.length).toEqual(2);

            expect(saw.sessionLogs[1].timestamp).toBeDefined();
            expect(saw.sessionLogs[1].scormFn).toEqual('foo');
            expect(saw.sessionLogs[1].scormFnArgs).toEqual('bar');
            expect(saw.sessionLogs[1].errorCode).toEqual("0");
            expect(saw.sessionLogs[1].errorCodeString).toEqual("NoError");
            expect(LMSGetErrStr).toBeCalledWith("0");
            expect(saw.sessionLogs[1].errorCodeStringLMS).toEqual("NoErrorStr");
            expect(saw.sessionLogs[1].diagnostic).toEqual("Diagnostic");
        });
    });

    /**
     *saw.abort()
     */
    describe('abort', () => {
        var LMSInit = jest.genMockFunction();
        var LMSGetLastErr = jest.genMockFunction();
        var LMSGetErrStr = jest.genMockFunction();
        var LMSGetDia = jest.genMockFunction();

        var LMSCommit = jest.genMockFunction();

        beforeEach(() => {
            saw = require('../saw.js');
            window.API = {
                LMSInitialize: LMSInit,
                LMSCommit: LMSCommit,
                LMSGetLastError: LMSGetLastErr,
                LMSGetErrorString: LMSGetErrStr,
                LMSGetDiagnostic: LMSGetDia
            };

        });

        afterEach(() => {
            saw = null;
            delete window.API;
        });

        it('should raise an Exception', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");
            saw.initialize();

            expect(() => {
                saw.abort("foo");
            }).toThrow(new Error('foo failed'));
            expect(saw.isInitialized()).toBe(false);
        });
    });

    /**
     *saw.lmsCommit()
     */
    describe('lmsCommit', () => {
        var LMSInit = jest.genMockFunction();
        var LMSCommit = jest.genMockFunction();

        beforeEach(() => {
            saw = require('../saw.js');
            window.API = {
                LMSInitialize: LMSInit,
                LMSCommit: LMSCommit,
            };
        });

        afterEach(() => {
            saw = null;
            delete window.API;
        });

        it('should be ok if LMSCommit succeed', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSCommit.mockReturnValueOnce("true");
            spyOn(saw, 'logOperation');
            saw.initialize();
            saw.lmsCommit();
            expect(saw.isInitialized()).toBe(true);
            expect(LMSCommit).toBeCalled();
            expect(LMSCommit).toBeCalledWith('');
            expect(saw.logOperation).toHaveBeenCalled();
            expect(saw.logOperation).toHaveBeenCalledWith("LMSCommit");
        });

        it('should throw an error if LMSCommit fails', () => {
            //SCORM standard expect a String "false" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSCommit.mockReturnValueOnce("false");
            spyOn(saw, 'logOperation');
            spyOn(saw, 'abort');
            saw.initialize();
            saw.lmsCommit();

            expect(saw.isInitialized()).toBe(true);
            expect(LMSCommit).toBeCalled();
            expect(LMSCommit).toBeCalledWith('');
            expect(saw.logOperation).toHaveBeenCalled();
            expect(saw.logOperation).toHaveBeenCalledWith("LMSCommit");
            expect(saw.abort).toHaveBeenCalled();
            expect(saw.abort).toHaveBeenCalledWith("LMSCommit");
        });
    });

    /**
     *saw.lmsFinish()
     */
    describe('lmsFinish', () => {
        var LMSInit = jest.genMockFunction();
        var LMSFinish = jest.genMockFunction();

        beforeEach(() => {
            saw = require('../saw.js');
            window.API = {
                LMSInitialize: LMSInit,
                LMSFinish: LMSFinish,
            };
        });

        afterEach(() => {
            saw = null;
            delete window.API;
        });

        it('should be ok if LMSFinish succeed', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSFinish.mockReturnValueOnce("true");
            spyOn(saw, 'logOperation');
            spyOn(saw, 'unset');
            saw.initialize();
            saw.lmsFinish();
            expect(LMSFinish).toBeCalled();
            expect(LMSFinish).toBeCalledWith('');
            expect(saw.logOperation).toHaveBeenCalled();
            expect(saw.logOperation).toHaveBeenCalledWith("LMSFinish");
            expect(saw.unset).toHaveBeenCalled();
        });

        it('should throw an error if LMSCommit fails', () => {
            //SCORM standard expect a String "false" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSFinish.mockReturnValueOnce("false");
            spyOn(saw, 'logOperation');
            spyOn(saw, 'abort');
            saw.initialize();
            saw.lmsFinish();

            expect(saw.isInitialized()).toBe(false);
            expect(LMSFinish).toBeCalled();
            expect(LMSFinish).toBeCalledWith('');
            expect(saw.logOperation).toHaveBeenCalled();
            expect(saw.logOperation).toHaveBeenCalledWith("LMSFinish");
            expect(saw.abort).toHaveBeenCalled();
            expect(saw.abort).toHaveBeenCalledWith("LMSFinish");
        });
    });

    /**
     *saw.setScormValue()
     */
    describe('setScormValue', () => {
        var LMSInit = jest.genMockFunction();
        var LMSSetValue = jest.genMockFunction();

        beforeEach(() => {
            saw = require('../saw.js');
            window.API = {
                LMSInitialize: LMSInit,
                LMSSetValue: LMSSetValue,
            };
        });

        afterEach(() => {
            saw = null;
            delete window.API;
        });

        it('should be ok if LMSSetValue succeed', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSSetValue.mockReturnValueOnce("true");
            spyOn(saw, 'logOperation');
            saw.initialize();
            saw.setScormValue('foo', 'bar');

            expect(LMSSetValue).toBeCalled();
            expect(LMSSetValue).toBeCalledWith('foo', 'bar');
            expect(saw.logOperation).toHaveBeenCalled();
            expect(saw.logOperation).toHaveBeenCalledWith("LMSSetValue", {'parameter': 'foo', 'value': 'bar'});
        });

        it('should throw an error if LMSCommit fails', () => {
            //SCORM standard expect a String "false" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSSetValue.mockReturnValueOnce("false");
            spyOn(saw, 'logOperation');
            spyOn(saw, 'abort');
            saw.initialize();
            saw.setScormValue('foo', 'bar');

            expect(LMSSetValue).toBeCalled();
            expect(LMSSetValue).toBeCalledWith('foo', 'bar');
            expect(saw.logOperation).toHaveBeenCalled();
            expect(saw.logOperation).toHaveBeenCalledWith("LMSSetValue", {'parameter': 'foo', 'value': 'bar'});
            expect(saw.abort).toHaveBeenCalled();
            expect(saw.abort).toHaveBeenCalledWith("LMSSetValue");
        });
    });

    /**
     *saw.getScormValue()
     */
    describe('getScormValue', () => {
        var LMSInit = jest.genMockFunction();
        var LMSGetValue = jest.genMockFunction();

        beforeEach(() => {
            saw = require('../saw.js');
            window.API = {
                LMSInitialize: LMSInit,
                LMSGetValue: LMSGetValue,
            };
        });

        afterEach(() => {
            saw = null;
            delete window.API;
        });

        it('should be ok if LMSGetValue succeed', () => {
            //SCORM standard expect a String "true" to be returned
            LMSInit.mockReturnValueOnce("true");
            LMSGetValue.mockReturnValueOnce("bar");
            spyOn(saw, 'logOperation');
            saw.initialize();

            expect(saw.getScormValue('foo')).toEqual('bar');
            expect(LMSGetValue).toBeCalled();
            expect(LMSGetValue).toBeCalledWith('foo');
            expect(saw.logOperation).toHaveBeenCalled();
            expect(saw.logOperation).toHaveBeenCalledWith("LMSGetValue", {'parameter': 'foo', 'value': 'bar'});
        });
    });

});
