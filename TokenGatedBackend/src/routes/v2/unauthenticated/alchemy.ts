import { NextFunction, Request, Response, Router } from 'express';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { AssetEntity, ContractEntity, OwnerEntity } from '../../../entity';
import {
    getOne,
    getAlchemy,
    getOwners,
    getNFTs,
    getNFTsForOwner,
    getOwnerByWalletAddress,
    getOneByContractAndTokenId,
    getAssetsByContractAndTokenId,
} from '../../../scripts/manager';
import { bmoeOwners } from '../../../scripts/data/bmoeOwners';
import { getAddress } from 'ethers';

export const alchemyRoute = Router();

alchemyRoute.get(
    '/Alchemy/GetOwner/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { chainAPIKey, address, chainId } = contract;
            const owners = await getOwners(chainAPIKey, chainId, address);
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                owners: owners,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
alchemyRoute.get(
    '/Alchemy/GetNFTs/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        const { limit } = req.query;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { chainAPIKey, address, chainId } = contract;
            const nfts = await getNFTs(
                chainAPIKey,
                chainId,
                address,
                parseInt(limit as string)
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                nfts: nfts,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

alchemyRoute.get(
    '/Alchemy/GetNFTsForOwner/Contract/:contractId/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, walletAddress } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { chainAPIKey, address, chainId } = contract;
            const ownedNfts = await getNFTsForOwner(
                chainAPIKey,
                chainId,
                [address],
                walletAddress
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: ownedNfts.length,
                OwnedNfts: ownedNfts,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

alchemyRoute.get(
    '/Alchemy/UpdateNFTOwners/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            const { chainAPIKey, address, chainId } = contract;
            const owners = await getOwners(chainAPIKey, chainId, address);

            for (let owner of bmoeOwners) {
                let checksumAddress = getAddress(owner);
                let dbOwner = (await getOwnerByWalletAddress(
                    checksumAddress
                )) as OwnerEntity;
                const { walletAddress } = dbOwner;
                let ownerAssets = await getNFTsForOwner(
                    chainAPIKey,
                    chainId,
                    [address],
                    walletAddress
                );
                let assetIds = ownerAssets.map(
                    (asset) => asset.tokenId as string
                );
                for (let assetId of assetIds) {
                    console.log(
                        `PV::${new Date().toISOString()}::Updating ${assetId} for ${
                            contract.description
                        } with owner ${dbOwner.id} (${walletAddress})`
                    );
                    await dataSource
                        .createQueryBuilder()
                        .insert()
                        .into(AssetEntity)
                        .values({
                            tokenId: assetId,
                            contractId: contract.id,
                            ownerId: dbOwner.id,
                            updatedDate: new Date(),
                        })
                        .orUpdate(
                            ['ownerId', 'updatedDate'],
                            ['tokenId', 'contractId'],
                            {
                                skipUpdateIfNoValuesChanged: true,
                            }
                        )
                        .execute()
                        .then(async (result) => {
                            return result;
                        })
                        .catch(async (err) => {
                            return err;
                        });
                }
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Owners updated',
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
