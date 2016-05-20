import {findAPI} from './findAPI';
import {StatusCode} from './StatusCode';
import {SCORMAPI} from './API';

export class APIWrapper {

  private LMSInitialized:boolean = false;
  private API:SCORMAPI = null;
  public sessionLogs:Array<LOG> = [];


  public unset():void {
    this.LMSInitialized = false;
    this.API = null;
  }

  public configure():void {
    this.API = findAPI(window);
    if ((this.API == null) && (window.opener != null) && (typeof(window.opener) != 'undefined')) {
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
    return this.LMSInitialized;
  }

  public lmsInitialize():void {
    //see 3.2.2.1 LMSInitialize
    this.LMSInitialized = 'true' === String(this.API.LMSInitialize(''));
    this.logOperation('LMSInitialize');
    if (!this.isInitialized()) {
      this.abort('LMSInitialize');
    }
  }

  public lmsCommit():void {
    const succeeded:boolean = 'true' === String(this.API.LMSCommit(''));
    this.logOperation('LMSCommit');
    if (!succeeded) {
      this.abort('LMSCommit');
    }
  }

  public lmsFinish():void {
    const succeeded:boolean = 'true' === String(this.API.LMSFinish(''));
    this.logOperation('LMSFinish');
    if (!succeeded) {
      this.abort('LMSFinish');
    }

    this.unset();
  }

  public setScormValue(parameter, value):void {

    const succeeded:boolean = 'true' === String(this.API.LMSSetValue(parameter, value));
    this.logOperation('LMSSetValue', {'parameter': parameter, 'value': value});
    if (!succeeded) {
      this.abort('LMSSetValue');
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

  public abort(action):void {
    this.LMSInitialized = false;
    this.API = null;

    throw new Error(`${action} failed`);
  }

  public getLastError():ERROR {
    const error:string = this.API.LMSGetLastError();

    return {
      code: parseInt(error, 10),
      message: StatusCode[error]
    };
  }

  public logOperation(scormAPIFn:string, scormAPIFnArguments?:any):void {
    const scormLastErrCode:string = this.API.LMSGetLastError();
    this.sessionLogs.push({
      'timestamp': Date.now(),
      'scormFn': scormAPIFn,
      'scormFnArgs': scormAPIFnArguments,
      'errorCode': scormLastErrCode,
      'errorCodeString': StatusCode[scormLastErrCode],
      'errorCodeStringLMS': this.API.LMSGetErrorString(scormLastErrCode),
      'diagnostic': this.API.LMSGetDiagnostic(scormLastErrCode)
    });
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