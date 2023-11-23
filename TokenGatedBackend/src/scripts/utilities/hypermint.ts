import axios from 'axios';
import {
    HMAddAccessListAddresses,
    HMAuthoriseBuy,
    HMCall,
    HMContractTokensResponse,
    HMCreateDraftContract,
    HMDeployContract,
    HMGetContractHostedMetadata,
    HMGetOwnedTokens,
    HMGetTokenAllocation,
    HMGetTokenHostedMetadata,
    HMGetTokenInformation,
    HMGetTokensBody,
    HMGetTransferStatus,
    HMMetadata,
    HMMintResponse,
    HMMintStatus,
    HMMintStatusResponse,
    HMSetTokenHostedMetadata,
    HMTokenOwnershipResponse,
    HMTransferResponse,
    HMTransferStatusResponse,
    HMTransferToken,
    HMUpdateBuyOnNetwork,
    HMUpdateDates,
    HMUpdateErc721Contract,
    HMUpdateMetadataUrls,
    HMUpdateNameAndSymbolRequest,
    HMUploadContractMedia,
    HMUploadTokenMediaAnimation,
    HMVerifyTokenBurn,
} from '../../definitions';
import FormData from 'form-data';
import fs from 'fs';

require('dotenv').config();

const version = `v1`;
const baseURL = `https://api.hypermint.com`;
const access_key = process.env.HM_ACCESS_KEY!;
const secret_key = process.env.HM_ACCESS_KEY_SECRET!;
const headers = {
    HM_ACCESS_KEY: access_key,
    HM_ACCESS_KEY_SECRET: secret_key,
};

export const call = async (config: HMCall) => {
    return await axios({
        method: config.httpsMethod,
        url: `${baseURL}/${config.endpoint}`,
        headers: { ...headers, ...config.headers },
        data: config.data ? config.data : '',
    }).then(async (res) => {
        return await res.data;
    });
};

export const HMgetContractInfo = async (contractId: string) => {
    return await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}`,
    });
};

export const HMdeployContract = async (props: HMDeployContract) => {
    const { contractId } = props;
    return await call({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/deploy/${contractId}`,
    });
};

export const HMgetTokens = async (props: HMGetTokensBody) => {
    const { contractId } = props;
    return await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/tokens`,
    });
};

export const HMgetTokenInformation = async (props: HMGetTokenInformation) => {
    const { contractId, tokenId } = props;
    return await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}`,
    });
};

export const HMauthoriseBuy = async (props: HMAuthoriseBuy) => {
    const { contractId, tokenId, query } = props;
    return await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/authorise-buy?address=${query.walletAddress}&amount=${query.amount}`,
    });
};

export const HMmint = async (
    contractId: string,
    walletAddress: string,
    id: number,
    amount: number
) => {
    return (await call({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/mint`,
        data: {
            address: walletAddress,
            tokens: [
                {
                    id: id,
                    amount: amount,
                },
            ],
        },
    })) as HMMintResponse;
};

export const HMmintStatus = async (contractId: string, mintId: string) => {
    return (await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/mint/${mintId}`,
    })) as HMMintStatusResponse;
};

export const HMgetOwnedTokens = async (
    contractId: string,
    walletAddress: string
) => {
    return (await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/tokens/owners/${walletAddress}`,
    })) as HMTokenOwnershipResponse;
};

export const HMtransferToken = async (
    contractId: string,
    address: string,
    tokenId: string,
    amount?: number
) => {
    let data = new FormData();
    data.append('address', address);
    data.append('tokenId', tokenId);
    data.append('amount', amount?.toString() || '0');
    return (await call({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/transfer`,
        data: data,
    })) as HMTransferResponse;
};

export const HMgetTransferStatus = async (
    contractId: string,
    transferId: string
) => {
    return (await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}/transfer/${transferId}`,
    })) as HMTransferStatusResponse;
};

export const HMupdateContractNameAndSymbol = async (
    props: HMUpdateNameAndSymbolRequest
) => {
    const { contractId, body } = props;
    return await call({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-name-and-symbol`,
        data: body,
    });
};

export const HMupdateContractERC721 = async (props: HMUpdateErc721Contract) => {
    const { contractId, body }: HMUpdateErc721Contract = props;
    return await call({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}`,
        data: body,
    });
};

export const HMupdateContractMetadataUrls = async (
    props: HMUpdateMetadataUrls
) => {
    const { contractId, body } = props;
    return await call({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-metadata-urls`,
        data: body,
    });
};

export const HMupdateContractBuyOnNetwork = async (
    props: HMUpdateBuyOnNetwork
) => {
    const { contractId, body } = props;
    return await call({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-buy-on-network`,
        data: body,
    });
};

export const HMupdateContractDates = async (props: HMUpdateDates) => {
    const { contractId, body }: HMUpdateDates = props;
    return await call({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/update-dates`,
        data: body,
    });
};

export const HMaddAccessListAddresses = async (
    props: HMAddAccessListAddresses
) => {
    const { accessListId, body } = props;
    return await call({
        httpsMethod: 'put',
        endpoint: `${version}/access-list/${accessListId}/addresses`,
        data: body,
    });
};

export const HMgetContractHostedMetadata = async (
    props: HMGetContractHostedMetadata
) => {
    const { contractId } = props;
    return await call({
        httpsMethod: 'get',
        endpoint: `metadata/${contractId}`,
    });
};

export const HMgetTokenHostedMetadata = async (
    contractId: string,
    tokenId: string
) => {
    return (await call({
        httpsMethod: 'get',
        endpoint: `metadata/${contractId}/${tokenId}`,
    })) as HMMetadata;
};

export const HMsetTokenHostedMetadata = async (
    contractId: string,
    tokenId: string,
    body: HMMetadata
) => {
    return await call({
        httpsMethod: 'patch',
        endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata`,
        data: body,
    });
};

export const HMuploadContractMetadataMedia = async (
    props: HMUploadContractMedia
) => {
    const { contractId, body } = props;
    return await call({
        httpsMethod: 'put',
        endpoint: `${version}/nft-contract/${contractId}/metadata-image`,
        data: body,
    });
};

export const HMuploadTokenMetadataImage = async (
    contractId: string,
    tokenId: string,
    path: string
) => {
    let bodyFormData = new FormData();
    bodyFormData.append('media', fs.createReadStream(path));
    return await call({
        httpsMethod: 'put',
        endpoint: `${version}/contract/${contractId}/token/${tokenId}/metadata-image`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const HMuploadTokenMetadataAnimation = async (
    props: HMUploadTokenMediaAnimation
) => {
    const { contractId, tokenId, path } = props;
    let bodyFormData = new FormData();
    bodyFormData.append('media', fs.createReadStream(path));
    return await call({
        httpsMethod: 'put',
        endpoint: `${version}/contract/${contractId}/token/${tokenId}/metadata-animation`,
        data: bodyFormData,
    });
};

export const HMgetTokenAllocation = async (props: HMGetTokenAllocation) => {
    const { contractId } = props;
    return await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/${contractId}`,
    });
};

export const HMverifyTokenBurn = async (props: HMVerifyTokenBurn) => {
    const { contractId, txHash } = props;
    return await call({
        httpsMethod: 'get',
        endpoint: `${version}/nft-contract/verify-burn/${contractId}/${txHash}`,
    });
};
