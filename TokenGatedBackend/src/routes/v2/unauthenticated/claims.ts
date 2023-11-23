import { NextFunction, Request, Response, Router } from 'express';
import { ClaimEntity } from '../../../entity';
import { getUpdateData } from '../../../scripts/utilities';
import {
    getClaimsByType,
    getCoinsByName,
    getUnclaimedCoinsByName,
    update,
    updateCoinInventory,
} from '../../../scripts/manager';
import { ClaimEntityWithAssetName } from '../../../definitions';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

export const claimUnauthenticatedRoute = Router();

claimUnauthenticatedRoute.get(
    '/Claim/GetAll/Type/:type/Inventory',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const claims = (await getClaimsByType(
                type
            )) as Array<ClaimEntityWithAssetName>;
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
claimUnauthenticatedRoute.get(
    '/Claim/GetAll/Coins/Name/:name',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const claims = await getCoinsByName(name);
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

claimUnauthenticatedRoute.get(
    '/Claim/GetAll/Name/:name/UnclaimedCoins',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.params;
        let treasury = Boolean(req.query.treasury);
        let contractId = req.query.contractId as string;

        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const unclaims = await getUnclaimedCoinsByName(
                name,
                treasury,
                contractId
            );
            /*const assetIds = unclaims.map((unclaim) => unclaim.assetId);
            const assets = (await getAssetsByIdsForCoins(
                assetIds
            )) as Array<AssetEntity>;*/
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                count: unclaims.length,
                unclaims: unclaims,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimUnauthenticatedRoute.patch(
    '/Claim/UpdateCoinClaimList',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { data } = req.body;
        const { createdBy: omitted, ...updateData } = data;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await update(ClaimEntity, updateData);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

claimUnauthenticatedRoute.patch(
    '/Claim/UpdateInventory',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { claim } = req.body;
        console.log({ claim });
        const { createdBy, updatedBy, ...updateData } = await getUpdateData(
            req.decodedAddress
        );
        try {
            await dataSource.initialize();
            console.log({ ...claim, ...updateData });
            const result = await updateCoinInventory({
                ...claim,
                ...updateData,
            });
            await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
