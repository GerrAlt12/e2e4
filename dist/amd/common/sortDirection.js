define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (SortDirection) {
        SortDirection[SortDirection["Asc"] = 0] = "Asc";
        SortDirection[SortDirection["Desc"] = 1] = "Desc";
    })(exports.SortDirection || (exports.SortDirection = {}));
    var SortDirection = exports.SortDirection;
});
//# sourceMappingURL=sortDirection.js.map