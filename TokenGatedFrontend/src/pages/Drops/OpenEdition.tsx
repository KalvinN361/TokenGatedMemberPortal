import React, { useEffect, useState } from 'react';
import { Magic, UserInfo } from 'magic-sdk';
import { MoonpayWalletSDK } from '@moonpay/login-sdk';
import { Web3Provider } from '@ethersproject/providers';
import { WalletUserData } from '@moonpay/login-common/dist/wallet-types';

type OpenEditionProps<P = {}> = P;

export const OpenEdition: React.FC<OpenEditionProps> = (props) => {
    const { REACT_APP_MAGIC_KEY, REACT_APP_MOONPAY_API_KEY } = process.env;
    const magic = new Magic(REACT_APP_MAGIC_KEY as string);
    const [provider, setProvider] = useState<Web3Provider>();
    const [account, setAccount] = useState('');
    const [metadata, setMetadata] = useState<WalletUserData>();
    const [email, setEmail] = useState('');
    const [idToken, setIdToken] = useState('');

    const moonpaySdk = new MoonpayWalletSDK(
        {
            //autoLogin: false,
            loginDomain: 'https://buy-sandbox.moonpay.com',
            secureWalletDomain: 'https://web3.moonpay.com',
            apiKey: REACT_APP_MOONPAY_API_KEY as string,
            headless: true,
            /*initialChainNetworkOption: {
ethereum: 5,
}*/
            embeddable: false,
            onPromptChangeCallback: (state) => {
                //console.log({ state });
            },
        },
        {
            onCloseCallback: () => {
                disconnectMoonPayWallet();
            },
        }
    );
    /*const connectWallet = async () => {
const accounts = await magic.wallet
.connectWithUI()
.on('id-token-created', (params) => {
setIdToken(params.idToken);
});
console.log({ accounts });
setAccount(accounts[0]);
};*/

    /*const getEmail = async () => {
let userInfo = await magic.wallet.requestUserInfoWithUI({
scope: { email: 'required' },
});
setEmail(userInfo.email as string);
};*/

    const getMoonPayWalletInfo = async () => {
        if (!provider) return;
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        return;
    };

    const connectMoonPayWallet = async () => {
        await moonpaySdk.init().then(async () => {
            let metadata = moonpaySdk.getWalletMetaData() as WalletUserData;
            setProvider(moonpaySdk.provider);
            setMetadata(metadata);
        });
    };

    const disconnectMoonPayWallet = () => {
        moonpaySdk.disconnectWallet();
        moonpaySdk.logout();
        setAccount('');
        setProvider(undefined);
    };

    useEffect(() => {
        if (!provider) return;
        getMoonPayWalletInfo().then(() => {});
    }, [provider]);

    useEffect(() => {}, [metadata, account]);

    /* useEffect(() => {
if (!account.length) return;
getEmail();
console.log({ account });
}, [account]);*/

    /*useEffect(() => {
if (!email.length) return;
console.log({ email });
}, [email]);*/

    /*const showUI = () => {
magic.wallet.showUI();
};*/

    /*const logout = async () => {
await magic.user.logout();
setAccount('');
};*/

    return (
        <div>
            {!account.length && (
                <div className="login-container text-white">
                    <h1>Login with Wallet Verification</h1>
                    <button onClick={connectMoonPayWallet}>Log in</button>
                    {/*<button onClick={connectWallet}>Log in</button>*/}
                </div>
            )}
            {account.length && (
                <div className={'text-white'}>
                    <h2>ID Token:</h2>
                    <p className="token">{account}</p>
                    <h2>Metadata:</h2>
                    <p className="token">{JSON.stringify(metadata)}</p>
                    <div className="button-container">
                        {/*<button onClick={showUI}>Show UI</button>
                        <button onClick={logout}>Logout</button>*/}
                        <button onClick={disconnectMoonPayWallet}>
                            Disconnect
                        </button>
                    </div>
                </div>
            )}
            <div id={'moonpay-embed-container'}></div>
        </div>
    );
};

export default OpenEdition;
