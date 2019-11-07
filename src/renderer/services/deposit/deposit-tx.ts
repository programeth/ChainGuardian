import {bytes, DepositData} from "@chainsafe/eth2.0-types";
import abi from "ethereumjs-abi";
import {ITx} from "./types";
import {functionSignatureFromABI} from "./utils";
import DepositContract from "../../../../src/renderer/services/deposit/options";
import {DEPOSIT_AMOUNT, DEPOSIT_TX_GAS} from "./constants";
import {Wallet} from "ethers/wallet";
import {utils} from "ethers";

export class DepositTx implements ITx{
    public data: string | bytes;
    public to: string;
    public value: string;

    public constructor(data: string | bytes, to: string, value: string) {
        this.data = data;
        this.to = to;
        this.value = value;
    }

    /**
     * Create instance of @{DepositTx} from arguments.
     *
     * @param depositParams - @{DepositData} object.
     * @param depositContractAddress - address of deployed deposit contract.
     */
    public static generateDepositTx(depositParams: DepositData, depositContractAddress: string): DepositTx {
        const depositFunctionEncoded = abi.simpleEncode(
            functionSignatureFromABI(DepositContract.abi, "deposit"),
            depositParams.pubkey,
            depositParams.withdrawalCredentials,
            depositParams.signature,
        );
        return new DepositTx(
            depositFunctionEncoded,
            depositContractAddress,
            utils.parseEther(DEPOSIT_AMOUNT).toHexString()
        );
    }

    /**
     * Sign this transaction using provided wallet.
     *
     * @param wallet - ethereumjs instance of wallet.
     * @return - transaction signature.
     */
    public async sign(wallet: Wallet): Promise<string> {
        const txData = {
            ...this,
            gasLimit: DEPOSIT_TX_GAS,
        };
        return wallet.sign(txData);
    }
}
