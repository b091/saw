let findAPITries = 0;
// The function charged to locate the API adapter object presented by the LMS.
// As described in section 3.3.6.1 of the documentation.
export function findAPI(win):SCORMAPI {
  if (win == null) {
    return null;
  }
  while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
    findAPITries++;
    if (findAPITries > 7) {
      return null;
    }
    win = win.parent;
  }

  return win.API;
}

interface CMIElement {
}
interface CMIErrorCode {
}
interface SCORMAPI {
  // – Begins a communication session with the LMS.
  LMSInitialize(msg:string):boolean;
  // – Ends a communication session with the LMS.
  LMSFinish(msg:string):boolean;
  // – Retrieves a value from the LMS.
  LMSGetValue(element:CMIElement):string ;
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