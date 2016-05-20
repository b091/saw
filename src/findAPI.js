var findAPITries = 0;
// The function charged to locate the API adapter object presented by the LMS.
// As described in section 3.3.6.1 of the documentation.
export function findAPI(win) {
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
