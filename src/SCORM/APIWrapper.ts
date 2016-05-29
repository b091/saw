import {findAPI} from './findAPI';
import {STATUS_CODE} from './STATUS_CODE';
import {SCORMAPI} from './API';

export class APIWrapper {

  public sessionLogs:Array<LOG> = [];

  private LMS_INITIALIZED:boolean = false;
  private API:SCORMAPI = null;

  public unset():void {
    this.LMS_INITIALIZED = false;
    this.API = null;
  }

  public configure():void {
    this.API = findAPI(window);
    if ((this.API == null) && (window.opener != null) && (typeof(window.opener) !== 'undefined')) {
      this.API = findAPI(window.opener);
    }

    if (this.API == null) {
      throw new Error('A valid SCORM API Adapter can not be found in the window or in the window.opener');
    }
  }

  public isConfigured():boolean {
    return !(this.API == null);
  }

  public isInitialized():boolean {
    return this.LMS_INITIALIZED;
  }

  public lmsInitialize():void {
    // see 3.2.2.1 LMSInitialize
    const operationName:string = 'LMSInitialize';
    this.LMS_INITIALIZED = this.isSucceeded(this.API.LMSInitialize(''));
    this.logOperation(operationName);
    if (!this.isInitialized()) {
      this.abort(operationName);
    }
  }

  public lmsCommit():void {
    const operationName:string = 'LMSCommit';
    this.logOperation(operationName);
    if (!this.isSucceeded(this.API.LMSCommit(''))) {
      this.abort(operationName);
    }
  }

  public lmsFinish():void {
    const operationName:string = 'LMSFinish';
    this.logOperation(operationName);
    if (!this.isSucceeded(this.API.LMSFinish(''))) {
      this.abort(operationName);
    }

    this.unset();
  }

  public setScormValue(parameter:string, value:string):void {
    const operationName:string = 'LMSSetValue';
    this.logOperation(operationName, {'parameter': parameter, 'value': value});
    if (!this.isSucceeded(this.API.LMSSetValue(parameter, value))) {
      this.abort(operationName);
    }
  }

  public getScormValue(parameter:string):string {
    const value:string = this.API.LMSGetValue(parameter);
    this.logOperation('LMSGetValue', {'parameter': parameter, 'value': value});
    return value;
  }

  // A convenience method that do the correct sequence of calls to initialize the communication with the lms
  public initialize():void {
    this.configure();
    this.lmsInitialize();
  }

  // A convenience method with a more
  public commit():void {
    this.lmsCommit();
  }

  // A convenience method that do the correct sequence of calls to close the communication with the lms
  public finish():void {
    this.lmsCommit();
    this.lmsFinish();
  }

  public abort(action:string):void {
    this.LMS_INITIALIZED = false;
    this.API = null;

    throw new Error(`${action} failed`);
  }

  public getLastError():ERROR {
    const error:string = this.API.LMSGetLastError();

    return {
      code: parseInt(error, 10),
      message: STATUS_CODE[error]
    };
  }

  public logOperation(scormAPIFn:string, scormAPIFnArguments?:any):void {
    const scormLastErrCode:string = this.API.LMSGetLastError();
    this.sessionLogs.push({
      'timestamp': Date.now(),
      'scormFn': scormAPIFn,
      'scormFnArgs': scormAPIFnArguments,
      'errorCode': scormLastErrCode,
      'errorCodeString': STATUS_CODE[scormLastErrCode],
      'errorCodeStringLMS': this.API.LMSGetErrorString(scormLastErrCode),
      'diagnostic': this.API.LMSGetDiagnostic(scormLastErrCode)
    });
  }

  private isSucceeded(apiCall:any):boolean {
    return 'true' === String(apiCall);
  }

}

interface ERROR {
  code:number;
  message:string;
}

interface LOG {
  timestamp:number;
  scormFn:string;
  scormFnArgs:any;
  errorCode:string;
  errorCodeString:string;
  errorCodeStringLMS:string;
  diagnostic:string;
}
