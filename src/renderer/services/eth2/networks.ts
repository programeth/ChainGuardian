import {config as mainnetBeaconConfig} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import {config as minimalBeaconConfig} from "@chainsafe/eth2.0-config/lib/presets/minimal";
import {ethers} from "ethers";
import {JsonRpcProvider} from "ethers/providers";
import {INetworkConfig} from "../interfaces";
import {SupportedNetworks} from "./supportedNetworks";

const isLocal = process.env.NODE_ENV !== "production";

const networks: INetworkConfig[] = [
    {
        networkName: SupportedNetworks.PRYSM,
        networkId: 5,
        contract: {
            address: "0xD775140349E6A5D12524C6ccc3d6A1d4519D4029",
            depositAmount: 3.2,
            bytecode: "0x",
            deployedAtBlock: 1259282
        },
        eth2Config: {
            ...mainnetBeaconConfig,
            params: {
                ...mainnetBeaconConfig.params,
                MAX_EFFECTIVE_BALANCE: BigInt(3200000000000000000),
                GENESIS_FORK_VERSION: Buffer.from([0, 0, 0, 4]),
                EJECTION_BALANCE: BigInt(1600000000000000000)
            }
        },
        eth1Provider: ethers.getDefaultProvider("goerli")
    },
];

if(isLocal) {
    networks.push({
        networkName: "localhost",
        networkId: 999,
        contract: {
            address: "0x2F1598e74b146F5687174C13f8EDCF490B2492e3",
            depositAmount: 32,
            // eslint-disable-next-line max-len
            bytecode: "0x740100000000000000000000000000000000000000006020526f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605274012a05f1fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffed5fa0e000000000000000000000000000000000060a052341561009857600080fd5b6101406000601f818352015b600061014051602081106100b757600080fd5b600260c052602060c020015460208261016001015260208101905061014051602081106100e357600080fd5b600260c052602060c020015460208261016001015260208101905080610160526101609050602060c0825160208401600060025af161012157600080fd5b60c0519050606051600161014051018060405190131561014057600080fd5b809190121561014e57600080fd5b6020811061015b57600080fd5b600260c052602060c02001555b81516001018083528114156100a4575b505061127956600436101561000d576110f4565b600035601c52740100000000000000000000000000000000000000006020526f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605274012a05f1fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffed5fa0e000000000000000000000000000000000060a052600015610286575b6101605261014052600061018052610140516101a0526101c060006008818352015b61018051600860008112156100e8578060000360020a82046100ef565b8060020a82025b905090506101805260ff6101a051166101e052610180516101e0516101805101101561011a57600080fd5b6101e0516101805101610180526101a0517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff86000811215610163578060000360020a820461016a565b8060020a82025b905090506101a0525b81516001018083528114156100cb575b5050601860086020820661020001602082840111156101a157600080fd5b60208061022082610180600060046015f15050818152809050905090508051602001806102c0828460006004600a8704601201f16101de57600080fd5b50506102c05160206001820306601f82010390506103206102c0516020818352015b82610320511015156102115761022d565b6000610320516102e001535b8151600101808352811415610200575b50505060206102a05260406102c0510160206001820306601f8201039050610280525b6000610280511115156102625761027e565b602061028051036102a001516020610280510361028052610250565b610160515650005b63c5f2892f600051141561051857341561029f57600080fd5b6000610140526101405161016052600154610180526101a060006020818352015b60016001610180511614156103415760006101a051602081106102e257600080fd5b600060c052602060c02001546020826102400101526020810190506101605160208261024001015260208101905080610240526102409050602060c0825160208401600060025af161033357600080fd5b60c0519050610160526103af565b6000610160516020826101c00101526020810190506101a0516020811061036757600080fd5b600260c052602060c02001546020826101c0010152602081019050806101c0526101c09050602060c0825160208401600060025af16103a557600080fd5b60c0519050610160525b61018060026103bd57600080fd5b60028151048152505b81516001018083528114156102c0575b505060006101605160208261046001015260208101905061014051610160516101805163806732896102e0526001546103005261030051600658016100a9565b506103605260006103c0525b6103605160206001820306601f82010390506103c0511015156104445761045d565b6103c05161038001526103c0516020016103c052610422565b61018052610160526101405261036060088060208461046001018260208501600060046012f150508051820191505060006018602082066103e001602082840111156104a857600080fd5b60208061040082610140600060046015f150508181528090509050905060188060208461046001018260208501600060046014f150508051820191505080610460526104609050602060c0825160208401600060025af161050857600080fd5b60c051905060005260206000f350005b63621fd130600051141561062c57341561053157600080fd5b6380673289610140526001546101605261016051600658016100a9565b506101c0526000610220525b6101c05160206001820306601f82010390506102205110151561057c57610595565b610220516101e00152610220516020016102205261055a565b6101c0805160200180610280828460006004600a8704601201f16105b857600080fd5b50506102805160206001820306601f82010390506102e0610280516020818352015b826102e0511015156105eb57610607565b60006102e0516102a001535b81516001018083528114156105da575b5050506020610260526040610280510160206001820306601f8201039050610260f350005b632289511860005114156110f357605060043560040161014037603060043560040135111561065a57600080fd5b60406024356004016101c037602060243560040135111561067a57600080fd5b608060443560040161022037606060443560040135111561069a57600080fd5b63ffffffff600154106106ac57600080fd5b633b9aca006102e0526102e0516106c257600080fd5b6102e05134046102c052633b9aca006102c05110156106e057600080fd5b603061014051146106f057600080fd5b60206101c0511461070057600080fd5b6060610220511461071057600080fd5b610140610360525b6103605151602061036051016103605261036061036051101561073a57610718565b6380673289610380526102c0516103a0526103a051600658016100a9565b50610400526000610460525b6104005160206001820306601f8201039050610460511015156107865761079f565b6104605161042001526104605160200161046052610764565b610340610360525b61036051526020610360510361036052610140610360511015156107ca576107a7565b610400805160200180610300828460006004600a8704601201f16107ed57600080fd5b5050610140610480525b61048051516020610480510161048052610480610480511015610819576107f7565b63806732896104a0526001546104c0526104c051600658016100a9565b50610520526000610580525b6105205160206001820306601f8201039050610580511015156108645761087d565b6105805161054001526105805160200161058052610842565b610460610480525b61048051526020610480510361048052610140610480511015156108a857610885565b6105208051602001806105a0828460006004600a8704601201f16108cb57600080fd5b505060a06106205261062051610660526101408051602001806106205161066001828460006004600a8704601201f161090357600080fd5b505061062051610660015160206001820306601f82010390506106006106205161066001516040818352015b826106005110151561094057610961565b600061060051610620516106800101535b815160010180835281141561092f575b505050602061062051610660015160206001820306601f82010390506106205101016106205261062051610680526101c08051602001806106205161066001828460006004600a8704601201f16109b757600080fd5b505061062051610660015160206001820306601f82010390506106006106205161066001516020818352015b82610600511015156109f457610a15565b600061060051610620516106800101535b81516001018083528114156109e3575b505050602061062051610660015160206001820306601f820103905061062051010161062052610620516106a0526103008051602001806106205161066001828460006004600a8704601201f1610a6b57600080fd5b505061062051610660015160206001820306601f82010390506106006106205161066001516020818352015b8261060051101515610aa857610ac9565b600061060051610620516106800101535b8151600101808352811415610a97575b505050602061062051610660015160206001820306601f820103905061062051010161062052610620516106c0526102208051602001806106205161066001828460006004600a8704601201f1610b1f57600080fd5b505061062051610660015160206001820306601f82010390506106006106205161066001516060818352015b8261060051101515610b5c57610b7d565b600061060051610620516106800101535b8151600101808352811415610b4b575b505050602061062051610660015160206001820306601f820103905061062051010161062052610620516106e0526105a08051602001806106205161066001828460006004600a8704601201f1610bd357600080fd5b505061062051610660015160206001820306601f82010390506106006106205161066001516020818352015b8261060051101515610c1057610c31565b600061060051610620516106800101535b8151600101808352811415610bff575b505050602061062051610660015160206001820306601f8201039050610620510101610620527f649bbc62d0e31342afea4e5cd82d4049e7e1ee912fc0889aa790803be39038c561062051610660a160006107005260006101406030806020846107c001018260208501600060046016f150508051820191505060006010602082066107400160208284011115610cc757600080fd5b60208061076082610700600060046015f15050818152809050905090506010806020846107c001018260208501600060046013f1505080518201915050806107c0526107c09050602060c0825160208401600060025af1610d2757600080fd5b60c0519050610720526000600060406020820661086001610220518284011115610d5057600080fd5b606080610880826020602088068803016102200160006004601bf1505081815280905090509050602060c0825160208401600060025af1610d9057600080fd5b60c0519050602082610a600101526020810190506000604060206020820661092001610220518284011115610dc457600080fd5b606080610940826020602088068803016102200160006004601bf15050818152809050905090506020806020846109e001018260208501600060046015f1505080518201915050610700516020826109e0010152602081019050806109e0526109e09050602060c0825160208401600060025af1610e4157600080fd5b60c0519050602082610a6001015260208101905080610a6052610a609050602060c0825160208401600060025af1610e7857600080fd5b60c0519050610840526000600061072051602082610b000101526020810190506101c0602080602084610b0001018260208501600060046015f150508051820191505080610b0052610b009050602060c0825160208401600060025af1610ede57600080fd5b60c0519050602082610c800101526020810190506000610300600880602084610c0001018260208501600060046012f15050805182019150506000601860208206610b800160208284011115610f3357600080fd5b602080610ba082610700600060046015f1505081815280905090509050601880602084610c0001018260208501600060046014f150508051820191505061084051602082610c0001015260208101905080610c0052610c009050602060c0825160208401600060025af1610fa657600080fd5b60c0519050602082610c8001015260208101905080610c8052610c809050602060c0825160208401600060025af1610fdd57600080fd5b60c0519050610ae052606435610ae05114610ff757600080fd5b600180546001825401101561100b57600080fd5b6001815401815550600154610d0052610d2060006020818352015b60016001610d005116141561105b57610ae051610d20516020811061104a57600080fd5b600060c052602060c02001556110ef565b6000610d20516020811061106e57600080fd5b600060c052602060c0200154602082610d40010152602081019050610ae051602082610d4001015260208101905080610d4052610d409050602060c0825160208401600060025af16110bf57600080fd5b60c0519050610ae052610d0060026110d657600080fd5b60028151048152505b8151600101808352811415611026575b5050005b5b60006000fd5b61017f6112790361017f60003961017f611279036000f3",
            deployedAtBlock: 0
        },
        eth2Config: minimalBeaconConfig,
        eth1Provider: new JsonRpcProvider("http://localhost:8545")
    });
}

const getNetworkConfig = (name: string): null | INetworkConfig => {
    const result = networks.filter((network) => network.networkName === name);
    return (result.length === 0) ? null : result[0];
};

const networksList = networks.map((contract) => contract.networkName);

export {
    networks,
    getNetworkConfig,
    networksList,
};
