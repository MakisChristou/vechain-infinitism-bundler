"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConfiguration = void 0;
const ow_1 = __importDefault(require("ow"));
const fs_1 = __importDefault(require("fs"));
const BundlerConfig_1 = require("./BundlerConfig");
const ethers_1 = require("ethers");
function getCommandLineParams(programOpts) {
    const params = {};
    for (const bundlerConfigShapeKey in BundlerConfig_1.BundlerConfigShape) {
        const optionValue = programOpts[bundlerConfigShapeKey];
        if (optionValue != null) {
            params[bundlerConfigShapeKey] = optionValue;
        }
    }
    return params;
}
function mergeConfigs(...sources) {
    const mergedConfig = Object.assign({}, ...sources);
    (0, ow_1.default)(mergedConfig, ow_1.default.object.exactShape(BundlerConfig_1.BundlerConfigShape));
    return mergedConfig;
}
async function resolveConfiguration(programOpts) {
    const commandLineParams = getCommandLineParams(programOpts);
    let fileConfig = {};
    const configFileName = programOpts.config;
    if (fs_1.default.existsSync(configFileName)) {
        fileConfig = JSON.parse(fs_1.default.readFileSync(configFileName, 'ascii'));
    }
    const config = mergeConfigs(BundlerConfig_1.bundlerConfigDefault, fileConfig, commandLineParams);
    console.log('Merged configuration:', JSON.stringify(config));
    const provider = config.network === 'hardhat'
        // eslint-disable-next-line
        ? require('hardhat').ethers.provider
        : ethers_1.ethers.getDefaultProvider(config.network);
    let mnemonic;
    let wallet;
    try {
        mnemonic = fs_1.default.readFileSync(config.mnemonic, 'ascii').trim();
        wallet = ethers_1.Wallet.fromMnemonic(mnemonic).connect(provider);
    }
    catch (e) {
        throw new Error(`Unable to read --mnemonic ${config.mnemonic}: ${e.message}`);
    }
    return { config, provider, wallet };
}
exports.resolveConfiguration = resolveConfiguration;
//# sourceMappingURL=Config.js.map