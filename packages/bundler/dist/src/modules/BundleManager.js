"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleManager = void 0;
const debug_1 = __importDefault(require("debug"));
const ReputationManager_1 = require("./ReputationManager");
const async_mutex_1 = require("async-mutex");
const types_1 = require("../types");
const moduleUtils_1 = require("./moduleUtils");
// Vechain Provider Imports
const ethers_1 = require("ethers");
const connex_framework_1 = require("@vechain/connex-framework");
const connex_driver_1 = require("@vechain/connex-driver");
const thor = __importStar(require("@vechain/web3-providers-connex"));
const ethers_2 = require("ethers");
const debug = (0, debug_1.default)('aa.exec.cron');
class BundleManager {
    constructor(entryPoint, eventsManager, mempoolManager, validationManager, reputationManager, beneficiary, minSignerBalance, maxBundleGas, 
    // use eth_sendRawTransactionConditional with storage map
    conditionalRpc, 
    // in conditionalRpc: always put root hash (not specific storage slots) for "sender" entries
    mergeToAccountRootHash = false) {
        this.entryPoint = entryPoint;
        this.eventsManager = eventsManager;
        this.mempoolManager = mempoolManager;
        this.validationManager = validationManager;
        this.reputationManager = reputationManager;
        this.beneficiary = beneficiary;
        this.minSignerBalance = minSignerBalance;
        this.maxBundleGas = maxBundleGas;
        this.conditionalRpc = conditionalRpc;
        this.mergeToAccountRootHash = mergeToAccountRootHash;
        this.mutex = new async_mutex_1.Mutex();
        this.provider = entryPoint.provider;
        this.signer = entryPoint.signer;
    }
    /**
     * attempt to send a bundle:
     * collect UserOps from mempool into a bundle
     * send this bundle.
     */
    async sendNextBundle() {
        return await this.mutex.runExclusive(async () => {
            debug('sendNextBundle');
            // first flush mempool from already-included UserOps, by actively scanning past events.
            await this.handlePastEvents();
            const [bundle, storageMap] = await this.createBundle();
            if (bundle.length === 0) {
                debug('sendNextBundle - no bundle to send');
            }
            else {
                const beneficiary = await this._selectBeneficiary();
                const ret = await this.sendBundle(bundle, beneficiary, storageMap);
                debug(`sendNextBundle exit - after sent a bundle of ${bundle.length} `);
                return ret;
            }
        });
    }
    async handlePastEvents() {
        await this.eventsManager.handlePastEvents();
    }
    /**
     * submit a bundle.
     * after submitting the bundle, remove all UserOps from the mempool
     * @return SendBundleReturn the transaction and UserOp hashes on successful transaction, or null on failed transaction
     */
    async sendBundle(userOps, beneficiary, storageMap) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const feeData = await this.provider.getFeeData();
            const tx = await this.entryPoint.populateTransaction.handleOps(userOps, beneficiary, {
                type: 2,
                nonce: await this.signer.getTransactionCount(),
                gasLimit: 10e6,
                maxPriorityFeePerGas: (_a = feeData.maxPriorityFeePerGas) !== null && _a !== void 0 ? _a : 0,
                maxFeePerGas: (_b = feeData.maxFeePerGas) !== null && _b !== void 0 ? _b : 0
            });
            tx.chainId = this.provider._network.chainId;
            console.log("tx.chainId = ", tx.chainId);
            // Vechain Signature
            const net = new connex_driver_1.SimpleNet("http://127.0.0.1:8669");
            // const getWalletForIndex = (index: any) => {
            //   return Wallet.fromMnemonic(
            //     'test test test test test test test test test test test junk',
            //     `m/44'/60'/0'/0/${index}`
            //   );
            // };
            const wallet = new connex_driver_1.SimpleWallet();
            wallet.import("0x99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36");
            wallet.import("0x7b067f53d350f1cf20ec13df416b7b73e88a1dc7331bc904b92108b1e76a08b1");
            const driver = await connex_driver_1.Driver.connect(net, wallet);
            const connexObj = new connex_framework_1.Framework(driver);
            const inner_provider = new thor.Provider({
                wallet: wallet,
                connex: connexObj,
                net: net
            });
            const vechainProviderEthers = thor.ethers.modifyProvider(new ethers_1.ethers.providers.Web3Provider(inner_provider));
            // const new_signer = this.provider.getSigner()
            const tx1 = {
                to: tx.to,
                from: tx.from,
                value: (_c = tx.value) === null || _c === void 0 ? void 0 : _c.toString(),
                data: tx.data,
                gas: (_d = tx.gasLimit) === null || _d === void 0 ? void 0 : _d.toString(),
            };
            const tx2 = {
                clauses: [{
                        to: tx.to,
                        data: tx.data,
                        value: tx.value
                    }],
                caller: tx.from,
                gas: tx.gasLimit,
                gasPrice: (_e = tx.gasPrice) === null || _e === void 0 ? void 0 : _e.toString(),
            };
            const signedTx = await thor.utils.signTransaction(tx1, wallet.list[0], inner_provider);
            let txId = await inner_provider.request({ method: 'eth_sendRawTransaction', params: [signedTx] });
            const _hashes = [this.getUserOpHashesLocal(userOps)];
            return {
                transactionHash: txId,
                userOpHashes: _hashes
            };
            // try {
            //     const res = await inner_provider.request({ 
            //       method: 'eth_call', 
            //       params: [tx2] 
            //   })
            //     console.log("res: ", res);
            // }
            // catch(e) {
            //   console.log(e)
            // }
            // this.signer = vechainProviderEthers.getSigner("0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa")
            // this.provider = vechainProviderEthers
            // await vechainProviderEthers.sendTransaction(tx.toString())
            // const value = await vechainProviderEthers.send('eth_sendTransaction', [tx]);
            // console.log("tx: ", tx)
            // const signedTx = await this.signer.signTransaction(tx)
            // console.log("signed tx: ", signedTx)
            let ret;
            if (this.conditionalRpc) {
                debug('eth_sendRawTransactionConditional', storageMap);
                ret = await this.provider.send('eth_sendRawTransactionConditional', [
                    signedTx, { knownAccounts: storageMap }
                ]);
                debug('eth_sendRawTransactionConditional ret=', ret);
            }
            else {
                // ret = await this.signer.sendTransaction(tx)
                // ret = await this.provider.send('eth_sendRawTransaction', [signedTx])
                // debug('eth_sendRawTransaction ret=', ret)
                // ret = await inner_provider.request({ method: 'eth_sendTransaction', params: [tx2]})
                // console.log('eth_sendTransaction ret=', ret)
                // debug('eth_sendTransaction ret=', ret)
                ret = '0x';
                try {
                    const errorResult = await this.entryPoint.callStatic.handleOps(userOps, beneficiary, { gasLimit: 1000000 });
                }
                catch (e) {
                    // decodeRevertReason(e.data);
                    console.log(e);
                }
            }
            // TODO: parse ret, and revert if needed.
            debug('ret=', ret);
            debug('sent handleOps with', userOps.length, 'ops. removing from mempool');
            // hashes are needed for debug rpc only.
            // const hashes = await this.getUserOpHashes(userOps) // revert here
            const hashes = [this.getUserOpHashesLocal(userOps)];
            return {
                transactionHash: ret,
                userOpHashes: hashes
            };
        }
        catch (e) {
            let parsedError;
            try {
                parsedError = this.entryPoint.interface.parseError(((_g = (_f = e.data) === null || _f === void 0 ? void 0 : _f.data) !== null && _g !== void 0 ? _g : e.data));
            }
            catch (e1) {
                this.checkFatal(e);
                console.warn('Failed handleOps, but non-FailedOp error', e);
                return;
            }
            const { opIndex, reason } = parsedError.args;
            const userOp = userOps[opIndex];
            const reasonStr = reason.toString();
            if (reasonStr.startsWith('AA3')) {
                this.reputationManager.crashedHandleOps((0, moduleUtils_1.getAddr)(userOp.paymasterAndData));
            }
            else if (reasonStr.startsWith('AA2')) {
                this.reputationManager.crashedHandleOps(userOp.sender);
            }
            else if (reasonStr.startsWith('AA1')) {
                this.reputationManager.crashedHandleOps((0, moduleUtils_1.getAddr)(userOp.initCode));
            }
            else {
                this.mempoolManager.removeUserOp(userOp);
                console.warn(`Failed handleOps sender=${userOp.sender} reason=${reasonStr}`);
            }
        }
    }
    // fatal errors we know we can't recover
    checkFatal(e) {
        var _a;
        // console.log('ex entries=',Object.entries(e))
        if (((_a = e.error) === null || _a === void 0 ? void 0 : _a.code) === -32601) {
            throw e;
        }
    }
    async createBundle() {
        var _a, _b, _c, _d, _e, _f;
        const entries = this.mempoolManager.getSortedForInclusion();
        const bundle = [];
        // paymaster deposit should be enough for all UserOps in the bundle.
        const paymasterDeposit = {};
        // throttled paymasters and deployers are allowed only small UserOps per bundle.
        const stakedEntityCount = {};
        // each sender is allowed only once per bundle
        const senders = new Set();
        const storageMap = {};
        let totalGas = ethers_2.BigNumber.from(0);
        debug('got mempool of ', entries.length);
        for (const entry of entries) {
            const paymaster = (0, moduleUtils_1.getAddr)(entry.userOp.paymasterAndData);
            const factory = (0, moduleUtils_1.getAddr)(entry.userOp.initCode);
            const paymasterStatus = this.reputationManager.getStatus(paymaster);
            const deployerStatus = this.reputationManager.getStatus(factory);
            if (paymasterStatus === ReputationManager_1.ReputationStatus.BANNED || deployerStatus === ReputationManager_1.ReputationStatus.BANNED) {
                this.mempoolManager.removeUserOp(entry.userOp);
                continue;
            }
            if (paymaster != null && ((_a = paymasterStatus === ReputationManager_1.ReputationStatus.THROTTLED) !== null && _a !== void 0 ? _a : ((_b = stakedEntityCount[paymaster]) !== null && _b !== void 0 ? _b : 0) > 1)) {
                debug('skipping throttled paymaster', entry.userOp.sender, entry.userOp.nonce);
                continue;
            }
            if (factory != null && ((_c = deployerStatus === ReputationManager_1.ReputationStatus.THROTTLED) !== null && _c !== void 0 ? _c : ((_d = stakedEntityCount[factory]) !== null && _d !== void 0 ? _d : 0) > 1)) {
                debug('skipping throttled factory', entry.userOp.sender, entry.userOp.nonce);
                continue;
            }
            if (senders.has(entry.userOp.sender)) {
                debug('skipping already included sender', entry.userOp.sender, entry.userOp.nonce);
                // allow only a single UserOp per sender per bundle
                continue;
            }
            let validationResult;
            try {
                // re-validate UserOp. no need to check stake, since it cannot be reduced between first and 2nd validation
                validationResult = await this.validationManager.validateUserOp(entry.userOp, entry.referencedContracts, false);
                console.log(validationResult);
            }
            catch (e) {
                debug('failed 2nd validation:', e.message);
                // failed validation. don't try anymore
                this.mempoolManager.removeUserOp(entry.userOp);
                continue;
            }
            // todo: we take UserOp's callGasLimit, even though it will probably require less (but we don't
            // attempt to estimate it to check)
            // which means we could "cram" more UserOps into a bundle.
            const userOpGasCost = ethers_2.BigNumber.from(validationResult.returnInfo.preOpGas).add(entry.userOp.callGasLimit);
            const newTotalGas = totalGas.add(userOpGasCost);
            if (newTotalGas.gt(this.maxBundleGas)) {
                break;
            }
            if (paymaster != null) {
                if (paymasterDeposit[paymaster] == null) {
                    paymasterDeposit[paymaster] = await this.entryPoint.balanceOf(paymaster);
                }
                if (paymasterDeposit[paymaster].lt(validationResult.returnInfo.prefund)) {
                    // not enough balance in paymaster to pay for all UserOps
                    // (but it passed validation, so it can sponsor them separately
                    continue;
                }
                stakedEntityCount[paymaster] = ((_e = stakedEntityCount[paymaster]) !== null && _e !== void 0 ? _e : 0) + 1;
                paymasterDeposit[paymaster] = paymasterDeposit[paymaster].sub(validationResult.returnInfo.prefund);
            }
            if (factory != null) {
                stakedEntityCount[factory] = ((_f = stakedEntityCount[factory]) !== null && _f !== void 0 ? _f : 0) + 1;
            }
            // If sender's account already exist: replace with its storage root hash
            if (this.mergeToAccountRootHash && this.conditionalRpc && entry.userOp.initCode.length <= 2) {
                const { storageHash } = await this.provider.send('eth_getProof', [entry.userOp.sender, [], 'latest']);
                storageMap[entry.userOp.sender.toLowerCase()] = storageHash;
            }
            (0, moduleUtils_1.mergeStorageMap)(storageMap, validationResult.storageMap);
            senders.add(entry.userOp.sender);
            bundle.push(entry.userOp);
            totalGas = newTotalGas;
        }
        return [bundle, storageMap];
    }
    /**
     * determine who should receive the proceedings of the request.
     * if signer's balance is too low, send it to signer. otherwise, send to configured beneficiary.
     */
    async _selectBeneficiary() {
        const currentBalance = await this.provider.getBalance(this.signer.getAddress());
        let beneficiary = this.beneficiary;
        // below min-balance redeem to the signer, to keep it active.
        if (currentBalance.lte(this.minSignerBalance)) {
            beneficiary = await this.signer.getAddress();
            console.log('low balance. using ', beneficiary, 'as beneficiary instead of ', this.beneficiary);
        }
        return beneficiary;
    }
    // helper function to get hashes of all UserOps
    async getUserOpHashes(userOps) {
        const { userOpHashes } = await (0, moduleUtils_1.runContractScript)(this.entryPoint.provider, new types_1.GetUserOpHashes__factory(), [this.entryPoint.address, userOps]);
        return userOpHashes;
    }
    getUserOpHashesLocal(userOps) {
        const userOp1 = userOps[0];
        const userOperationAbiDefinition = "tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)";
        const userOp1Hash = ethers_2.utils.keccak256(ethers_2.utils.defaultAbiCoder.encode([userOperationAbiDefinition], [userOp1]));
        const hash = ethers_2.utils.keccak256(ethers_2.utils.defaultAbiCoder.encode([
            "bytes32",
            "address",
            "uint256"
        ], [
            userOp1Hash,
            this.entryPoint.address,
            246,
        ]));
        return hash;
    }
}
exports.BundleManager = BundleManager;
//# sourceMappingURL=BundleManager.js.map