import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type { TracerTest, TracerTestInterface } from "../../../contracts/tests/TracerTest";
type TracerTestConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TracerTest__factory extends ContractFactory {
    constructor(...args: TracerTestConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<TracerTest>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): TracerTest;
    connect(signer: Signer): TracerTest__factory;
    static readonly bytecode = "0x6080604052601460015534801561001557600080fd5b506106eb806100256000396000f3fe60806040526004361061009c5760003560e01c80634b2a9ffb116100645780634b2a9ffb1461012c5780634df7e3d0146101415780639779872514610157578063c3cefd361461016a578063de553ae914610172578063e041663a1461018557600080fd5b80630dbe671f146100a1578063185c38a4146100c9578063288ebed0146100e05780632f576f201461010d57806343f2b0cb14610119575b600080fd5b3480156100ad57600080fd5b506100b760005481565b60405190815260200160405180910390f35b3480156100d557600080fd5b506100de6101a5565b005b3480156100ec57600080fd5b506100b76100fb3660046103fe565b60026020526000908152604090205481565b3480156100de57600080fd5b34801561012557600080fd5b50426100b7565b34801561013857600080fd5b506100b76101e2565b34801561014d57600080fd5b506100b760015481565b6100b7610165366004610444565b6101ea565b6100b7610230565b6100de61018036600461050a565b6102ca565b34801561019157600080fd5b506100b76101a0366004610525565b610333565b60405162461bcd60e51b815260206004820152600e60248201526d726576657274206d65737361676560901b604482015260640160405180910390fd5b60005a905090565b805160208201206040517f40474c452de0c0e16b7b95c83976848c6800a5a8b7a325bc6fbcad041829da749061022390849084906105f3565b60405180910390a1919050565b60156000908155604051639779872560e01b8152602060048201526005602482015264656d70747960d81b60448201523090639779872590349060640160206040518083038185885af115801561028b573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906102b09190610615565b505060015433600090815260026020526040902081905590565b60005a905081156102da57506101f45b306001600160a01b031663185c38a4826040518263ffffffff1660e01b8152600401600060405180830381600088803b15801561031657600080fd5b5087f115801561032a573d6000803e3d6000fd5b50505050505050565b600080821561033f5750435b600080306001600160a01b0316878760405161035c92919061062e565b6000604051808303816000865af19150503d8060008114610399576040519150601f19603f3d011682016040523d82523d6000602084013e61039e565b606091505b509150915084156103b6576103b3438461063e565b92505b7f63e0bc753f6799d2d8cfc5cd409922fba46c1431270aae9232c19d64a76b8284878784846040516103eb9493929190610664565b60405180910390a1509095945050505050565b60006020828403121561041057600080fd5b81356001600160a01b038116811461042757600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561045657600080fd5b813567ffffffffffffffff8082111561046e57600080fd5b818401915084601f83011261048257600080fd5b8135818111156104945761049461042e565b604051601f8201601f19908116603f011681019083821181831017156104bc576104bc61042e565b816040528281528760208487010111156104d557600080fd5b826020860160208301376000928101602001929092525095945050505050565b8035801515811461050557600080fd5b919050565b60006020828403121561051c57600080fd5b610427826104f5565b60008060006040848603121561053a57600080fd5b833567ffffffffffffffff8082111561055257600080fd5b818601915086601f83011261056657600080fd5b81358181111561057557600080fd5b87602082850101111561058757600080fd5b60209283019550935061059d91860190506104f5565b90509250925092565b6000815180845260005b818110156105cc576020818501810151868301820152016105b0565b818111156105de576000602083870101525b50601f01601f19169290920160200192915050565b60408152600061060660408301856105a6565b90508260208301529392505050565b60006020828403121561062757600080fd5b5051919050565b8183823760009101908152919050565b6000821982111561065f57634e487b7160e01b600052601160045260246000fd5b500190565b60608152836060820152838560808301376000608085830101526000601f19601f8601168201841515602084015260808382030160408401526106aa60808201856105a6565b97965050505050505056fea264697066735822122073c3d215e447667c0fdaa15bef1cdf0c5e59c90389755797ec8fd572c11bb82264736f6c634300080f0033";
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "success";
            readonly type: "bool";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "result";
            readonly type: "bytes";
        }];
        readonly name: "ExecSelfResult";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "input";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes32";
            readonly name: "output";
            readonly type: "bytes32";
        }];
        readonly name: "Keccak";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "a";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "addr2int";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "b";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bool";
            readonly name: "oog";
            readonly type: "bool";
        }];
        readonly name: "callRevertingFunction";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "callTimeStamp";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "callWithValue";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "doNothing";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }, {
            readonly internalType: "bool";
            readonly name: "useNumber";
            readonly type: "bool";
        }];
        readonly name: "execSelf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "revertWithMessage";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "testCallGas";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "asd";
            readonly type: "bytes";
        }];
        readonly name: "testKeccak";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "ret";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }];
    static createInterface(): TracerTestInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TracerTest;
}
export {};
