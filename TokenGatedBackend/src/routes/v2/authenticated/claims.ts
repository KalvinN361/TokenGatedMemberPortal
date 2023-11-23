import { NextFunction, Request, Response, Router } from 'express';
import { ClaimEntity } from '../../../entity';
import { getUpdateData } from '../../../scripts/utilities';
import {
    add,
    archive,
    getAll,
    getClaimsByAssetIds,
    getClaimsByType,
    getOne,
    remove,
    update,
} from '../../../scripts/manager';
import {
    AddClaimRequest,
    ArchiveClaimRequest,
    DeleteClaimRequest,
    UpdateClaimRequest,
} from '../../../definitions';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

export const claimRoute = Router();

/* GET users listing. */
claimRoute.get(
    '/Claim/GetAll',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const claims = (await getAll(ClaimEntity)) as Array<ClaimEntity>;
            res.status(200).json({
                status: 'success',
                code: 200,
                count: claims.length,
                claims: claims,
            });
            if (dataSource.isInitialized) await dataSource.destroy();
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimRoute.post(
    '/Claim/GetAllByAssetIds',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { assetIds } = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const claims = (await getClaimsByAssetIds(
                assetIds
            )) as Array<ClaimEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: claims.length,
                claims: claims,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimRoute.get(
    '/Claim/GetAll/Type/:type',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const claims = await getClaimsByType(type);
            res.status(200).json({
                status: 'success',
                code: 200,
                count: claims.length,
                claims: claims,
            });
            if (dataSource.isInitialized) await dataSource.destroy();
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimRoute.get(
    '/Claim/GetOne/:claimId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { claimId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const claim = (await getOne(ClaimEntity, claimId)) as ClaimEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                claims: claim,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimRoute.post(
    '/Claim/Add',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { claim }: AddClaimRequest = req.body;
        const { ...createData } = await getUpdateData(req.decodedAddress);
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await add(ClaimEntity, { ...claim, ...createData });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(201).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimRoute.patch(
    '/Claim/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { claim }: UpdateClaimRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.decodedAddress
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await update(ClaimEntity, {
                ...claim,
                ...updateData,
            });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimRoute.patch(
    '/Claim/Archive',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { claimId }: ArchiveClaimRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.decodedAddress
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await archive(ClaimEntity, claimId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimRoute.delete(
    '/Claim/Delete',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { claimId }: DeleteClaimRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await remove(ClaimEntity, claimId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
