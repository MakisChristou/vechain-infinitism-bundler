"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundlerConfigDefault = exports.BundlerConfigShape = void 0;
// TODO: consider adopting config-loading approach from hardhat to allow code in config file
const ow_1 = __importDefault(require("ow"));
// TODO: implement merging config (args -> config.js -> default) and runtime shape validation
exports.BundlerConfigShape = {
    beneficiary: ow_1.default.string,
    entryPoint: ow_1.default.string,
    gasFactor: ow_1.default.string,
    minBalance: ow_1.default.string,
    mnemonic: ow_1.default.string,
    network: ow_1.default.string,
    port: ow_1.default.string,
    unsafe: ow_1.default.boolean,
    conditionalRpc: ow_1.default.boolean,
    whitelist: ow_1.default.optional.array.ofType(ow_1.default.string),
    blacklist: ow_1.default.optional.array.ofType(ow_1.default.string),
    maxBundleGas: ow_1.default.number,
    minStake: ow_1.default.string,
    minUnstakeDelay: ow_1.default.number,
    autoBundleInterval: ow_1.default.number,
    autoBundleMempoolSize: ow_1.default.number
};
// TODO: consider if we want any default fields at all
// TODO: implement merging config (args -> config.js -> default) and runtime shape validation
exports.bundlerConfigDefault = {
    port: '3000',
    entryPoint: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
    unsafe: false,
    conditionalRpc: false
};
//# sourceMappingURL=BundlerConfig.js.map