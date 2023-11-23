import { NextFunction, Request, Response, Router } from 'express';
import { AssetEntity } from '../../../entity';
import { checkIfSpooferRole } from '../../../scripts/utilities';
import { getAssetsByWalletAddress } from '../../../scripts/manager';
import dotenv from 'dotenv';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

dotenv.config();

export const assetRouteUA = Router();
assetRouteUA.post(
    '/UAAsset/GetByWalletAddress',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        let walletAddress = req.body.walletAddress;
        if (!walletAddress) res.status(400).send('No wallet address provided');
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            if (await checkIfSpooferRole(walletAddress)) {
                walletAddress = '0x2611B286994571b4D5292ACFF5619da8074b5c54'; //gavin
            }
            const assets = (await getAssetsByWalletAddress(
                walletAddress
            )) as Array<AssetEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json(assets);
        } catch (error: any) {
            next(error.message);
        }
    }
);
