import { NextFunction, Request, Response, Router } from 'express';
import { AssetEntity, AttributeEntity, OwnerEntity } from '../../../entity';
import {
    checkIfSpooferRole,
    delay,
    getUpdateData,
    resizeAssetImageSmall,
    HMsetTokenHostedMetadata,
    HMgetContractInfo,
    HMgetTokenHostedMetadata,
} from '../../../scripts/utilities';
import * as fs from 'fs';
import sharp from 'sharp';
import {
    UpdateAssetRequest,
    AddAssetRequest,
    ArchiveAssetRequest,
    DeleteAssetRequest,
    HMContractResponse,
} from '../../../definitions';
import {
    add,
    archive,
    getAll,
    getAllByAssetId,
    getAssetsByWalletNoBurnables,
    getAllWithData,
    getAssetOneByContractAndTokenId,
    getAssetsByWalletWithBurnables,
    getAssetsByContract,
    getAssetsByContracts,
    getAssetsByIds,
    getAssetsByStatusAndContract,
    getAssetsByWalletAddress,
    getAssetsByWalletAndContract,
    getOne,
    getOwnerByWalletAddress,
    remove,
    update,
    updateAssets,
    upgradeBillGlasses,
} from '../../../scripts/manager';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

dotenv.config();

export const assetRoute = Router();

/* GET all assets. */
assetRoute.get(
    '/Asset/GetAll/',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { withAttributes } = req.query;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let assets: Array<any> = [];
            if (typeof withAttributes === 'undefined')
                assets = (await getAll(AssetEntity)) as Array<any>;
            else if (withAttributes === 'true')
                assets = (await getAllWithData()) as Array<any>;
            else assets = [];
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: assets.length,
                assets: assets,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetAll/:ids',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { ids } = req.params;
        const assetList = ids?.toString().split(',') as Array<string>;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const assets = (await getAssetsByIds(
                assetList
            )) as Array<AssetEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: assets.length,
                assets: assets,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetAll/Contract/:contractIds',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractIds } = req.params;
        const contractList = contractIds
            ?.toString()
            .split(',') as Array<string>;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const assets = (await getAssetsByContracts(
                contractList
            )) as Array<AssetEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: assets.length,
                assets: assets,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetCount/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const count = await dataSource
                .createQueryBuilder(AssetEntity, 'a')
                .where(
                    'a.archived = (:archived) AND a.contractId = (:contractId)',
                    {
                        archived: false,
                        contractId: contractId,
                    }
                )
                .getCount();
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: count,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetAll/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { includeBurnables } = req.query;
        let walletAddress = (req.decodedAddress ||
            req.params.walletAddress) as string;
        if (!walletAddress)
            res.status(400).json({
                status: 'failed',
                code: '400',
                message: 'No wallet address provided',
            });
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            if (await checkIfSpooferRole(walletAddress)) {
                walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
            }
            let assets: Array<AssetEntity> = [];
            if (
                typeof includeBurnables === 'undefined' ||
                includeBurnables === 'false'
            ) {
                assets = (await getAssetsByWalletNoBurnables(
                    walletAddress
                )) as Array<AssetEntity>;
            } else {
                assets = (await getAssetsByWalletAddress(
                    walletAddress
                )) as Array<AssetEntity>;
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: assets.length,
                assets: assets,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetAll/WalletAddress/:walletAddress/Burnables',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        let walletAddress = (req.decodedAddress ||
            req.params.walletAddress) as string;
        if (!walletAddress) res.status(400).send('No wallet address provided');
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            if (await checkIfSpooferRole(walletAddress)) {
                walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
            }
            const assets = await getAssetsByWalletWithBurnables(walletAddress);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: assets.length,
                assets: assets,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetAll/WalletAddress/:walletAddress/Contracts/:contractIds',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractIds } = req.params;
        const contractList = contractIds
            ?.toString()
            .split(',') as Array<string>;
        let walletAddress = (req.decodedAddress ||
            req.params.walletAddress) as string;
        if (!walletAddress) res.status(400).send('No wallet address provided');
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            if (await checkIfSpooferRole(walletAddress)) {
                walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
            }
            const assets = (await getAssetsByWalletAndContract(
                walletAddress,
                contractList
            )) as Array<AssetEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: assets.length,
                assets: assets,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
assetRoute.get(
    '/Asset/GetAll/Contract/:contractId/Sale',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const assets = await getAssetsByStatusAndContract(
                'For Sale',
                contractId
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: assets.length,
                assets: assets,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetOne/:assetId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const asset = (await getOne(AssetEntity, assetId)) as AssetEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                asset: asset,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.get(
    '/Asset/GetOne/Contract/:contractId/TokenId/:tokenId',
    setDataSource,
    async (req, res, next) => {
        const { contractId, tokenId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const asset = await getAssetOneByContractAndTokenId(
                contractId,
                tokenId
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                asset: asset,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.post(
    '/Asset/Add',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { asset }: AddAssetRequest = req.body;
        const { ...createData } = await getUpdateData(
            req.headers['walletaddress' || req.body.walletAddress]
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = (
                await add(AssetEntity, {
                    ...asset,
                    ...createData,
                })
            )[0] as AssetEntity;
            let newAssetId = result.id;

            if (asset.attributes) {
                const attributes = asset.attributes;
                for (const attr of attributes) {
                    attr.assetId = newAssetId;
                }
                await add(AttributeEntity, attributes);
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(201).json({
                status: 'success',
                code: 201,
                asset: result,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.patch(
    '/Asset/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { asset }: UpdateAssetRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const { attributes: omitted, ...rest } = asset;
            const result = await update(AssetEntity, {
                ...rest,
                ...updateData,
            });

            if (asset.attributes) {
                for (let a of asset.attributes) {
                    await update(AttributeEntity, { ...a, ...updateData });
                }
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({
                status: 'success',
                code: 204,
                result: result,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.patch(
    '/Asset/Update/:id/Owner/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { id, walletAddress } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            const asset = (await getOne(AssetEntity, id)) as AssetEntity;
            const { attributes, ...restOnly } = asset;
            restOnly.ownerId = owner.id;
            restOnly.updatedDate = new Date();
            const result = await updateAssets(restOnly);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({
                status: 'success',
                code: 204,
                result: result,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.patch(
    '/Asset/ResizeImageSmall/Contract/:contractId/Token/:tokenId/Bucket/:bucketName',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, tokenId, bucketName } = req.params;
        let assets: Array<AssetEntity> = [];
        const tempPath = `${process.cwd()}/temp`;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
            assets = (await getAssetsByContract(
                contractId
            )) as Array<AssetEntity>;
            if (assets.length) {
                let asset = assets.find(
                    (a) => a.tokenId === tokenId
                ) as AssetEntity;
                //for (const asset of assets) {
                await delay(300);
                await resizeAssetImageSmall(asset, bucketName);
                //}
            }
            //fs.rmdirSync(tempPath);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({});
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.post(
    '/Asset/UpgradeBill3DFrame/:assetId',
    setDataSource,
    async (req: Request, res: Response) => {
        const { assetId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            await upgradeBillGlasses(assetId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({ message: 'success' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
);

assetRoute.patch(
    '/Asset/Archive',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetId }: ArchiveAssetRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await archive(AssetEntity, assetId);
            const attributes = (await getAllByAssetId(
                AttributeEntity,
                assetId
            )) as AttributeEntity[];

            for (const attr of attributes) {
                await archive(AttributeEntity, attr.id);
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({ result });
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.delete(
    '/Asset/Delete',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetId }: DeleteAssetRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await remove(AssetEntity, assetId);
            const attributes = (await getAllByAssetId(
                AttributeEntity,
                assetId,
                true
            )) as AttributeEntity[];

            for (const attr of attributes) {
                await remove(AttributeEntity, attr.id);
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

assetRoute.post(
    '/Asset/UpdateAllAttributes/HyperMint/Contract/:contractId',
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await HMgetContractInfo(
                contractId
            )) as HMContractResponse;
            const count = contract.tokenCount;
            const metadata = await HMgetTokenHostedMetadata(contractId, '1');
            console.log(count, metadata);

            for (let i = 2; i <= count; i++) {
                const tokenId = i.toString();
                await HMsetTokenHostedMetadata(contractId, tokenId, metadata);
            }
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json({
                status: 'success',
                code: 204,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
