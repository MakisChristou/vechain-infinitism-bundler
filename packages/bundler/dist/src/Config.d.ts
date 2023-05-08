import { BundlerConfig } from './BundlerConfig';
import { Wallet } from 'ethers';
import { BaseProvider } from '@ethersproject/providers';
export declare function resolveConfiguration(programOpts: any): Promise<{
    config: BundlerConfig;
    provider: BaseProvider;
    wallet: Wallet;
}>;
