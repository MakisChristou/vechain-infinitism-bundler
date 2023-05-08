"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MempoolManager = void 0;
const ethers_1 = require("ethers");
const moduleUtils_1 = require("./moduleUtils");
const utils_1 = require("../utils");
const debug_1 = __importDefault(require("debug"));
const Types_1 = require("./Types");
const debug = (0, debug_1.default)('aa.mempool');
const MAX_MEMPOOL_USEROPS_PER_SENDER = 4;
class MempoolManager {
    constructor(reputationManager) {
        this.reputationManager = reputationManager;
        this.mempool = [];
        // count entities in mempool.
        this.entryCount = {};
    }
    count() {
        return this.mempool.length;
    }
    // add userOp into the mempool, after initial validation.
    // replace existing, if any (and if new gas is higher)
    // revets if unable to add UserOp to mempool (too many UserOps with this sender)
    addUserOp(userOp, userOpHash, prefund, senderInfo, referencedContracts, aggregator) {
        var _a;
        const entry = {
            userOp,
            userOpHash,
            prefund,
            referencedContracts,
            aggregator
        };
        const index = this._findBySenderNonce(userOp.sender, userOp.nonce);
        if (index !== -1) {
            const oldEntry = this.mempool[index];
            this.checkReplaceUserOp(oldEntry, entry);
            debug('replace userOp', userOp.sender, userOp.nonce);
            this.mempool[index] = entry;
        }
        else {
            debug('add userOp', userOp.sender, userOp.nonce);
            this.entryCount[userOp.sender] = ((_a = this.entryCount[userOp.sender]) !== null && _a !== void 0 ? _a : 0) + 1;
            this.checkSenderCountInMempool(userOp, senderInfo);
            this.mempool.push(entry);
        }
        this.updateSeenStatus(aggregator, userOp);
    }
    updateSeenStatus(aggregator, userOp) {
        this.reputationManager.updateSeenStatus(aggregator);
        this.reputationManager.updateSeenStatus((0, moduleUtils_1.getAddr)(userOp.paymasterAndData));
        this.reputationManager.updateSeenStatus((0, moduleUtils_1.getAddr)(userOp.initCode));
    }
    // check if there are already too many entries in mempool for that sender.
    // (allow 4 entities if unstaked, or any number if staked)
    checkSenderCountInMempool(userOp, senderInfo) {
        var _a;
        if (((_a = this.entryCount[userOp.sender]) !== null && _a !== void 0 ? _a : 0) > MAX_MEMPOOL_USEROPS_PER_SENDER) {
            // already enough entities with this sender in mempool.
            // check that it is staked
            this.reputationManager.checkStake('account', senderInfo);
        }
    }
    checkReplaceUserOp(oldEntry, entry) {
        const oldMaxPriorityFeePerGas = ethers_1.BigNumber.from(oldEntry.userOp.maxPriorityFeePerGas).toNumber();
        const newMaxPriorityFeePerGas = ethers_1.BigNumber.from(entry.userOp.maxPriorityFeePerGas).toNumber();
        const oldMaxFeePerGas = ethers_1.BigNumber.from(oldEntry.userOp.maxFeePerGas).toNumber();
        const newMaxFeePerGas = ethers_1.BigNumber.from(entry.userOp.maxFeePerGas).toNumber();
        // the error is "invalid fields", even though it is detected only after validation
        (0, utils_1.requireCond)(newMaxPriorityFeePerGas >= oldMaxPriorityFeePerGas * 1.1, `Replacement UserOperation must have higher maxPriorityFeePerGas (old=${oldMaxPriorityFeePerGas} new=${newMaxPriorityFeePerGas}) `, Types_1.ValidationErrors.InvalidFields);
        (0, utils_1.requireCond)(newMaxFeePerGas >= oldMaxFeePerGas * 1.1, `Replacement UserOperation must have higher maxFeePerGas (old=${oldMaxFeePerGas} new=${newMaxFeePerGas}) `, Types_1.ValidationErrors.InvalidFields);
    }
    getSortedForInclusion() {
        const copy = Array.from(this.mempool);
        function cost(op) {
            // TODO: need to consult basefee and maxFeePerGas
            return ethers_1.BigNumber.from(op.maxPriorityFeePerGas).toNumber();
        }
        copy.sort((a, b) => cost(a.userOp) - cost(b.userOp));
        return copy;
    }
    _findBySenderNonce(sender, nonce) {
        for (let i = 0; i < this.mempool.length; i++) {
            const curOp = this.mempool[i].userOp;
            if (curOp.sender === sender && curOp.nonce === nonce) {
                return i;
            }
        }
        return -1;
    }
    _findByHash(hash) {
        for (let i = 0; i < this.mempool.length; i++) {
            const curOp = this.mempool[i];
            if (curOp.userOpHash === hash) {
                return i;
            }
        }
        return -1;
    }
    /**
     * remove UserOp from mempool. either it is invalid, or was included in a block
     * @param userOpOrHash
     */
    removeUserOp(userOpOrHash) {
        var _a;
        let index;
        if (typeof userOpOrHash === 'string') {
            index = this._findByHash(userOpOrHash);
        }
        else {
            index = this._findBySenderNonce(userOpOrHash.sender, userOpOrHash.nonce);
        }
        if (index !== -1) {
            const userOp = this.mempool[index].userOp;
            debug('removeUserOp', userOp.sender, userOp.nonce);
            this.mempool.splice(index, 1);
            const count = ((_a = this.entryCount[userOp.sender]) !== null && _a !== void 0 ? _a : 0) - 1;
            if (count <= 0) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.entryCount[userOp.sender];
            }
            else {
                this.entryCount[userOp.sender] = count;
            }
        }
    }
    /**
     * debug: dump mempool content
     */
    dump() {
        return this.mempool.map(entry => entry.userOp);
    }
    /**
     * for debugging: clear current in-memory state
     */
    clearState() {
        this.mempool = [];
    }
}
exports.MempoolManager = MempoolManager;
//# sourceMappingURL=MempoolManager.js.map