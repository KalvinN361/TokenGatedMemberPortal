import { NextFunction, Request, Response, Router } from 'express';
import { OwnerEntity } from '../../../entity';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { getUpdateData } from '../../../scripts/utilities';
import { OwnerDataEntity } from '../../../entity';
import {
    add,
    archive,
    getAll,
    getOne,
    getOwnerByEmail,
    getOwnerByWalletAddress,
    remove,
    update,
} from '../../../scripts/manager';
import {
    AddOwnerRequest,
    ArchiveOwnerRequest,
    DeleteOwnerRequest,
    OwnerByEmailRequest,
    OwnerByWalletAddressRequest,
    OwnerRequest,
    UpdateOwnerRequest,
} from '../../../definitions';

export const ownerRoute = Router();

/* GET users listing. */
ownerRoute.get(
    '/Owner/GetAll',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owners = (await getAll(OwnerEntity)) as Array<OwnerEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: owners.length,
                assets: owners,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

ownerRoute.get(
    '/Owner/GetOne/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { walletAddress } = req.params;

        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owner = (await getOwnerByWalletAddress(
                walletAddress
            )) as OwnerEntity;
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                assets: owner,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

ownerRoute.get(
    '/Owner/GetOne/Owner/:ownerId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owner = (await getOne(OwnerEntity, ownerId)) as OwnerEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                assets: owner,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
ownerRoute.get(
    '/Owner/GetAll/Email/:email',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owners = (await getOwnerByEmail(email)) as Array<OwnerEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: owners.length,
                assets: owners,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
ownerRoute.post(
    '/Owner/Add',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { owner }: AddOwnerRequest = req.body;
        const { ...createData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await add(OwnerEntity, { ...owner, ...createData });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

ownerRoute.patch(
    '/Owner/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { owner }: UpdateOwnerRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await update(OwnerEntity, {
                ...owner,
                ...updateData,
            });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
ownerRoute.patch(
    '/Owner/Archive',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId }: ArchiveOwnerRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await archive(OwnerEntity, ownerId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

ownerRoute.delete(
    '/Owner/Delete',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId }: DeleteOwnerRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await remove(OwnerEntity, ownerId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

ownerRoute.post(
    '/Owner/UpdateOwnerData',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const ownerData = await dataSource
                .getRepository(OwnerDataEntity)
                .findOne({ where: { email: req.body.email } });
            // Find the owner data to update
            if (!ownerData) {
                const OData = {
                    // Update the owner data fields
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber,
                    address1: req.body.address1,
                    address2: req.body.address2,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    postalCode: req.body.postalCode,
                    email: req.body.email,
                };

                await dataSource
                    .getRepository(OwnerEntity)
                    .createQueryBuilder('Owners')
                    .insert()
                    .into(OwnerEntity)
                    .values({ walletAddress: req.body.walletAddress })
                    .orUpdate(['walletAddress'], ['walletAddress'])
                    .execute()
                    .then(async (res) => {
                        let ownerData = res.generatedMaps[0];
                        await dataSource
                            .getRepository(OwnerDataEntity)
                            .createQueryBuilder('Owners')
                            .insert()
                            .into(OwnerDataEntity)
                            .values({ ...OData, ownerId: ownerData.id })
                            .orUpdate([...Object.keys(OData)], ['email'])
                            .execute();
                    });
                if (dataSource.isInitialized) await dataSource.destroy();

                res.status(200).json({
                    message: 'Owner data updated successfully',
                });
            } else {
                res.status(404).json({ message: 'Owner data not found' });
            }
        } catch (error: any) {
            console.log('An error occurred while updating owner data:', error);
            res.status(500).json({ message: 'Failed to update owner data' });
        }
    }
);
