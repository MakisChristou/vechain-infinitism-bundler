import { EntryPoint } from '@account-abstraction/contracts';
import { ReputationManager } from './ReputationManager';
import { BigNumberish } from 'ethers';
import { BundlerCollectorReturn } from '../BundlerCollectorTracer';
import { ReferencedCodeHashes, StakeInfo, StorageMap, UserOperation } from './Types';
/**
 * result from successful simulateValidation
 */
export interface ValidationResult {
    returnInfo: {
        preOpGas: BigNumberish;
        prefund: BigNumberish;
        sigFailed: boolean;
        deadline: number;
    };
    senderInfo: StakeInfo;
    factoryInfo?: StakeInfo;
    paymasterInfo?: StakeInfo;
    aggregatorInfo?: StakeInfo;
}
export interface ValidateUserOpResult extends ValidationResult {
    referencedContracts: ReferencedCodeHashes;
    storageMap: StorageMap;
}
export declare class ValidationManager {
    readonly entryPoint: EntryPoint;
    readonly reputationManager: ReputationManager;
    readonly unsafe: boolean;
    constructor(entryPoint: EntryPoint, reputationManager: ReputationManager, unsafe: boolean);
    _callSimulateValidation(userOp: UserOperation): Promise<ValidationResult>;
    _parseErrorResult(userOp: UserOperation, errorResult: any): ValidationResult;
    _geth_traceCall_SimulateValidation(userOp: UserOperation): Promise<[ValidationResult, BundlerCollectorReturn]>;
    /**
     * validate UserOperation.
     * should also handle unmodified memory (e.g. by referencing cached storage in the mempool
     * one item to check that was un-modified is the aggregator..
     * @param userOp
     */
    validateUserOp(userOp: UserOperation, previousCodeHashes?: ReferencedCodeHashes, checkStakes?: boolean): Promise<ValidateUserOpResult>;
    getCodeHashes(addresses: string[]): Promise<ReferencedCodeHashes>;
    /**
     * perform static checking on input parameters.
     * @param userOp
     * @param entryPointInput
     * @param requireSignature
     * @param requireGasParams
     */
    validateInputParameters(userOp: UserOperation, entryPointInput: string, requireSignature?: boolean, requireGasParams?: boolean): void;
}
