import { ExecutionManager } from './modules/ExecutionManager';
import { ReputationDump, ReputationManager } from './modules/ReputationManager';
import { MempoolManager } from './modules/MempoolManager';
import { SendBundleReturn } from './modules/BundleManager';
import { EventsManager } from './modules/EventsManager';
export declare class DebugMethodHandler {
    readonly execManager: ExecutionManager;
    readonly eventsManager: EventsManager;
    readonly repManager: ReputationManager;
    readonly mempoolMgr: MempoolManager;
    constructor(execManager: ExecutionManager, eventsManager: EventsManager, repManager: ReputationManager, mempoolMgr: MempoolManager);
    setBundlingMode(mode: 'manual' | 'auto'): void;
    setBundleInterval(interval: number | 'manual' | 'auto', maxPoolSize?: number): void;
    sendBundleNow(): Promise<SendBundleReturn | undefined>;
    clearState(): void;
    dumpMempool(): Promise<any>;
    setReputation(param: any): ReputationDump;
    dumpReputation(): ReputationDump;
}
