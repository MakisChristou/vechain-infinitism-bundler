"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGeth = exports.supportsRpcMethod = exports.waitFor = exports.sleep = exports.mapOf = exports.requireCond = exports.tostr = exports.RpcError = void 0;
const ethers_1 = require("ethers");
class RpcError extends Error {
    // error codes from: https://eips.ethereum.org/EIPS/eip-1474
    constructor(msg, code, data = undefined) {
        super(msg);
        this.code = code;
        this.data = data;
    }
}
exports.RpcError = RpcError;
function tostr(s) {
    return ethers_1.BigNumber.from(s).toString();
}
exports.tostr = tostr;
function requireCond(cond, msg, code, data = undefined) {
    if (!cond) {
        throw new RpcError(msg, code, data);
    }
}
exports.requireCond = requireCond;
/**
 * create a dictionary object with given keys
 * @param keys the property names of the returned object
 * @param mapper mapper from key to property value
 * @param filter if exists, must return true to add keys
 */
function mapOf(keys, mapper, filter) {
    const ret = {};
    for (const key of keys) {
        if (filter == null || filter(key)) {
            ret[key] = mapper(key);
        }
    }
    return ret;
}
exports.mapOf = mapOf;
async function sleep(sleepTime) {
    await new Promise(resolve => setTimeout(resolve, sleepTime));
}
exports.sleep = sleep;
async function waitFor(func, timeout = 10000, interval = 500) {
    const endTime = Date.now() + timeout;
    while (true) {
        const ret = await func();
        if (ret != null) {
            return ret;
        }
        if (Date.now() > endTime) {
            throw new Error(`Timed out waiting for ${func}`);
        }
        await sleep(interval);
    }
}
exports.waitFor = waitFor;
async function supportsRpcMethod(provider, method) {
    var _a, _b;
    const ret = await provider.send(method, []).catch(e => e);
    const code = (_b = (_a = ret.error) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : ret.code;
    return code === -32602; // wrong params (meaning, method exists)
}
exports.supportsRpcMethod = supportsRpcMethod;
async function isGeth(provider) {
    const p = provider.send;
    if (p._clientVersion == null) {
        p._clientVersion = await provider.send('web3_clientVersion', []);
    }
    // check if we have traceCall
    // its GETH if it has debug_traceCall method.
    return await supportsRpcMethod(provider, 'debug_traceCall');
    // debug('client version', p._clientVersion)
    // return p._clientVersion?.match('go1') != null
}
exports.isGeth = isGeth;
//# sourceMappingURL=utils.js.map