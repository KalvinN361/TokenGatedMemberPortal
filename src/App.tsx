import React, { useEffect } from 'react';
import './styles/output.css';
import MRoutes from './MRoutes';
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import * as process from 'process';
import {
    coinbaseConnector,
    ledgerConnector,
    magicConnector,
} from '@libs/connectors';
import CBLogo from '@assets/logos/cbwallet.png';
import MagicLogo from '@assets/logos/email-white.png';
import { PVLogin } from '@components/Login';
import packageJson from '../package.json';

const projectId = process.env.REACT_APP_WC_APP_ID as string;
const alchemyKey = process.env.REACT_APP_ALCHEMY_API_KEY as string;

const { chains, publicClient } = configureChains(
    [mainnet, polygon, goerli, polygonMumbai],
    [alchemyProvider({ apiKey: alchemyKey })]
);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        coinbaseConnector,
        magicConnector,
        ledgerConnector,
        ...w3mConnectors({ projectId, chains }),
    ],
    publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const App = () => {
    useEffect(() => {
        let version = localStorage.getItem('version');
        if (version !== packageJson.version) {
            console.log('PV::Clearing Cache');
            caches.keys().then((names) => {
                for (const name of names) {
                    caches.delete(name);
                }
            });
            window.location.reload();
        }
        localStorage.clear();
        localStorage.setItem('version', packageJson.version);
    }, []);
    /*    useEffect(() => {
          localStorage.clear();
          //console.log({ alchemyKey });
      }, []);*/

    return (
        <div className="App">
            <WagmiConfig config={wagmiConfig}>
                <PVLogin />
                <MRoutes />
                <Web3Modal
                    projectId={projectId}
                    ethereumClient={ethereumClient}
                    walletImages={{
                        coinbaseWallet: CBLogo,
                        magic: MagicLogo,
                    }}
                    themeMode={'dark'}
                    themeVariables={{
                        '--w3m-logo-image-url':
                            'https://storage.googleapis.com/pvportals/PVHome.png',
                        '--w3m-background-color': '#000000',
                    }}
                    explorerRecommendedWalletIds={[
                        '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
                        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
                        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
                    ]}
                    explorerExcludedWalletIds={'ALL'}
                    enableExplorer={true}
                />{' '}
            </WagmiConfig>
        </div>
    );
};

export default App;
