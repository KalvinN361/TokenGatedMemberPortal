import { NextFunction, Request, Response, Router } from 'express';
import { Token1155Entity } from '../../../entity';
import { checkIfSpooferRole } from '../../../scripts/utilities';

import { getAll } from '../../../scripts/manager';
import dotenv from 'dotenv';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';
import {
    getTokens1155ByContractAndToken,
    getTokens1155ByWalletAddress,
    getOneById,
} from '../../../scripts/manager';

dotenv.config();

export const token1155Route = Router();

/* GET all assets. */
token1155Route.get(
    '/Token1155/GetAll',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let tokens: Array<any> = (await getAll(
                Token1155Entity
            )) as Array<any>;
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                count: tokens.length,
                tokens: tokens,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

token1155Route.get(
    '/Token1155/GetOne/Token/:id',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const token = (await getOneById(id)) as Token1155Entity;
            if (dataSource.isInitialized) await dataSource.destroy();

            res.status(200).json({
                status: 'success',
                code: 200,
                token: token,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

token1155Route.get(
    '/Token1155/GetAll/Contract/:contractId/Token/:tokenId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId, tokenId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let tokens: Array<Token1155Entity> =
                (await getTokens1155ByContractAndToken(
                    contractId,
                    tokenId
                )) as Array<Token1155Entity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: tokens.length,
                tokens: tokens,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

token1155Route.get(
    '/Token1155/GetAll/WalletAddress/:walletAddress',
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
            let tokens: Array<Token1155Entity> =
                (await getTokens1155ByWalletAddress(
                    walletAddress
                )) as Array<Token1155Entity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: tokens.length,
                tokens: tokens,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
