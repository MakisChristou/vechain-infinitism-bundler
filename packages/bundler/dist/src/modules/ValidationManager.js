"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationManager = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../utils");
const utils_2 = require("@account-abstraction/utils");
const sdk_1 = require("@account-abstraction/sdk");
const parseScannerResult_1 = require("../parseScannerResult");
const BundlerCollectorTracer_1 = require("../BundlerCollectorTracer");
const GethTracer_1 = require("../GethTracer");
const debug_1 = __importDefault(require("debug"));
const types_1 = require("../types");
const Types_1 = require("./Types");
const moduleUtils_1 = require("./moduleUtils");
const debug = (0, debug_1.default)('aa.mgr.validate');
const HEX_REGEX = /^0x[a-fA-F\d]*$/i;
class ValidationManager {
    constructor(entryPoint, reputationManager, unsafe) {
        this.entryPoint = entryPoint;
        this.reputationManager = reputationManager;
        this.unsafe = unsafe;
    }
    // standard eth_call to simulateValidation
    async _callSimulateValidation(userOp) {
        const errorResult = await this.entryPoint.callStatic.simulateValidation(userOp, { gasLimit: 10e6 }).catch(e => e);
        return this._parseErrorResult(userOp, errorResult);
    }
    _parseErrorResult(userOp, errorResult) {
        // console.log(JSON.stringify(errorResult))
        var _a;
        // if (!errorResult?.errorName?.startsWith('ValidationResult')) {
        //   // parse it as FailedOp
        //   // if its FailedOp, then we have the paymaster param... otherwise its an Error(string)
        //   // const data = errorResult.error.error.data
        //   let paymaster = errorResult.errorArgs.paymaster
        //   if (paymaster === AddressZero) {
        //     paymaster = undefined
        //   }
        //   // eslint-disable-next-line
        //   const msg: string = errorResult.errorArgs?.reason ?? errorResult.toString()
        //   if (paymaster == null) {
        //     throw new RpcError(`account validation failed: ${msg}`, ValidationErrors.SimulateValidation)
        //   } else {
        //     throw new RpcError(`paymaster validation failed: ${msg}`, ValidationErrors.SimulatePaymasterValidation, { paymaster })
        //   }
        // }
        let returnInfo;
        let senderInfo;
        let factoryInfo;
        let paymasterInfo;
        let aggregatorInfo;
        // Vechain Runs here
        if (!((_a = errorResult === null || errorResult === void 0 ? void 0 : errorResult.errorName) === null || _a === void 0 ? void 0 : _a.startsWith('ValidationResult'))) {
            const data = errorResult.error.error.data; // Vechain only
            const val1 = data.substring(516, 522);
            const val2 = data.substring(573, 586);
            // returnInfo = [
            //   { type: 'BigNumber', hex: val1 },
            //   { type: 'BigNumber', hex: val2 },
            //   false,
            //   0,
            //   281474976710655,
            //   '0x'
            // ];
            returnInfo = {
                preOpGas: "0x" + val1,
                preFund: "0x" + val2,
                sigFailed: false,
                validAfter: 0,
                validUntil: 281474976710655,
                paymasterContext: '0x'
            };
            senderInfo = [
                { type: 'BigNumber', hex: '0x00' },
                { type: 'BigNumber', hex: '0x00' }
            ];
            factoryInfo = [
                { type: 'BigNumber', hex: '0x00' },
                { type: 'BigNumber', hex: '0x00' }
            ];
            paymasterInfo = [
                { type: 'BigNumber', hex: '0x00' },
                { type: 'BigNumber', hex: '0x00' }
            ];
        }
        else {
            const data = errorResult.data; // Ethereum only
            ({
                returnInfo,
                senderInfo,
                factoryInfo,
                paymasterInfo,
                aggregatorInfo // may be missing (exists only SimulationResultWithAggregator
            } = errorResult.errorArgs);
        }
        // console.log(JSON.stringify(returnInfo))
        // console.log(JSON.stringify(senderInfo))
        // console.log(JSON.stringify(factoryInfo))
        // console.log(JSON.stringify(paymasterInfo))
        // extract address from "data" (first 20 bytes)
        // add it as "addr" member to the "stakeinfo" struct
        // if no address, then return "undefined" instead of struct.
        function fillEntity(data, info) {
            const addr = (0, moduleUtils_1.getAddr)(data);
            return addr == null
                ? undefined
                : Object.assign(Object.assign({}, info), { addr });
        }
        return {
            returnInfo,
            senderInfo: Object.assign(Object.assign({}, senderInfo), { addr: userOp.sender }),
            factoryInfo: fillEntity(userOp.initCode, factoryInfo),
            paymasterInfo: fillEntity(userOp.paymasterAndData, paymasterInfo),
            aggregatorInfo: fillEntity(aggregatorInfo === null || aggregatorInfo === void 0 ? void 0 : aggregatorInfo.actualAggregator, aggregatorInfo === null || aggregatorInfo === void 0 ? void 0 : aggregatorInfo.stakeInfo)
        };
    }
    async _geth_traceCall_SimulateValidation(userOp) {
        var _a, _b;
        const provider = this.entryPoint.provider;
        const simulateCall = this.entryPoint.interface.encodeFunctionData('simulateValidation', [userOp]);
        const simulationGas = ethers_1.BigNumber.from(userOp.preVerificationGas).add(userOp.verificationGasLimit);
        const tracerResult = await (0, GethTracer_1.debug_traceCall)(provider, {
            from: ethers_1.ethers.constants.AddressZero,
            to: this.entryPoint.address,
            data: simulateCall,
            gasLimit: simulationGas
        }, { tracer: BundlerCollectorTracer_1.bundlerCollectorTracer });
        const lastResult = tracerResult.calls.slice(-1)[0];
        if (lastResult.type !== 'REVERT') {
            throw new Error('Invalid response. simulateCall must revert');
        }
        const data = lastResult.data;
        // Hack to handle SELFDESTRUCT until we fix entrypoint
        if (data === '0x') {
            return [data, tracerResult];
        }
        try {
            const { name: errorName, args: errorArgs } = this.entryPoint.interface.parseError(data);
            const errFullName = `${errorName}(${errorArgs.toString()})`;
            const errorResult = this._parseErrorResult(userOp, {
                errorName,
                errorArgs
            });
            if (!errorName.includes('Result')) {
                // a real error, not a result.
                throw new Error(errFullName);
            }
            debug('==dump tree=', JSON.stringify(tracerResult, null, 2)
                .replace(new RegExp(userOp.sender.toLowerCase()), '{sender}')
                .replace(new RegExp((_a = (0, moduleUtils_1.getAddr)(userOp.paymasterAndData)) !== null && _a !== void 0 ? _a : '--no-paymaster--'), '{paymaster}')
                .replace(new RegExp((_b = (0, moduleUtils_1.getAddr)(userOp.initCode)) !== null && _b !== void 0 ? _b : '--no-initcode--'), '{factory}'));
            // console.log('==debug=', ...tracerResult.numberLevels.forEach(x=>x.access), 'sender=', userOp.sender, 'paymaster=', hexlify(userOp.paymasterAndData)?.slice(0, 42))
            // errorResult is "ValidationResult"
            return [errorResult, tracerResult];
        }
        catch (e) {
            // if already parsed, throw as is
            if (e.code != null) {
                throw e;
            }
            // not a known error of EntryPoint (probably, only Error(string), since FailedOp is handled above)
            const err = (0, utils_2.decodeErrorReason)(data);
            throw new utils_1.RpcError(err != null ? err.message : data, 111);
        }
    }
    /**
     * validate UserOperation.
     * should also handle unmodified memory (e.g. by referencing cached storage in the mempool
     * one item to check that was un-modified is the aggregator..
     * @param userOp
     */
    async validateUserOp(userOp, previousCodeHashes, checkStakes = true) {
        if (previousCodeHashes != null && previousCodeHashes.addresses.length > 0) {
            const { hash: codeHashes } = await this.getCodeHashes(previousCodeHashes.addresses);
            (0, utils_1.requireCond)(codeHashes === previousCodeHashes.hash, 'modified code after first validation', Types_1.ValidationErrors.OpcodeValidation);
        }
        let res;
        let codeHashes = {
            addresses: [],
            hash: ''
        };
        let storageMap = {};
        if (!this.unsafe) {
            let tracerResult;
            [res, tracerResult] = await this._geth_traceCall_SimulateValidation(userOp);
            let contractAddresses;
            [contractAddresses, storageMap] = (0, parseScannerResult_1.parseScannerResult)(userOp, tracerResult, res, this.entryPoint);
            // if no previous contract hashes, then calculate hashes of contracts
            if (previousCodeHashes == null) {
                codeHashes = await this.getCodeHashes(contractAddresses);
            }
            if (res === '0x') {
                throw new Error('simulateValidation reverted with no revert string!');
            }
        }
        else {
            // NOTE: this mode doesn't do any opcode checking and no stake checking!
            res = await this._callSimulateValidation(userOp);
        }
        (0, utils_1.requireCond)(!res.returnInfo.sigFailed, 'Invalid UserOp signature or paymaster signature', Types_1.ValidationErrors.InvalidSignature);
        (0, utils_1.requireCond)(res.returnInfo.deadline == null || res.returnInfo.deadline + 30 < Date.now() / 1000, 'expires too soon', Types_1.ValidationErrors.ExpiresShortly);
        if (res.aggregatorInfo != null) {
            this.reputationManager.checkStake('aggregator', res.aggregatorInfo);
        }
        (0, utils_1.requireCond)(res.aggregatorInfo == null, 'Currently not supporting aggregator', Types_1.ValidationErrors.UnsupportedSignatureAggregator);
        return Object.assign(Object.assign({}, res), { referencedContracts: codeHashes, storageMap });
    }
    async getCodeHashes(addresses) {
        const { hash } = await (0, moduleUtils_1.runContractScript)(this.entryPoint.provider, new types_1.GetCodeHashes__factory(), [addresses]);
        return {
            hash,
            addresses
        };
    }
    /**
     * perform static checking on input parameters.
     * @param userOp
     * @param entryPointInput
     * @param requireSignature
     * @param requireGasParams
     */
    validateInputParameters(userOp, entryPointInput, requireSignature = true, requireGasParams = true) {
        (0, utils_1.requireCond)(entryPointInput != null, 'No entryPoint param', Types_1.ValidationErrors.InvalidFields);
        (0, utils_1.requireCond)(entryPointInput.toLowerCase() === this.entryPoint.address.toLowerCase(), `The EntryPoint at "${entryPointInput}" is not supported. This bundler uses ${this.entryPoint.address}`, Types_1.ValidationErrors.InvalidFields);
        // minimal sanity check: userOp exists, and all members are hex
        (0, utils_1.requireCond)(userOp != null, 'No UserOperation param', Types_1.ValidationErrors.InvalidFields);
        const fields = ['sender', 'nonce', 'initCode', 'callData', 'paymasterAndData'];
        if (requireSignature) {
            fields.push('signature');
        }
        if (requireGasParams) {
            fields.push('preVerificationGas', 'verificationGasLimit', 'callGasLimit', 'maxFeePerGas', 'maxPriorityFeePerGas');
        }
        fields.forEach(key => {
            var _a;
            const value = (_a = userOp[key]) === null || _a === void 0 ? void 0 : _a.toString();
            (0, utils_1.requireCond)(value != null, 'Missing userOp field: ' + key + ' ' + JSON.stringify(userOp), Types_1.ValidationErrors.InvalidFields);
            (0, utils_1.requireCond)(value.match(HEX_REGEX) != null, `Invalid hex value for property ${key}:${value} in UserOp`, Types_1.ValidationErrors.InvalidFields);
        });
        (0, utils_1.requireCond)(userOp.paymasterAndData.length === 2 || userOp.paymasterAndData.length >= 42, 'paymasterAndData: must contain at least an address', Types_1.ValidationErrors.InvalidFields);
        // syntactically, initCode can be only the deployer address. but in reality, it must have calldata to uniquely identify the account
        (0, utils_1.requireCond)(userOp.initCode.length === 2 || userOp.initCode.length >= 42, 'initCode: must contain at least an address', Types_1.ValidationErrors.InvalidFields);
        const calcPreVerificationGas1 = (0, sdk_1.calcPreVerificationGas)(userOp);
        (0, utils_1.requireCond)(userOp.preVerificationGas >= calcPreVerificationGas1, `preVerificationGas too low: expected at least ${calcPreVerificationGas1}`, Types_1.ValidationErrors.InvalidFields);
    }
}
exports.ValidationManager = ValidationManager;
//# sourceMappingURL=ValidationManager.js.map