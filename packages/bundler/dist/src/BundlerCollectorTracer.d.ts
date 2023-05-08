import { LogTracer } from './GethTracer';
/**
 * return type of our BundlerCollectorTracer.
 * collect access and opcodes, split into "levels" based on NUMBER opcode
 * keccak, calls and logs are collected globally, since the levels are unimportant for them.
 */
export interface BundlerCollectorReturn {
    /**
     * storage and opcode info, collected between "NUMBER" opcode calls (which is used as our "level marker")
     */
    numberLevels: NumberLevelInfo[];
    /**
     * values passed into KECCAK opcode
     */
    keccak: string[];
    calls: Array<ExitInfo | MethodInfo>;
    logs: LogInfo[];
    debug: any[];
}
export interface MethodInfo {
    type: string;
    from: string;
    to: string;
    method: string;
    value: any;
    gas: number;
}
export interface ExitInfo {
    type: 'REVERT' | 'RETURN';
    gasUsed: number;
    data: string;
}
export interface NumberLevelInfo {
    opcodes: {
        [opcode: string]: number;
    };
    access: {
        [address: string]: AccessInfo;
    };
    contractSize: {
        [addr: string]: number;
    };
    oog?: boolean;
}
export interface AccessInfo {
    reads: {
        [slot: string]: string;
    };
    writes: {
        [slot: string]: number;
    };
}
export interface LogInfo {
    topics: string[];
    data: string;
}
/**
 * type-safe local storage of our collector. contains all return-value properties.
 * (also defines all "trace-local" variables and functions)
 */
interface BundlerCollectorTracer extends LogTracer, BundlerCollectorReturn {
    lastOp: string;
    currentLevel: NumberLevelInfo;
    numberCounter: number;
    countSlot: (list: {
        [key: string]: number | undefined;
    }, key: any) => void;
}
/**
 * tracer to collect data for opcode banning.
 * this method is passed as the "tracer" for eth_traceCall (note, the function itself)
 *
 * returned data:
 *  numberLevels: opcodes and memory access, split on execution of "number" opcode.
 *  keccak: input data of keccak opcode.
 *  calls: for each call, an array of [type, from, to, value]
 *  slots: accessed slots (on any address)
 */
export declare function bundlerCollectorTracer(): BundlerCollectorTracer;
export {};
