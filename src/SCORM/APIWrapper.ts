import {findAPI} from './findAPI';
import {StatusCode} from './StatusCode';

export class APIWrapper {

  private LMSInitialized = false;
  private API = null;
  private sessionLogs = [];

  constructor() {
  }

  public unset() {
    this.LMSInitialized = false;
    this.API = null;
  }

  public configure() {
    this.API = findAPI(window);
    if ((this.API == null) && (window.opener != null) && (typeof(window.opener) != 'undefined')) {
      this.API = findAPI(window.opener);
    }

    if (this.API == null) {
      throw new Error('A valid SCORM API Adapter can not be found in the window or in the window.opener');
    }
  }

  public isConfigured() {
    return !(this.API == null);
  }

  public isInitialized() {
    return this.LMSInitialized;
  }

  public lmsInitialize() {
    //see 3.2.2.1 LMSInitialize
    this.LMSInitialized = 'true' === String(this.API.LMSInitialize(''));
    this.logOperation('LMSInitialize');
    if (!this.isInitialized()) {
      this.abort('LMSInitialize');
    }
  }

  public lmsCommit() {
    const succeeded = 'true' === String(this.API.LMSCommit(''));
    this.logOperation('LMSCommit');
    if (!succeeded) {
      this.abort('LMSCommit');
    }
  }

  public lmsFinish() {
    const succeeded = 'true' === String(this.API.LMSFinish(''));
    this.logOperation('LMSFinish');
    if (!succeeded) {
      this.abort('LMSFinish');
    }

    this.unset();
  }

  public setScormValue(parameter, value) {

    const succeeded = 'true' === String(this.API.LMSSetValue(parameter, value));
    this.logOperation('LMSSetValue', {'parameter': parameter, 'value': value});
    if (!succeeded) {
      this.abort('LMSSetValue');
    }
  }

  public getScormValue(parameter) {
    const value = this.API.LMSGetValue(parameter);
    this.logOperation('LMSGetValue', {'parameter': parameter, 'value': value});
    return value;
  }

  // A convenience method that do the correct sequence of calls to initialize the communication with the lms
  public initialize() {
    this.configure();
    this.lmsInitialize();
  }

  // A convenience method with a more
  public commit() {
    this.lmsCommit();
  }

  // A convenience method that do the correct sequence of calls to close the communication with the lms
  public finish() {
    this.lmsCommit();
    this.lmsFinish();
  }

  public abort(action) {
    this.LMSInitialized = false;
    this.API = null;

    throw new Error(`${action} failed`);
  }

  public getLastError() {
    const error = this.API.LMSGetLastError();

    return {
      code: parseInt(error, 10),
      message: StatusCode[error]
    };
  }

  public logOperation(scormAPIFn:string, scormAPIFnArguments?:any):void {
    const scormLastErrCode = this.API.LMSGetLastError();
    const log = {
      'timestamp': Date.now(),
      'scormFn': scormAPIFn,
      'scormFnArgs': scormAPIFnArguments,
      'errorCode': scormLastErrCode,
      'errorCodeString': StatusCode[scormLastErrCode],
      'errorCodeStringLMS': this.API.LMSGetErrorString(scormLastErrCode),
      'diagnostic': this.API.LMSGetDiagnostic('')
    };

    this.sessionLogs.push(log);
  }

}
