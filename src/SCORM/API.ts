type CMIElement = string;
type CMIErrorCode = string;

export interface SCORMAPI {
  // – Begins a communication session with the LMS.
  LMSInitialize(msg:string):boolean;
  // – Ends a communication session with the LMS.
  LMSFinish(msg:string):boolean;
  // – Retrieves a value from the LMS.
  LMSGetValue(element:CMIElement):string;
  // – Saves a value to the LMS.
  LMSSetValue(element:CMIElement, value:string):string;
  // – Indicates to the LMS that all data should be persisted (not required).
  LMSCommit(msg:string):boolean ;
  // – Returns the error code that resulted from the last API call.
  LMSGetLastError():CMIErrorCode;
  // – Returns a short string describing the specified error code.
  LMSGetErrorString(errorCode:CMIErrorCode):string;
  // – Returns detailed information about the last error that occurred.
  LMSGetDiagnostic(errorCode:CMIErrorCode):string;
}