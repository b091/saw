import {SCORMAPI, CMIElement, CMIErrorCode} from './API';

export class SCORMAPIClass implements SCORMAPI {
  // – Begins a communication session with the LMS.
  public LMSInitialize(msg:string):boolean {
    return null;
  }

  // – Ends a communication session with the LMS.
  public LMSFinish(msg:string):boolean {
    return null;
  }

  // – Retrieves a value from the LMS.
  public LMSGetValue(element:CMIElement):string {
    return null;
  }

  // – Saves a value to the LMS.
  public LMSSetValue(element:CMIElement, value:string):string {
    return null;
  }

  // – Indicates to the LMS that all data should be persisted (not required).
  public LMSCommit(msg:string):boolean {
    return null;
  }

  // – Returns the error code that resulted from the last API call.
  public LMSGetLastError():CMIErrorCode {
    return null;
  }

  // – Returns a short string describing the specified error code.
  public LMSGetErrorString(errorCode:CMIErrorCode):string {
    return null;
  }

  // – Returns detailed information about the last error that occurred.
  public LMSGetDiagnostic(errorCode:CMIErrorCode):string {
    return null;
  }
}
