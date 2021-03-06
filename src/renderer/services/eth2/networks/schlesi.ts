import {config as mainnetBeaconConfig} from "@chainsafe/lodestar-config/lib/presets/mainnet";
import {ethers} from "ethers";
import {IDockerRunParams} from "../../docker/type";
import {SupportedNetworks} from "../supportedNetworks";
import {INetworkConfig} from "../../interfaces";

const dockerConfig: IDockerRunParams = {
    name: "Schlesi-beacon-node",
    image: "sigp/lighthouse:latest",
    restart: "unless-stopped",
    cmd: "lighthouse beacon --http --http-address 0.0.0.0 --eth1-endpoint https://goerli.prylabs.net",
    volume: "/root/.lighthouse",
    ports: [
        {
            local: "9000",
            host: "9000",
        },
        {
            local: "5052",
            host: "5052",
        }
    ]
};

export const SchlesiConfig: INetworkConfig = {
    networkName: SupportedNetworks.SCHLESI,
    networkId: 5,
    contract: {
        address: "0xA15554BF93a052669B511ae29EA21f3581677ac5",
        depositAmount: 32,
        bytecode: "0x",
        deployedAtBlock: 2596126
    },
    eth2Config: {
        ...mainnetBeaconConfig,
        params: {
            ...mainnetBeaconConfig.params,
            GENESIS_FORK_VERSION: Buffer.from("0x00000000")
        },
    },
    eth1Provider: ethers.getDefaultProvider("goerli"),
    dockerConfig,
};
