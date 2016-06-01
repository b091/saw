declare module "SCORM/API" {
    export type CMIElement = string;
    export type CMIErrorCode = string;
    export interface SCORMAPI {
        LMSInitialize(msg: string): boolean;
        LMSFinish(msg: string): boolean;
        LMSGetValue(element: CMIElement): string;
        LMSSetValue(element: CMIElement, value: string): string;
        LMSCommit(msg: string): boolean;
        LMSGetLastError(): CMIErrorCode;
        LMSGetErrorString(errorCode: CMIErrorCode): string;
        LMSGetDiagnostic(errorCode: CMIErrorCode): string;
    }
}
declare module "SCORM/findAPI" {
    import { SCORMAPI } from "SCORM/API";
    export function findAPI(win: any): SCORMAPI;
}
declare module "SCORM/STATUS_CODE" {
    export const STATUS_CODE: {
        [key: string]: string;
    };
}
declare module "SCORM/APIWrapper" {
    export class APIWrapper {
        sessionLogs: Array<LOG>;
        private LMS_INITIALIZED;
        private API;
        unset(): void;
        configure(): void;
        isConfigured(): boolean;
        isInitialized(): boolean;
        lmsInitialize(): void;
        lmsCommit(): void;
        lmsFinish(): void;
        setScormValue(parameter: string, value: string): void;
        getScormValue(parameter: string): string;
        initialize(): void;
        commit(): void;
        finish(): void;
        abort(action: string): void;
        getLastError(): ERROR;
        logOperation(scormAPIFn: string, scormAPIFnArguments?: any): void;
        private isSucceeded(apiCall);
    }
    export interface ERROR {
        code: number;
        message: string;
    }
    export interface LOG {
        timestamp: number;
        scormFn: string;
        scormFnArgs: any;
        errorCode: string;
        errorCodeString: string;
        errorCodeStringLMS: string;
        diagnostic: string;
    }
}
declare module "index" {
}
