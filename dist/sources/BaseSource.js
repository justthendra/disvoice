"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSource = void 0;
class BaseSource {
    /**
     * Check if query is a URL
     */
    isURL(query) {
        try {
            new URL(query);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.BaseSource = BaseSource;
//# sourceMappingURL=BaseSource.js.map