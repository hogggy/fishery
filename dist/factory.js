"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
var merge_1 = require("./merge");
var SEQUENCE_START_VALUE = 20;
var Factory = /** @class */ (function () {
    function Factory(_build, _onCreate, afterBuild, afterCreate) {
        this._build = _build;
        this._onCreate = _onCreate;
        // id is an object so it is shared between extended factories
        this.id = { value: SEQUENCE_START_VALUE };
        this._afterBuilds = [];
        this._afterCreates = [];
        this._associations = {};
        this._params = {};
        this._transient = {};
        if (afterBuild) {
            this._afterBuilds.push(afterBuild);
        }
        if (afterCreate) {
            this._afterCreates.push(afterCreate);
        }
    }
    /**
     * Define a factory.
     * @template T The object the factory builds
     * @template I The transient parameters that your factory supports
     * @template C The class of the factory object being created.
     * @param build - your factory build function
     * @param onCreate - (optional) your async factory create function
     * @param afterBuild - (optional) runs after build
     * @param afterCreate - (optional) runs after create
     */
    Factory.define = function (_a) {
        var build = _a.build, onCreate = _a.onCreate, afterBuild = _a.afterBuild, afterCreate = _a.afterCreate;
        return new this(build, onCreate, afterBuild, afterCreate);
    };
    Factory.prototype._getOptionsFromBuildOptions = function (buildOptions) {
        if (buildOptions === void 0) { buildOptions = {}; }
        var _a = buildOptions.transient, transient = _a === void 0 ? {} : _a, _b = buildOptions.associations, associations = _b === void 0 ? {} : _b;
        var options = {
            sequence: this.sequence(),
            associations: merge_1.merge(this._associations, associations, merge_1.mergeCustomizer),
            transientParams: merge_1.merge(this._transient, transient, merge_1.mergeCustomizer),
        };
        return options;
    };
    /**
     * Build an object using your factory
     * @param params
     * @param buildOptions
     */
    Factory.prototype.build = function (params, buildOptions) {
        if (buildOptions === void 0) { buildOptions = {}; }
        var options = this._getOptionsFromBuildOptions(buildOptions);
        var mergedParams = merge_1.merge(params, this._params, merge_1.mergeCustomizer);
        var built = this._build(__assign({ params: mergedParams }, options));
        var merged = merge_1.merge(built, mergedParams, buildOptions.associations, merge_1.mergeCustomizer);
        this._afterBuilds.forEach(function (afterBuild) {
            if (typeof afterBuild === 'function') {
                afterBuild(merged, options);
            }
            else {
                throw new Error('"afterBuild" must be a function');
            }
        });
        return merged;
    };
    Factory.prototype.buildList = function (number, params, buildOptions) {
        if (params === void 0) { params = {}; }
        if (buildOptions === void 0) { buildOptions = {}; }
        var list = [];
        for (var i = 0; i < number; i++) {
            list.push(this.build(params, buildOptions));
        }
        return list;
    };
    /**
     * Asynchronously create an object using your factory.
     * @param params
     * @param buildOptions
     */
    Factory.prototype.create = function (params, buildOptions) {
        if (params === void 0) { params = {}; }
        if (buildOptions === void 0) { buildOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var options, built, created;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = this._getOptionsFromBuildOptions(buildOptions);
                        built = this.build(params, options);
                        if (!this._onCreate) {
                            throw new Error('Attempted to call `create`, but no onCreate defined');
                        }
                        return [4 /*yield*/, this._onCreate(built, options)];
                    case 1:
                        created = _a.sent();
                        return [4 /*yield*/, Promise.all(this._afterCreates.map(function (afterCreate) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(typeof afterCreate === 'function')) return [3 /*break*/, 2];
                                            return [4 /*yield*/, afterCreate(created, options)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2: throw new Error('"afterBuild" must be a function');
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, created];
                }
            });
        });
    };
    Factory.prototype.createList = function (number, params, buildOptions) {
        if (params === void 0) { params = {}; }
        if (buildOptions === void 0) { buildOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var options, list, i;
            return __generator(this, function (_a) {
                options = this._getOptionsFromBuildOptions(buildOptions);
                list = [];
                for (i = 0; i < number; i++) {
                    list.push(this.create(params, options));
                }
                return [2 /*return*/, Promise.all(list)];
            });
        });
    };
    /**
     * Extend the factory by adding a function to be called after an object is built.
     * @param afterBuildFn - the function to call. It accepts your object of type T. The value this function returns gets returned from "build"
     * @returns a new factory
     */
    Factory.prototype.afterBuild = function (afterBuildFn) {
        var factory = this.clone();
        factory._afterBuilds.push(afterBuildFn);
        return factory;
    };
    /**
     * Define a transform that occurs when `create` is called on the factory. Specifying an `onCreate` overrides any previous `onCreate`s.
     * To return a different type from `build`, specify a third type argument when defining the factory.
     * @param onCreateFn - The function to call. IT accepts your object of type T.
     * The value this function returns gets returned from "create" after any
     * `afterCreate`s are run
     * @return a new factory
     */
    Factory.prototype.onCreate = function (onCreateFn) {
        var factory = this.clone();
        factory._onCreate = onCreateFn;
        return factory;
    };
    /**
     * Extend the factory by adding a function to be called after creation. This is called after `onCreate` but before the object is returned from `create`.
     * If multiple are defined, they are chained.
     * @param afterCreateFn
     * @return a new factory
     */
    Factory.prototype.afterCreate = function (afterCreateFn) {
        var factory = this.clone();
        factory._afterCreates.push(afterCreateFn);
        return factory;
    };
    /**
     * Extend the factory by adding default associations to be passed to the factory when "build" is called
     * @param associations
     * @returns a new factory
     */
    Factory.prototype.associations = function (associations) {
        var factory = this.clone();
        factory._associations = __assign(__assign({}, this._associations), associations);
        return factory;
    };
    /**
     * Extend the factory by adding default parameters to be passed to the factory when "build" is called
     * @param params
     * @returns a new factory
     */
    Factory.prototype.params = function (params) {
        var factory = this.clone();
        factory._params = merge_1.merge({}, this._params, params, merge_1.mergeCustomizer);
        return factory;
    };
    /**
     * Extend the factory by adding default transient parameters to be passed to the factory when "build" is called
     * @param transient - transient params
     * @returns a new factory
     */
    Factory.prototype.transient = function (transient) {
        var factory = this.clone();
        factory._transient = __assign(__assign({}, this._transient), transient);
        return factory;
    };
    /**
     * Sets sequence back to its default value
     */
    Factory.prototype.rewindSequence = function () {
        this.id.value = SEQUENCE_START_VALUE;
    };
    Factory.prototype.clone = function () {
        var copy = new this.constructor(this._build, this._onCreate);
        Object.assign(copy, this);
        copy._afterCreates = __spreadArrays(this._afterCreates);
        copy._afterBuilds = __spreadArrays(this._afterBuilds);
        return copy;
    };
    Factory.prototype.sequence = function () {
        this.id.value += SEQUENCE_START_VALUE;
        return this.id.value;
    };
    return Factory;
}());
exports.Factory = Factory;
