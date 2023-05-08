import { BytesLike, ContractFactory } from 'ethers';
import { Result } from 'ethers/lib/utils';
import { StorageMap } from './Types';
import { Provider } from '@ethersproject/providers';
export declare function getAddr(data?: BytesLike): string | undefined;
/**
 * merge all validationStorageMap objects into merged map
 * - entry with "root" (string) is always preferred over entry with slot-map
 * - merge slot entries
 * NOTE: slot values are supposed to be the value before the transaction started.
 *  so same address/slot in different validations should carry the same value
 * @param mergedStorageMap
 * @param validationStorageMap
 */
export declare function mergeStorageMap(mergedStorageMap: StorageMap, validationStorageMap: StorageMap): StorageMap;
export declare function toBytes32(b: BytesLike | number): string;
/**
 * run the constructor of the given type as a script: it is expected to revert with the script's return values.
 * @param provider provider to use fo rthe call
 * @param c - contract factory of the script class
 * @param ctrParams constructor parameters
 * @return an array of arguments of the error
 * example usasge:
 *     hashes = await runContractScript(provider, new GetUserOpHashes__factory(), [entryPoint.address, userOps]).then(ret => ret.userOpHashes)
 */
export declare function runContractScript<T extends ContractFactory>(provider: Provider, c: T, ctrParams: Parameters<T['getDeployTransaction']>): Promise<Result>;
