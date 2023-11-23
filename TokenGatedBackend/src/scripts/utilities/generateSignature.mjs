import { SiweMessage } from 'siwe';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import ethers from 'ethers';

let wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY_LEAKED);

const siweMessage = new SiweMessage({
    domain: 'example.com',
    address: wallet.address,
    chainId: 1,
    version: '1',
    nonce: 'YxwpjreMBGwL2xJle',
    uri: 'https://example.com',
    statement: 'I want to sign in',
});

let message = siweMessage.prepareMessage();

let signature = await wallet.signMessage(message);

console.log(JSON.stringify({ message, signature }));
