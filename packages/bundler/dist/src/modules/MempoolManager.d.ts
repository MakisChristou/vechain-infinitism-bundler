import { BigNumberish } from 'ethers';
import { ReputationManager } from './ReputationManager';
import { ReferencedCodeHashes, StakeInfo, UserOperation } from './Types';
export interface MempoolEntry {
    userOp: UserOperation;
    userOpHash: string;
    prefund: BigNumberish;
    referencedContracts: ReferencedCodeHashes;
    aggregator?: string;
}
type MempoolDump = UserOperation[];
export declare class MempoolManager {
    readonly reputationManager: ReputationManager;
    private mempool;
    private entryCount;
    constructor(reputationManager: ReputationManager);
    count(): number;
    addUserOp(userOp: UserOperation, userOpHash: string, prefund: BigNumberish, senderInfo: StakeInfo, referencedContracts: ReferencedCodeHashes, aggregator?: string): void;
    private updateSeenStatus;
    private checkSenderCountInMempool;
    private checkReplaceUserOp;
    getSortedForInclusion(): MempoolEntry[];
    _findBySenderNonce(sender: string, nonce: BigNumberish): number;
    _findByHash(hash: string): number;
    /**
     * remove UserOp from mempool. either it is invalid, or was included in a block
     * @param userOpOrHash
     */
    removeUserOp(userOpOrHash: UserOperation | string): void;
    /**
     * debug: dump mempool content
     */
    dump(): MempoolDump;
    /**
     * for debugging: clear current in-memory state
     */
    clearState(): void;
}
export {};
