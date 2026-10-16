"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadDir = getUploadDir;
const fs_1 = require("fs");
const path_1 = require("path");
function getUploadDir() {
    const configured = process.env.UPLOAD_DIR || 'uploads';
    const dir = (0, path_1.isAbsolute)(configured) ? configured : (0, path_1.join)(process.cwd(), configured);
    (0, fs_1.mkdirSync)(dir, { recursive: true });
    return dir;
}
//# sourceMappingURL=upload-dir.js.map