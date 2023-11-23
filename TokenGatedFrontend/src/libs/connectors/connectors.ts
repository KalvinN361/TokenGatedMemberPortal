import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { goerli, mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector';
import { LedgerConnector } from 'wagmi/connectors/ledger';

const alchemyKey = process.env.REACT_APP_ALCHEMY_API_KEY as string;
const magicKey = process.env.REACT_APP_MAGIC_KEY as string;

export const coinbaseConnector = new CoinbaseWalletConnector({
    chains: [mainnet],
    options: {
        appName: 'Project Venkman',
        jsonRpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    },
});

export const magicConnector = new MagicConnectConnector({
    chains: [mainnet, goerli, polygon, polygonMumbai],
    options: {
        apiKey: magicKey,
    },
});

export const ledgerConnector = new LedgerConnector({
    chains: [mainnet, goerli, polygon, polygonMumbai],
    options: {
        projectId: '6cd044e7144cd9a4006bbabd227cdcd1',
        enableDebugLogs: true,
    },
});
