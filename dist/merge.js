"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCustomizer = exports.merge = void 0;
var lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
exports.merge = lodash_mergewith_1.default;
exports.mergeCustomizer = function (objValue, srcVal, key, object) {
    if (Array.isArray(srcVal)) {
        return srcVal;
    }
    else if (srcVal === undefined) {
        object[key] = srcVal;
    }
};
