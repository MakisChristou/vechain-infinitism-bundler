"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationManager = exports.NonBundlerReputationParams = exports.BundlerReputationParams = exports.ReputationStatus = void 0;
const debug_1 = __importDefault(require("debug"));
const utils_1 = require("../utils");
const ethers_1 = require("ethers");
const Types_1 = require("./Types");
const debug = (0, debug_1.default)('aa.rep');
/**
 * throttled entities are allowed minimal number of entries per bundle. banned entities are allowed none
 */
var ReputationStatus;
(function (ReputationStatus) {
    ReputationStatus[ReputationStatus["OK"] = 0] = "OK";
    ReputationStatus[ReputationStatus["THROTTLED"] = 1] = "THROTTLED";
    ReputationStatus[ReputationStatus["BANNED"] = 2] = "BANNED";
})(ReputationStatus = exports.ReputationStatus || (exports.ReputationStatus = {}));
exports.BundlerReputationParams = {
    minInclusionDenominator: 10,
    throttlingSlack: 10,
    banSlack: 10
};
exports.NonBundlerReputationParams = {
    minInclusionDenominator: 100,
    throttlingSlack: 10,
    banSlack: 10
};
class ReputationManager {
    constructor(params, minStake, minUnstakeDelay) {
        this.params = params;
        this.minStake = minStake;
        this.minUnstakeDelay = minUnstakeDelay;
        this.entries = {};
        // black-listed entities - always banned
        this.blackList = new Set();
        // white-listed entities - always OK.
        this.whitelist = new Set();
    }
    /**
     * debug: dump reputation map (with updated "status" for each entry)
     */
    dump() {
        return Object.values(this.entries);
    }
    /**
     * exponential backoff of opsSeen and opsIncluded values
     */
    hourlyCron() {
        Object.keys(this.entries).forEach(addr => {
            const entry = this.entries[addr];
            entry.opsSeen = Math.floor(entry.opsSeen * 23 / 24);
            entry.opsIncluded = Math.floor(entry.opsSeen * 23 / 24);
            if (entry.opsIncluded === 0 && entry.opsSeen === 0) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.entries[addr];
            }
        });
    }
    addWhitelist(...params) {
        params.forEach(item => this.whitelist.add(item));
    }
    addBlacklist(...params) {
        params.forEach(item => this.blackList.add(item));
    }
    _getOrCreate(addr) {
        let entry = this.entries[addr];
        if (entry == null) {
            this.entries[addr] = entry = {
                address: addr,
                opsSeen: 0,
                opsIncluded: 0
            };
        }
        return entry;
    }
    /**
     * address seen in the mempool triggered by the
     * @param addr
     */
    updateSeenStatus(addr) {
        if (addr == null) {
            return;
        }
        const entry = this._getOrCreate(addr);
        entry.opsSeen++;
        debug('after seen++', addr, entry);
    }
    /**
     * found paymaster/deployer/agregator on-chain.
     * triggered by the EventsManager.
     * @param addr
     */
    updateIncludedStatus(addr) {
        const entry = this._getOrCreate(addr);
        entry.opsIncluded++;
        debug('after Included++', addr, entry);
    }
    isWhitelisted(addr) {
        return this.whitelist.has(addr);
    }
    // https://github.com/eth-infinitism/account-abstraction/blob/develop/eip/EIPS/eip-4337.md#reputation-scoring-and-throttlingbanning-for-paymasters
    getStatus(addr) {
        if (addr == null || this.whitelist.has(addr)) {
            return ReputationStatus.OK;
        }
        if (this.blackList.has(addr)) {
            return ReputationStatus.BANNED;
        }
        const entry = this.entries[addr];
        if (entry == null) {
            return ReputationStatus.OK;
        }
        const minExpectedIncluded = Math.min(entry.opsSeen / this.params.minInclusionDenominator);
        if (minExpectedIncluded <= entry.opsIncluded + this.params.throttlingSlack) {
            return ReputationStatus.OK;
        }
        else if (minExpectedIncluded <= entry.opsIncluded + this.params.banSlack) {
            return ReputationStatus.THROTTLED;
        }
        else {
            return ReputationStatus.BANNED;
        }
    }
    /**
     * an entity that caused handleOps to revert, which requires re-building the bundle from scratch.
     * should be banned immediately, by increasing its opSeen counter
     * @param addr
     */
    crashedHandleOps(addr) {
        if (addr == null) {
            return;
        }
        // todo: what value to put? how long do we want this banning to hold?
        const entry = this._getOrCreate(addr);
        entry.opsSeen = 100;
        entry.opsIncluded = 0;
        debug('crashedHandleOps', addr, entry);
    }
    /**
     * for debugging: clear in-memory state
     */
    clearState() {
        this.entries = {};
    }
    /**
     * for debugging: put in the given reputation entries
     * @param entries
     */
    setReputation(reputations) {
        reputations.forEach(rep => {
            this.entries[rep.address] = {
                address: rep.address,
                opsSeen: rep.opsSeen,
                opsIncluded: rep.opsIncluded
            };
        });
        return this.dump();
    }
    /**
     * check the given address (account/paymaster/deployer/aggregator) is staked
     * @param title the address title (field name to put into the "data" element)
     * @param raddr the address to check the stake of. null is "ok"
     * @param info stake info from verification. if not given, then read from entryPoint
     */
    checkStake(title, info) {
        if ((info === null || info === void 0 ? void 0 : info.addr) == null || this.isWhitelisted(info.addr)) {
            return;
        }
        (0, utils_1.requireCond)(this.getStatus(info.addr) !== ReputationStatus.BANNED, `${title} ${info.addr} is banned`, Types_1.ValidationErrors.Reputation, { [title]: info.addr });
        (0, utils_1.requireCond)(ethers_1.BigNumber.from(info.stake).gte(this.minStake), `${title} ${info.addr} stake ${(0, utils_1.tostr)(info.stake)} is too low (min=${(0, utils_1.tostr)(this.minStake)})`, Types_1.ValidationErrors.InsufficientStake);
        (0, utils_1.requireCond)(ethers_1.BigNumber.from(info.unstakeDelaySec).gte(this.minUnstakeDelay), `${title} ${info.addr} unstake delay ${(0, utils_1.tostr)(info.unstakeDelaySec)} is too low (min=${(0, utils_1.tostr)(this.minUnstakeDelay)})`, Types_1.ValidationErrors.InsufficientStake);
    }
}
exports.ReputationManager = ReputationManager;
//# sourceMappingURL=ReputationManager.js.map