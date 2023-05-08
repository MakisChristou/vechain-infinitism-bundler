"use strict";
// misc utilities for the various modules.
Object.defineProperty(exports, "__esModule", { value: true });
exports.runContractScript = exports.toBytes32 = exports.mergeStorageMap = exports.getAddr = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
// extract address from initCode or paymasterAndData
function getAddr(data) {
    if (data == null) {
        return undefined;
    }
    const str = (0, utils_1.hexlify)(data);
    if (str.length >= 42) {
        return str.slice(0, 42);
    }
    return undefined;
}
exports.getAddr = getAddr;
/**
 * merge all validationStorageMap objects into merged map
 * - entry with "root" (string) is always preferred over entry with slot-map
 * - merge slot entries
 * NOTE: slot values are supposed to be the value before the transaction started.
 *  so same address/slot in different validations should carry the same value
 * @param mergedStorageMap
 * @param validationStorageMap
 */
function mergeStorageMap(mergedStorageMap, validationStorageMap) {
    Object.entries(validationStorageMap).forEach(([addr, validationEntry]) => {
        if (typeof validationEntry === 'string') {
            // it's a root. override specific slots, if any
            mergedStorageMap[addr] = validationEntry;
        }
        else if (typeof mergedStorageMap[addr] === 'string') {
            // merged address already contains a root. ignore specific slot values
        }
        else {
            let slots;
            if (mergedStorageMap[addr] == null) {
                slots = mergedStorageMap[addr] = {};
            }
            else {
                slots = mergedStorageMap[addr];
            }
            Object.entries(validationEntry).forEach(([slot, val]) => {
                slots[slot] = val;
            });
        }
    });
    return mergedStorageMap;
}
exports.mergeStorageMap = mergeStorageMap;
function toBytes32(b) {
    return (0, utils_1.hexZeroPad)((0, utils_1.hexlify)(b).toLowerCase(), 32);
}
exports.toBytes32 = toBytes32;
/**
 * run the constructor of the given type as a script: it is expected to revert with the script's return values.
 * @param provider provider to use fo rthe call
 * @param c - contract factory of the script class
 * @param ctrParams constructor parameters
 * @return an array of arguments of the error
 * example usasge:
 *     hashes = await runContractScript(provider, new GetUserOpHashes__factory(), [entryPoint.address, userOps]).then(ret => ret.userOpHashes)
 */
async function runContractScript(provider, c, ctrParams) {
    const tx = c.getDeployTransaction(...ctrParams);
    const ret = await provider.call(tx); // error response 
    const parsed = ethers_1.ContractFactory.getInterface(c.interface).parseError(ret);
    if (parsed == null)
        throw new Error('unable to parse script (error) response: ' + ret);
    return parsed.args;
}
exports.runContractScript = runContractScript;
//# sourceMappingURL=moduleUtils.js.map