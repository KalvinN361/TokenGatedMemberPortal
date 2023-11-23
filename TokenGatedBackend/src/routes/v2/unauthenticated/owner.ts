import { NextFunction, Request, Response, Router } from 'express';
import { OwnerEntity } from '../../../entity';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { getOne } from '../../../scripts/manager';
import { OwnerRequest } from '../../../definitions';

export const unauthenticatedOwnerRoute = Router();

unauthenticatedOwnerRoute.post(
    '/Owner/GetByOwnerIdClaimedPrizes',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId }: OwnerRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const owner = (await getOne(OwnerEntity, ownerId)) as OwnerEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(owner);
        } catch (error: any) {
            next(error.message);
        }
    }
);
