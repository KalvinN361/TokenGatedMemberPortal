import { Request, Response, NextFunction, Router } from 'express';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import { ShopEntity } from '../../../entity';
import {
    getShopsByType,
    getShopsByWalletAddressAndType,
    getShops,
    getOne,
    getShopsByWalletAddress,
} from '../../../scripts/manager';

export const shopsRoute = Router();

shopsRoute.get(
    '/Shops/GetAll',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let shops = (await getShops()) as Array<ShopEntity>;
            res.status(200).json({
                status: 'success',
                code: 200,
                count: shops.length,
                shops: shops,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

shopsRoute.get(
    '/Shops/GetOne/:id',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const listing = (await getOne(ShopEntity, id)) as ShopEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                listing: listing,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

shopsRoute.get(
    '/Shops/GetAll/Type/:type',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.params;
        if (!dataSource.isInitialized) await dataSource.initialize();
        try {
            const shops = await getShopsByType(type);
            res.status(200).json({
                status: 'success',
                code: 200,
                count: shops.length,
                shops: shops,
            });
        } catch (error: any) {
            next(error.message);
        }
        if (dataSource.isInitialized) await dataSource.destroy();
        try {
        } catch (error: any) {
            next(error.message);
        }
    }
);

shopsRoute.get(
    '/Shops/GetAll/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { walletAddress } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const shops = await getShopsByWalletAddress(walletAddress);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: shops.length,
                shops: shops,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

shopsRoute.get(
    '/Shops/GetAll/WalletAddress/:walletAddress/Type/:type',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { walletAddress, type } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const shops = await getShopsByWalletAddressAndType(
                walletAddress,
                type
            );
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: shops.length,
                shops: shops,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
