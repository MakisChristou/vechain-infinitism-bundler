import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumberish } from 'ethers/lib/ethers';
export declare class RpcError extends Error {
    readonly code?: number | undefined;
    readonly data: any;
    constructor(msg: string, code?: number | undefined, data?: any);
}
export declare function tostr(s: BigNumberish): string;
export declare function requireCond(cond: boolean, msg: string, code?: number, data?: any): void;
/**
 * create a dictionary object with given keys
 * @param keys the property names of the returned object
 * @param mapper mapper from key to property value
 * @param filter if exists, must return true to add keys
 */
export declare function mapOf<T>(keys: Iterable<string>, mapper: (key: string) => T, filter?: (key: string) => boolean): {
    [key: string]: T;
};
export declare function sleep(sleepTime: number): Promise<void>;
export declare function waitFor<T>(func: () => T | undefined, timeout?: number, interval?: number): Promise<T>;
export declare function supportsRpcMethod(provider: JsonRpcProvider, method: string): Promise<boolean>;
export declare function isGeth(provider: JsonRpcProvider): Promise<boolean>;
