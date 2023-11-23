import { NextFunction, Request, Response, Router } from 'express';
import { Asset1155Entity } from '../../../entity';
import { checkIfSpooferRole } from '../../../scripts/utilities';

import { getAll } from '../../../scripts/manager';
import dotenv from 'dotenv';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import {
    getAssets1155ByWalletAddress,
    getAssets1155ByWalletAddressAndToken,
    getOneByToken,
} from '../../../scripts/manager';

dotenv.config();

export const asset1155Route = Router();

/* GET all assets. */
asset1155Route.get(
    '/Asset1155/GetAll',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let assets: Array<any> = (await getAll(
                Asset1155Entity
            )) as Array<any>;
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

asset1155Route.get(
    '/Asset1155/GetAll/Token/:tokenId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { tokenId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const assets = (await getOneByToken(
                tokenId
            )) as Array<Asset1155Entity>;
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

asset1155Route.get(
    '/Asset1155/GetAll/WalletAddress/:walletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
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
            let assets: Array<Asset1155Entity> =
                (await getAssets1155ByWalletAddress(
                    walletAddress
                )) as Array<Asset1155Entity>;
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

asset1155Route.get(
    '/Asset1155/GetAll/WalletAddress/:walletAddress/Token/:tokenId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { tokenId } = req.params;
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
            let asset: Asset1155Entity =
                (await getAssets1155ByWalletAddressAndToken(
                    walletAddress,
                    tokenId
                )) as Asset1155Entity;
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
