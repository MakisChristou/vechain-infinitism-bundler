import { EntryPoint } from '@account-abstraction/contracts';
import { BundlerCollectorReturn } from './BundlerCollectorTracer';
import { ValidationResult } from './modules/ValidationManager';
import { StorageMap, UserOperation } from './modules/Types';
/**
 * parse collected simulation traces and revert if they break our rules
 * @param userOp the userOperation that was used in this simulation
 * @param tracerResults the tracer return value
 * @param validationResult output from simulateValidation
 * @param entryPoint the entryPoint that hosted the "simulatedValidation" traced call.
 * @return list of contract addresses referenced by this UserOp
 */
export declare function parseScannerResult(userOp: UserOperation, tracerResults: BundlerCollectorReturn, validationResult: ValidationResult, entryPoint: EntryPoint): [string[], StorageMap];
