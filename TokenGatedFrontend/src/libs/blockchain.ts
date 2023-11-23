import { Asset } from '@definitions/Asset';
import { Api } from '@libs/API';
import { Contract as ContractType } from '@definitions/Contract';
import {
    BrowserProvider,
    Contract,
    formatEther,
    formatUnits,
    getAddress,
} from 'ethers';
import { CustomNodeConfiguration } from '@magic-sdk/types/dist/types/modules/rpc-provider-types';
import { Magic } from 'magic-sdk';

export const transferBlockchain = async (asset: Asset, toAddress: string) => {
    const { contractId, tokenId } = asset;
    const dbContract = (await Api.contract.getOneByContractId(
        contractId
    )) as ContractType;
    const { address, chainId, abi } = dbContract;
    if (window.ethereum.chainId !== getChainHexId(chainId)) {
        await switchNetwork(chainId);
    }
    const provider = new BrowserProvider(window.ethereum, chainId);
    const signer = await provider.getSigner();
    const contract = new Contract(address, abi as any, signer);
    const tx = await contract.getFunction('safeTransferFrom')(
        signer.getAddress(),
        toAddress,
        tokenId
    );
    return await tx.wait();
};

export const transferMagic = async (asset: Asset, toAddress: string) => {
    const { contractId, tokenId } = asset;
    const magicKey = process.env.REACT_APP_MAGIC_KEY as string;
    const dbContract = (await Api.contract.getOneByContractId(
        contractId
    )) as ContractType;
    const { address, chainId, chainURL, chainAPIKey, abi } = dbContract;
    const node = getMagicNetworks(
        chainId,
        chainURL,
        chainAPIKey
    ) as CustomNodeConfiguration;
    const magic = new Magic(magicKey, { network: node });
    const provider = new BrowserProvider(magic.rpcProvider);
    const signer = await provider.getSigner();
    const contract = new Contract(address, abi as any, signer);
    const tx = await contract.getFunction('safeTransferFrom')(
        signer.getAddress(),
        toAddress,
        tokenId
    );
    return await tx.wait();
};

export const getChainHexId = (chainId: number) => {
    switch (chainId) {
        case 1:
            return '0x1';
        case 3:
            return '0x3';
        case 4:
            return '0x4';
        case 5:
            return '0x5';
        case 42:
            return '0x2a';
        case 56:
            return '0x38';
        case 97:
            return '0x61';
        case 128:
            return '0x80';
        case 137:
            return '0x89';
        case 250:
            return '0xfa';
        case 256:
            return '0x100';
        case 1337:
            return '0x539';
        case 43114:
            return '0xa86a';
        case 43113:
            return '0xa85d';
        case 80001:
            return '0x13881';
        case 11155111:
            return '0xa9a7';
        case 79377087078960:
            return '0x12a0f38bc';
        default:
            return '0x1';
    }
};

export const getMagicNetworks = (
    chainId: number,
    chainUrl: string,
    chainApiKey: string
) => {
    return { rpcUrl: `${chainUrl}${chainApiKey}`, chainId: chainId };
};

export const getGasPrice = async (chainId: number) => {
    let gasLimit = BigInt([1, 5].includes(chainId) ? 250000 : 50000);
    if (window.ethereum.chainId !== getChainHexId(chainId)) {
        await switchNetwork(chainId);
    }
    const provider = new BrowserProvider(window.ethereum, chainId);
    const feeData = await provider.getFeeData();
    console.log(formatUnits(gasLimit, 'ether'));
    return formatUnits((feeData.gasPrice as bigint) * gasLimit, 'ether');
};

export const getChainNetwork = (chainId: number) => {
    switch (chainId) {
        case 1:
            return 'Ethereum';
        case 5:
            return 'Ethereum Goerli';
        case 137:
            return 'Polygon';
        case 80001:
            return 'Polygon Mumbai';
        case 11155111:
            return 'Ethereum Sepolia';
    }
};

export const getWalletBalance = async (
    isMagic: boolean,
    walletAddress: string,
    chainId: number
) => {
    if (isMagic) {
        return 0;
    }
    if (window.ethereum.chainId !== getChainHexId(chainId)) {
        await switchNetwork(chainId);
    }
    let provider = new BrowserProvider(window.ethereum);
    let balance = await provider.getBalance(getAddress(walletAddress));
    return formatUnits(balance, 'ether');
};

export const checkChainNetwork = async (chainId: number) => {
    if (window.ethereum.chainId !== getChainHexId(chainId)) {
        await addChainNetwork(chainId);
        await switchNetwork(chainId);
    }
};

export const addChainNetwork = async (chainId: number) => {
    if (window.ethereum.chainId !== getChainHexId(chainId)) {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [getChainNetworkParams(chainId)],
        });
    }
};

export const switchNetwork = async (chainId: number) => {
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: getChainHexId(chainId) }],
    });
};

export const getUnitName = (chainId: number) => {
    switch (chainId) {
        case 1:
            return 'ETH';
        case 5:
            return 'ETH';
        case 137:
            return 'MATIC';
        case 80001:
            return 'MATIC';
        case 11155111:
            return 'ETH';
    }
};

export const getChainNetworkParams = (chainId: number) => {
    switch (chainId) {
        case 5:
            return {
                chainId: getChainHexId(chainId),
                chainName: getChainNetwork(chainId),
                nativeCurrency: {
                    name: getUnitName(chainId),
                    symbol: getUnitName(chainId),
                    decimals: 18,
                },
                rpcUrls: ['https://ethereum-goerli.publicnode.com'],
                blockExplorerUrls: ['https://goerli.etherscan.io/'],
            };
        case 137:
            return {
                chainId: getChainHexId(chainId),
                chainName: getChainNetwork(chainId),
                nativeCurrency: {
                    name: getUnitName(chainId),
                    symbol: getUnitName(chainId),
                    decimals: 18,
                },
                rpcUrls: ['https://polygon.llamarpc.com'],
                blockExplorerUrls: ['https://polygonscan.com/'],
            };
        case 80001:
            return {
                chainId: getChainHexId(chainId),
                chainName: getChainNetwork(chainId),
                nativeCurrency: {
                    name: getUnitName(chainId),
                    symbol: getUnitName(chainId),
                    decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            };
        case 11155111:
            return {
                chainId: getChainHexId(chainId),
                chainName: getChainNetwork(chainId),
                nativeCurrency: {
                    name: getUnitName(chainId),
                    symbol: getUnitName(chainId),
                    decimals: 18,
                },
                rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            };
        default:
            return {
                chainId: getChainHexId(chainId),
                chainName: getChainNetwork(chainId),
                nativeCurrency: {
                    name: getUnitName(chainId),
                    symbol: getUnitName(chainId),
                    decimals: 18,
                },
                rpcUrls: ['https://ethereum.publicnode.com'],
                blockExplorerUrls: ['https://etherscan.io/'],
            };
    }
};
