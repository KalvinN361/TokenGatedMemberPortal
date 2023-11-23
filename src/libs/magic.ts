import { Magic } from 'magic-sdk';
import * as process from 'process';
import { Asset } from '@definitions/Asset';
import { Contract as ContractType } from '@definitions/Contract';
import { Api } from '@libs/API';
import { ethers } from 'ethers';
import { CustomNodeConfiguration } from '@magic-sdk/types/dist/types/modules/rpc-provider-types';

// Initialize the Magic instance
const magicKey = process.env.REACT_APP_MAGIC_KEY as string;

export const magic = new Magic(magicKey, {
    network: {
        rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/hvIrefKw6sFiKwtScQFcTmDqwqYPvsFG',
        chainId: 137,
    },
});
