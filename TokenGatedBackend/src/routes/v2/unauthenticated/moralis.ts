import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { NextFunction, Request, Response, Router } from 'express';
import { getOne } from '../../../scripts/manager';
import { ContractEntity } from '../../../entity';
import { setDataSource } from '../../../scripts/utilities/database';

export const moralisRoute = Router();

const api_key = process.env.MORALIS_API_KEY;

const startMoralis = async () => {
    await Moralis.start({
        apiKey: api_key,
    });
};

const getChain = (chainId: number) => {
    switch (chainId) {
        case 1:
            return EvmChain.ETHEREUM;
        case 5:
            return EvmChain.GOERLI;
        case 137:
            return EvmChain.POLYGON;
        case 80001:
            return EvmChain.MUMBAI;
    }
};
moralisRoute.post(
    '/Moralis/GetNftByWallet',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getWalletNFTs({ address, chain })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftByContract',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getContractNFTs({ address, chain })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftTransfersByWallet',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getWalletNFTTransfers({ address, chain })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftTransfersByContract',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getNFTContractTransfers({ address, chain })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftTransfersByTokenId',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId, tokenId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getNFTTransfers({ address, chain, tokenId })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftCollectionsByWallet',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getWalletNFTCollections({ address, chain })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftCollectionsMetadata',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getNFTContractMetadata({ address, chain })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.get(
    '/Moralis/GetNftOwners/ContractId/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        const contract = (await getOne(
            ContractEntity,
            contractId
        )) as ContractEntity;
        const { address, chainId } = contract;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getNFTOwners({ address, chain })
            .then((response) => {
                res.status(200).json({
                    status: 'success',
                    code: 200,
                    data: response?.result.length,
                });
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftOwnersByTokenId',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId, tokenId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getNFTTokenIdOwners({ address, chain, tokenId })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);

moralisRoute.post(
    '/Moralis/GetNftMetadata',
    async (req: Request, res: Response, next: NextFunction) => {
        const { address, chainId, tokenId } = req.body;
        const chain = getChain(chainId);
        await startMoralis();

        await Moralis.EvmApi.nft
            .getNFTMetadata({ address, chain, tokenId })
            .then((response) => {
                res.status(200).json(response?.result);
            })
            .catch((error: any) => {
                next(error.message);
            });
    }
);
