import { Express, Response, Request } from 'express';
import { Provider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { BundlerConfig } from './BundlerConfig';
import { UserOpMethodHandler } from './UserOpMethodHandler';
import { DebugMethodHandler } from './DebugMethodHandler';
export declare class BundlerServer {
    readonly methodHandler: UserOpMethodHandler;
    readonly debugHandler: DebugMethodHandler;
    readonly config: BundlerConfig;
    readonly provider: Provider;
    readonly wallet: Wallet;
    app: Express;
    private readonly httpServer;
    constructor(methodHandler: UserOpMethodHandler, debugHandler: DebugMethodHandler, config: BundlerConfig, provider: Provider, wallet: Wallet);
    startingPromise: Promise<void>;
    asyncStart(): Promise<void>;
    stop(): Promise<void>;
    _preflightCheck(): Promise<void>;
    fatal(msg: string): never;
    intro(req: Request, res: Response): void;
    rpc(req: Request, res: Response): Promise<void>;
    handleMethod(method: string, params: any[]): Promise<any>;
}
