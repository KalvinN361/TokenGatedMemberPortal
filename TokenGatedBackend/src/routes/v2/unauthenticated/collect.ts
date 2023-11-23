import { Request, Response, NextFunction, Router } from 'express';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { addOwner, getAll, getOne } from '../../../scripts/manager';
import {
    AssetEntity,
    CollectEntity,
    ContractEntity,
    OwnerEntity,
} from '../../../entity';
import {
    getOneByShortName,
    transferBMOE,
    transferTokenToOwners,
} from '../../../scripts/manager';

export const collectRoute = Router();

collectRoute.get(
    '/Collect/GetAll',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let collects = (await getAll(
                CollectEntity
            )) as Array<CollectEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: 0,
                collects: collects,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

collectRoute.get(
    '/Collect/GetCount/Contract/:contractId/Owner/:ownerId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, ownerId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const count = await dataSource
                .createQueryBuilder(AssetEntity, 'a')
                .where(
                    'a.archived = (:archived) AND a.contractId = (:contractId) AND a.ownerId = (:ownerId)',
                    {
                        archived: false,
                        contractId: contractId,
                        ownerId: ownerId,
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

collectRoute.get(
    '/Collect/GetOne/:id',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let collect = (await getOne(CollectEntity, id)) as CollectEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                collect: collect,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

collectRoute.get(
    '/Collect/GetOneByShortName/:shortName',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        let { shortName } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let collect = await getOneByShortName(shortName);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                collect: collect,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

collectRoute.post(
    '/Collect/TransferBMOE/DropContract/:contractId/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        let { contractId, walletAddress } = req.params;
        let { email } = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let ownerValues: any = { walletAddress: walletAddress };
            if (email) ownerValues['email'] = email;
            const toOwner = (await addOwner(ownerValues)) as OwnerEntity;
            let dropContract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;

            let transferredAsset = await transferBMOE(dropContract, toOwner);
            if (dataSource.isInitialized) await dataSource.destroy();
            if (!transferredAsset) {
                res.status(404).json({
                    status: 'success',
                    code: 404,
                    message:
                        'You have reached the maximum number of BMOE tokens allowed',
                });
            }
            res.status(200).json({
                status: 'success',
                code: 200,
                asset: transferredAsset,
                message: 'Transfer complete',
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

collectRoute.get(
    '/Collect/TransferTokenToOwners/DropContract/:dropContractId/Contract/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        let { dropContractId, contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const dropContract = (await getOne(
                ContractEntity,
                dropContractId
            )) as ContractEntity;
            const receipts = await transferTokenToOwners(
                dropContract,
                contractId
            );
            /*const key = getWalletKey(dropContract.symbol as string) as string;
            const provider = getAlchemyProvider(dropContract.chainId as number);
            const bmoeSigner = new Wallet(key, provider);
            const assets = (await getAssetsByContract(
                contractId
            )) as Array<AssetEntity>;
            const shuffledAssets = assets.sort(() => 0.5 - Math.random());
            const dropAssets = await getAssetsByContractAndLimit(
                dropContractId,
                shuffledAssets.length
            );
            const transferContract = new Contract(
                dropContract.address,
                dropContract.abi,
                bmoeSigner
            );

            const signedTransferContract = transferContract.connect(bmoeSigner);
            for (let i = 0; i < shuffledAssets.length; i++) {
                const toAddress = (
                    (await getOne(
                        OwnerEntity,
                        shuffledAssets[i].ownerId
                    )) as OwnerEntity
                ).walletAddress;
                console.log(
                    bmoeSigner.address,
                    toAddress,
                    dropAssets[i].tokenId
                );*/
            /*const tx = await signedTransferContract.getFunction(
                    'safeTransferFrom'
                )(bmoeSigner.address, toAddress, dropAssets[i].tokenId);
                await tx.wait();
            }*/
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Transfer complete',
                receipts: receipts,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
