/* tslint: disable */

interface APIWrapperStatic {
  sessionLogs:Array<LOG>;
  unset():void;
  configure():void;
  isConfigured():boolean;
  isInitialized():boolean;
  lmsInitialize():void;
  lmsCommit():void;
  lmsFinish():void;
  setScormValue(parameter:string, value:string):void;
  getScormValue(parameter:string):string;
  initialize():void;
  commit():void;
  finish():void;
  abort(action:string):void;
  getLastError():ERROR;
  logOperation(scormAPIFn:string, scormAPIFnArguments?:any):void;
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

declare module 'scorm-api-wrapper-ts' {
  export = SCORMAPIWrapper;
}

declare var SCORMAPIWrapper:APIWrapperStatic;
