import { Keypair } from '@chainsafe/bls/lib/keypair';
import { WalletService } from '../WalletService';
import * as crypto from 'crypto';
const randomBytes = require('randombytes');
import * as ethUtil from 'ethereumjs-util';
import { Key } from 'react';
import { PrivateKey } from '@chainsafe/bls/lib/privateKey';
import { V3Params, V3ParamsStrict, KDFParams, KDFFunctions, V3Keystore } from './KeystoreInterfaces';
import { KeystoreHelper } from './KeystoreHelper';
const uuidv4 = require('uuid/v4');
const scryptsy = require('scrypt.js');

/**
 * Keystore class which creates and saves bls generated keys
 */
export default class Keystore {
    keypair: Keypair;

    public constructor(keypair: Keypair) {
        this.keypair = keypair;
    }

    public saveJSON(password: string, opts?: Partial<V3Params>) {
        const v3Params: V3ParamsStrict = KeystoreHelper.mergeToV3ParamsWithDefaults(opts);

        let kdfParams: KDFParams;
        let derivedKey: Buffer;

        switch (v3Params.kdf) {
            case KDFFunctions.PBKDF:
                kdfParams = KeystoreHelper.kdfParamsForPBKDF(v3Params);
                derivedKey = crypto.pbkdf2Sync(
                    Buffer.from(password),
                    kdfParams.salt,
                    kdfParams.c,
                    kdfParams.dklen,
                    'sha256'
                );
                break;
            case KDFFunctions.Scrypt:
                kdfParams = KeystoreHelper.kdfParamsForScrypt(v3Params);
                // FIXME: support progress reporting callback
                derivedKey = scryptsy(
                    Buffer.from(password),
                    kdfParams.salt,
                    kdfParams.n,
                    kdfParams.r,
                    kdfParams.p,
                    kdfParams.dklen
                );
                break;
            default:
                throw new Error('Unsupported kdf');
        }

        const cipher: crypto.Cipher = crypto.createCipheriv(v3Params.cipher, derivedKey.slice(0, 16), v3Params.iv);
        if (!cipher) {
            throw new Error('Unsupported cipher');
        }

        const ciphertext = KeystoreHelper.runCipherBuffer(cipher, this.keypair.privateKey.toBytes());
        const mac = ethUtil.keccak256(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)]));

        return {
            version: 3,
            id: uuidv4({ random: v3Params.uuid }),
            // @ts-ignore - the official V3 keystore spec omits the address key
            address: this.keypair.publicKey.toHexString(),
            crypto: {
                ciphertext: ciphertext.toString('hex'),
                cipherparams: { iv: v3Params.iv.toString('hex') },
                cipher: v3Params.cipher,
                kdf: v3Params.kdf,
                kdfparams: {
                    ...kdfParams,
                    salt: kdfParams.salt.toString('hex')
                },
                mac: mac.toString('hex')
            }
        };
    }

    public fromJSON(input: string | V3Keystore, password: string) {
        const json: V3Keystore = typeof input === 'object' ? input : JSON.parse(input);

        if (json.version !== 3) {
            throw new Error('Not a V3 wallet');
        }

        let derivedKey: Buffer;
        let kdfparams: any;

        if (json.crypto.kdf === 'scrypt') {
            kdfparams = json.crypto.kdfparams;

            derivedKey = scryptsy(
                Buffer.from(password),
                Buffer.from(kdfparams.salt, 'hex'),
                kdfparams.n,
                kdfparams.r,
                kdfparams.p,
                kdfparams.dklen
            );
        } else if (json.crypto.kdf === 'pbkdf2') {
            kdfparams = json.crypto.kdfparams;

            if (kdfparams.prf !== 'hmac-sha256') {
                throw new Error('Unsupported parameters to PBKDF2');
            }

            derivedKey = crypto.pbkdf2Sync(
                Buffer.from(password),
                Buffer.from(kdfparams.salt, 'hex'),
                kdfparams.c,
                kdfparams.dklen,
                'sha256'
            );
        } else {
            throw new Error('Unsupported key derivation scheme');
        }

        const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');
        const mac = ethUtil.keccak256(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));
        if (mac.toString('hex') !== json.crypto.mac) {
            throw new Error('Key derivation failed - possibly wrong passphrase');
        }

        const decipher = crypto.createDecipheriv(
            json.crypto.cipher,
            derivedKey.slice(0, 16),
            Buffer.from(json.crypto.cipherparams.iv, 'hex')
        );
        const seed = KeystoreHelper.runCipherBuffer(decipher, ciphertext);

        return PrivateKey.fromBytes(seed);
    }
}
