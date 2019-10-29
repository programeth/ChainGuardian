import {ICGKeystore, IV3Keystore, ICGKeystoreFactory} from "./interfaces";
import {Keypair} from "@chainsafe/bls/lib/keypair";
import {writeFileSync, unlinkSync, readFileSync, existsSync} from "fs";
import {PrivateKey} from "@chainsafe/bls/lib/privateKey";
import bech32 from "bech32";
import eth1WalletProvider from "ethereumjs-wallet";

export class Eth1CGKeystore implements ICGKeystore {
    private keystore: IV3Keystore;
    private file: string;

    public constructor(file: string) {
        this.keystore = this.readKeystoreFile(file);
        this.file = file;
    }

    /**
     * Helper static method to create keystore object from ethereumjs-wallet library.
     * @param password password for encryption
     * @param keypair private and public key
     */
    public static createKeystoreObject(password: string, keypair: Keypair): IV3Keystore {
        const keystore = eth1WalletProvider
            .fromPrivateKey(keypair.privateKey.toBytes())
            .toV3(password, {kdf: "pbkdf2"});
        return {
            ...keystore,
            // @ts-ignore - the official V3 keystore spec omits the address key
            address: bech32.toWords(keypair.publicKey.toBytesCompressed())
        };
    }

    /**
     * Static method to create keystore file and ICGKeystore instance
     * @param file file path
     * @param password password for encryption
     * @param keypair private and public key
     */
    public static create(file: string, password: string, keypair: Keypair): ICGKeystore {
        try {
            const keystore = Eth1CGKeystore.createKeystoreObject(password, keypair);
            writeFileSync(file, JSON.stringify(keystore, null, 2));
            return new Eth1CGKeystore(file);
        } catch (err) {
            throw new Error(`Failed to write to ${file}: ${err}`);
        }
    }

    /**
     * Method used to decrypt encrypted private key from keystore file
     * @param password
     */
    public decrypt(password: string): Keypair {
        const keystore = eth1WalletProvider
            .fromV3(JSON.stringify(this.keystore), password);
        const privateKeyString = keystore.getPrivateKeyString();
        const priv = PrivateKey.fromHexString(privateKeyString);
        return new Keypair(priv);
    }

    /**
     * Replacing old password with new password which also change physical keystore file on disk
     *
     * @param oldPassword old password to decrypt private key
     * @param newPassword new password to encrypt private key
     */
    public changePassword(oldPassword: string, newPassword: string): void {
        const keypair = this.decrypt(oldPassword);
        const keystore = Eth1CGKeystore.createKeystoreObject(newPassword, keypair);

        try {
            writeFileSync(this.file, JSON.stringify(keystore, null, 2));
            this.keystore = keystore;
        } catch (err) {
            throw new Error(`Failed to write to ${this.file}: ${err}`);
        }
    }

    public getAddress(): string {
        return this.keystore.address;
    }

    /**
     * Deletes physical keystore file
     */
    public destroy(): void {
        try {
            unlinkSync(this.file);
        } catch (err) {
            throw new Error(`Failed to delete file ${this.file}: ${err}`);
        }
    }

    /**
     * Helper method to read file from path specified by @param file
     * @param file file path
     */
    private readKeystoreFile(file: string): IV3Keystore {
        if (existsSync(file)) {
            try {
                const data = readFileSync(file);
                return JSON.parse(data.toString());
            } catch (err) {
                throw new Error(`${file} could not be parsed`);
            }
        }
        throw new Error(`Cannot find file ${file}`);
    }
}

export const Eth1CGKeystoreFactory: ICGKeystoreFactory = Eth1CGKeystore;