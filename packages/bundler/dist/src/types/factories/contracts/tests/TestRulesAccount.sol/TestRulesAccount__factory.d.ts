import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { TestRulesAccount, TestRulesAccountInterface } from "../../../../contracts/tests/TestRulesAccount.sol/TestRulesAccount";
type TestRulesAccountConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class TestRulesAccount__factory extends ContractFactory {
    constructor(...args: TestRulesAccountConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<TestRulesAccount>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): TestRulesAccount;
    connect(signer: Signer): TestRulesAccount__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506110ac806100206000396000f3fe60806040526004361061007b5760003560e01c8063a9a234091161004e578063a9a2340914610140578063a9e966b714610161578063cd330fb014610181578063f465c77e146101a157600080fd5b8063107679041461008057806311df9995146100955780633a871cdd146100d257806382e46b7514610100575b600080fd5b61009361008e366004610c16565b6101cf565b005b3480156100a157600080fd5b506001546100b5906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100de57600080fd5b506100f26100ed366004610c33565b61022d565b6040519081526020016100c9565b34801561010c57600080fd5b506100f261011b366004610c16565b600180546001600160a01b0319166001600160a01b0392909216919091179055600090565b34801561014c57600080fd5b5061009361015b366004610c87565b50505050565b34801561016d57600080fd5b5061009361017c366004610d16565b610315565b34801561018d57600080fd5b506100f261019c366004610d45565b610356565b3480156101ad57600080fd5b506101c16101bc366004610c33565b610b70565b6040516100c9929190610e4e565b604051621cb65b60e51b8152600160048201526001600160a01b03821690630396cb609034906024016000604051808303818588803b15801561021157600080fd5b505af1158015610225573d6000803e3d6000fd5b505050505050565b6000811561028157604051600090339084908381818185875af1925050503d8060008114610277576040519150601f19603f3d011682016040523d82523d6000602084013e61027c565b606091505b505050505b61028f610140850185610e70565b90506004036102bd5760006102a8610140860186610e70565b6102b191610ebe565b60e01c915061030e9050565b6103086102ce610140860186610e70565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061035692505050565b50600090505b9392505050565b60005460408051918252602082018390527fe56f542cbdb0e18291d73ec9fd0b443112d0b4f547479e1303ffbc1007cc4f0f910160405180910390a1600055565b6040805160208082019092526000908190528251918301919091207fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4700361039f57506000919050565b604080518082019091526006815265373ab6b132b960d11b6020918201528251908301207ff648814c67221440671fd7c2de979db4020a9320fb7985ff79ca8e7dced277f8036103f0575043919050565b604080518082019091526008815267636f696e6261736560c01b6020918201528251908301207f76ec948a9207fdea26dcba91086bcdd181920ff52a539b0d1eb28e73b4cd92af03610443575041919050565b6040805180820190915260098152680c4d8dec6d6d0c2e6d60bb1b6020918201528251908301207fd60ee5d9b1a312631632d0ab8816ca64259093d8ab0b4d29f35db6a6151b0f8d0361049857505060004090565b60408051808201909152600781526631b932b0ba329960c91b6020918201528251908301207f8fac3d089893f1e87120aee7f9c091bedb61facca5e493da02330bcb46f0949c0361057a576040516001906104f290610bf2565b8190604051809103906000f5905080158015610512573d6000803e3d6000fd5b506001600160a01b0316633fa4f2456040518163ffffffff1660e01b8152600401602060405180830381865afa158015610550573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105749190610eee565b92915050565b60408051808201909152600c81526b3130b630b731b296b9b2b63360a11b6020918201528251908301207fe1eb40348c4d42c6f93b840cbedec69afb249b96fd8af4bcbeed87fcef3815d803610613576001546040516370a0823160e01b81523060048201526001600160a01b03909116906370a08231906024015b602060405180830381865afa158015610550573d6000803e3d6000fd5b60408051808201909152601081526f616c6c6f77616e63652d73656c662d3160801b6020918201528251908301207fcc3befdbd4c845f2f5f48ac59e621de2a47c26950d22d6092b4c2ffafdfc7f9f0361069e5760018054604051636eb1769f60e11b815230600482015260248101929092526001600160a01b03169063dd62ed3e906044016105f6565b60408051808201909152601081526f30b63637bbb0b731b2969896b9b2b63360811b6020918201528251908301207f46b549298973374f07ae868394b73f37c1cf6f25e976e36f99f1abbe6a5284e6036107295760018054604051636eb1769f60e11b815260048101929092523060248301526001600160a01b03169063dd62ed3e906044016105f6565b60408051808201909152600981526836b4b73a16b9b2b63360b91b6020918201528251908301207f39509d2173ec8a4262a15fa569ebaeed05ddef813417dbd2877e415703355b6e036107c1576001546040516335313c2160e11b81523060048201526001600160a01b0390911690636a627842906024015b6020604051808303816000875af1158015610550573d6000803e3d6000fd5b60408051808201909152600981526862616c616e63652d3160b81b6020918201528251908301207f48bf62c98ebd199a8c4fa7e17d20fdbda06a014deb397741460366ff7e1e07550361083f57600180546040516370a0823160e01b815260048101929092526001600160a01b0316906370a08231906024016105f6565b6040805180820190915260068152656d696e742d3160d01b6020918201528251908301207ff794573481a09002e3e46f42daa5499159620e2a2cc3f5bdd26c0a2669544d93036108ba57600180546040516335313c2160e11b815260048101929092526001600160a01b031690636a627842906024016107a2565b60408051808201909152600b81526a39ba393ab1ba16b9b2b63360a91b6020918201528251908301207e05e75ff00cb9bce888bba342b06e4b9d4695ba7caf0afdef7ef8cf6735bb7d036109845760015460405160016222a30f60e01b031981523060048201526001600160a01b039091169063ffdd5cf1906024015b6060604051808303816000875af1158015610956573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061097a9190610f07565b6040015192915050565b6040805180820190915260088152677374727563742d3160c01b6020918201528251908301207f416c09f102f2ef6799166d01fa870b6995b38e93784afdbdda0c68b94ab7eadd03610a04576001805460405160016222a30f60e01b0319815260048101929092526001600160a01b03169063ffdd5cf190602401610937565b60408051808201909152600c81526b1a5b9b995c8b5c995d995c9d60a21b6020918201528251908301207fc78ed5b2fc828eecd2c4fb3d39653e18c93b7d1815a5571aa088439dec36211a03610aa957600160009054906101000a90046001600160a01b03166001600160a01b03166325d9185c6040518163ffffffff1660e01b81526004016020604051808303816000875af1158015610550573d6000803e3d6000fd5b604080518082019091526008815267656d69742d6d736760c01b6020918201528251908301207f9b68a4beda047bbcff1923196e9af52348c30a06718efbeffa6d1dcc2c0a40fe03610b30576040513081527fc798341d2d62b28e8ed71452b00bdba7767fa7086ec2f2c695b40263a0eb7e909060200160405180910390a1506000919050565b81604051602001610b419190610f63565b60408051601f198184030181529082905262461bcd60e51b8252610b6791600401610f99565b60405180910390fd5b6060600080610b83610120870187610e70565b610b91916014908290610fac565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929350610bd492508391506103569050565b50506040805160208101909152600080825290969095509350505050565b60a080610fd783390190565b6001600160a01b0381168114610c1357600080fd5b50565b600060208284031215610c2857600080fd5b813561030e81610bfe565b600080600060608486031215610c4857600080fd5b833567ffffffffffffffff811115610c5f57600080fd5b84016101608187031215610c7257600080fd5b95602085013595506040909401359392505050565b60008060008060608587031215610c9d57600080fd5b843560038110610cac57600080fd5b9350602085013567ffffffffffffffff80821115610cc957600080fd5b818701915087601f830112610cdd57600080fd5b813581811115610cec57600080fd5b886020828501011115610cfe57600080fd5b95986020929092019750949560400135945092505050565b600060208284031215610d2857600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b600060208284031215610d5757600080fd5b813567ffffffffffffffff80821115610d6f57600080fd5b818401915084601f830112610d8357600080fd5b813581811115610d9557610d95610d2f565b604051601f8201601f19908116603f01168101908382118183101715610dbd57610dbd610d2f565b81604052828152876020848701011115610dd657600080fd5b826020860160208301376000928101602001929092525095945050505050565b60005b83811015610e11578181015183820152602001610df9565b8381111561015b5750506000910152565b60008151808452610e3a816020860160208601610df6565b601f01601f19169290920160200192915050565b604081526000610e616040830185610e22565b90508260208301529392505050565b6000808335601e19843603018112610e8757600080fd5b83018035915067ffffffffffffffff821115610ea257600080fd5b602001915036819003821315610eb757600080fd5b9250929050565b6001600160e01b03198135818116916004851015610ee65780818660040360031b1b83161692505b505092915050565b600060208284031215610f0057600080fd5b5051919050565b600060608284031215610f1957600080fd5b6040516060810181811067ffffffffffffffff82111715610f3c57610f3c610d2f565b80604052508251815260208301516020820152604083015160408201528091505092915050565b6d03ab735b737bbb710393ab6329d160951b815260008251610f8c81600e850160208701610df6565b91909101600e0192915050565b60208152600061030e6020830184610e22565b60008085851115610fbc57600080fd5b83861115610fc957600080fd5b505082019391909203915056fe60806040526001600055348015601457600080fd5b50607d806100236000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b603560005481565b60405190815260200160405180910390f3fea2646970667358221220f1be44942564af01bec8073ab77989eb06c1ee35f521c107fb2754b48eb025df64736f6c634300080f0033a26469706673582212201047bf79dd1dc0039ecb6fd57fde0edb608cd952e383627ef75f97ee43e9953264736f6c634300080f0033";
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "oldState";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "newState";
            readonly type: "uint256";
        }];
        readonly name: "State";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "eventSender";
            readonly type: "address";
        }];
        readonly name: "TestMessage";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IEntryPoint";
            readonly name: "entryPoint";
            readonly type: "address";
        }];
        readonly name: "addStake";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "coin";
        readonly outputs: readonly [{
            readonly internalType: "contract TestCoin";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "enum IPaymaster.PostOpMode";
            readonly name: "";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "postOp";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "rule";
            readonly type: "string";
        }];
        readonly name: "runRule";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract TestCoin";
            readonly name: "_coin";
            readonly type: "address";
        }];
        readonly name: "setCoin";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_state";
            readonly type: "uint256";
        }];
        readonly name: "setState";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "nonce";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "initCode";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "callData";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "callGasLimit";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "verificationGasLimit";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "preVerificationGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "maxFeePerGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "maxPriorityFeePerGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "paymasterAndData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct UserOperation";
            readonly name: "userOp";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "validatePaymasterUserOp";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "context";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "nonce";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "initCode";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "callData";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "callGasLimit";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "verificationGasLimit";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "preVerificationGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "maxFeePerGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "maxPriorityFeePerGas";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "paymasterAndData";
                readonly type: "bytes";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct UserOperation";
            readonly name: "userOp";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "missingAccountFunds";
            readonly type: "uint256";
        }];
        readonly name: "validateUserOp";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): TestRulesAccountInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TestRulesAccount;
}
export {};
