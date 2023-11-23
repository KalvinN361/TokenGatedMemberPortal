import axios from 'axios';
import {
    HMAddAccessListAddresses,
    HMAuthoriseBuy,
    HMCall,
    HMCreateDraftContract,
    HMDeployContract,
    HMGetContractHostedMetadata,
    HMGetContractInfo,
    HMGetOwnedTokens,
    HMGetTokenAllocation,
    HMGetTokenHostedMetadata,
    HMGetTokenInformation,
    HMGetTokensBody,
    HMGetTransferStatus,
    HMMint,
    HMMintStatus,
    HMSetTokenHostedMetadata,
    HMTransferToken,
    HMUpdateBuyOnNetwork,
    HMUpdateDates,
    HMUpdateErc721Contract,
    HMUpdateMetadataUrls,
    HMUpdateNameAndSymbolRequest,
    HMUploadContractMedia,
    HMUploadTokenMediaAnimation,
    HMUploadTokenMediaImage,
    HMVerifyTokenBurn,
} from '../../../definitions';
import { Request, Response, Router } from 'express';

export const hyperMintRoute = Router();

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
        headers: headers,
        data: config.data ? config.data : '',
    }).then(async (res) => {
        return await res.data;
    });
};

hyperMintRoute.post(
    '/HyperMint/GetContractInfo',
    async (req: Request, res: Response) => {
        const { contractId }: HMGetContractInfo = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/CreateDraftContract',
    async (req: Request, res: Response) => {
        const { body }: HMCreateDraftContract = req.body;
        res.json(
            await call({
                httpsMethod: 'put',
                endpoint: `${version}/nft-contract`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    'HyperMint/DeployContract',
    async (req: Request, res: Response) => {
        const { contractId }: HMDeployContract = req.body;
        res.json(
            await call({
                httpsMethod: 'patch',
                endpoint: `${version}/nft-contract/deploy/${contractId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/GetTokens',
    async (req: Request, res: Response) => {
        const { contractId }: HMGetTokensBody = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}/tokens`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/GetTokenInformation',
    async (req: Request, res: Response) => {
        const { contractId, tokenId }: HMGetTokenInformation = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/AuthoriseBuy',
    async (req: Request, res: Response) => {
        const { contractId, tokenId, query }: HMAuthoriseBuy = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/authorise-buy?address=${query.walletAddress}&amount=${query.amount}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/MintStatus',
    async (req: Request, res: Response) => {
        const { contractId, mintId }: HMMintStatus = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}/mint/${mintId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/GetOwnedTokens',
    async (req: Request, res: Response) => {
        const { contractId, walletAddress }: HMGetOwnedTokens = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}/tokens/owners/${walletAddress}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/TransferToken',
    async (req: Request, res: Response) => {
        const { contractId, body }: HMTransferToken = req.body;
        res.json(
            await call({
                httpsMethod: 'put',
                endpoint: `${version}/nft-contract/${contractId}/transfer`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/GetTransferStatus',
    async (req: Request, res: Response) => {
        const { contractId, transferId }: HMGetTransferStatus = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}/transfer/${transferId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/UpdateContractNameAndSymbol',
    async (req: Request, res: Response) => {
        const { contractId, body }: HMUpdateNameAndSymbolRequest = req.body;
        res.json(
            await call({
                httpsMethod: 'patch',
                endpoint: `${version}/nft-contract/${contractId}/update-name-and-symbol`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/UpdateContractERC721',
    async (req: Request, res: Response) => {
        const { contractId, body }: HMUpdateErc721Contract = req.body;
        res.json(
            await call({
                httpsMethod: 'patch',
                endpoint: `${version}/nft-contract/${contractId}`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/UpdateContractMetadataUrls',
    async (req: Request, res: Response) => {
        const { contractId, body }: HMUpdateMetadataUrls = req.body;
        res.json(
            await call({
                httpsMethod: 'patch',
                endpoint: `${version}/nft-contract/${contractId}/update-metadata-urls`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/UpdateContractBuyOnNetwork',
    async (req: Request, res: Response) => {
        const { contractId, body }: HMUpdateBuyOnNetwork = req.body;
        res.json(
            await call({
                httpsMethod: 'patch',
                endpoint: `${version}/nft-contract/${contractId}/update-buy-on-network`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/UpdateContractDates',
    async (req: Request, res: Response) => {
        const { contractId, body }: HMUpdateDates = req.body;
        res.json(
            await call({
                httpsMethod: 'patch',
                endpoint: `${version}/nft-contract/${contractId}/update-dates`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/AddAccessListAddresses',
    async (req: Request, res: Response) => {
        const { accessListId, body }: HMAddAccessListAddresses = req.body;
        res.json(
            await call({
                httpsMethod: 'put',
                endpoint: `${version}/access-list/${accessListId}/addresses`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/GetContractHostedMetadata',
    async (req: Request, res: Response) => {
        const { contractId }: HMGetContractHostedMetadata = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `metadata/${contractId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/GetTokenHostedMetadata',
    async (req: Request, res: Response) => {
        const { contractId, tokenId }: HMGetTokenHostedMetadata = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `metadata/${contractId}/${tokenId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/SetTokenHostedMetadata',
    async (req: Request, res: Response) => {
        const { contractId, tokenId, body }: HMSetTokenHostedMetadata =
            req.body;
        res.json(
            await call({
                httpsMethod: 'patch',
                endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata`,
                data: body,
            })
        );
    }
);
hyperMintRoute.post(
    '/HyperMint/UploadContractMetadataMedia',
    async (req: Request, res: Response) => {
        const { contractId, body }: HMUploadContractMedia = req.body;
        res.json(
            await call({
                httpsMethod: 'put',
                endpoint: `${version}/nft-contract/${contractId}/metadata-image`,
                data: body,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/UploadTokenMetadataImage',
    async (req: Request, res: Response) => {
        const { contractId, tokenId, path }: HMUploadTokenMediaImage = req.body;
        res.json(
            await call({
                httpsMethod: 'put',
                endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata-image`,
                data: path,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/UploadTokenMetadataAnimation',
    async (req: Request, res: Response) => {
        const { contractId, tokenId, path }: HMUploadTokenMediaAnimation =
            req.body;
        res.json(
            await call({
                httpsMethod: 'put',
                endpoint: `${version}/nft-contract/${contractId}/token/${tokenId}/metadata-animation`,
                data: path,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/GetTokenAllocation',
    async (req: Request, res: Response) => {
        const { contractId }: HMGetTokenAllocation = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/${contractId}`,
            })
        );
    }
);

hyperMintRoute.post(
    '/HyperMint/VerifyTokenBurn',
    async (req: Request, res: Response) => {
        const { contractId, txHash }: HMVerifyTokenBurn = req.body;
        res.json(
            await call({
                httpsMethod: 'get',
                endpoint: `${version}/nft-contract/verify-burn/${contractId}/${txHash}`,
            })
        );
    }
);
