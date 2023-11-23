import { NextFunction, Request, Response, Router } from 'express';
import { ContractEntity } from '../../../entity';
import {
    AddContractRequest,
    ArchiveContractRequest,
    ContractRequest,
    DeleteContractRequest,
    UpdateContractRequest,
} from '../../../definitions';
import { getUpdateData } from '../../../scripts/utilities';
import {
    add,
    archive,
    getAll,
    getAllWithAssets,
    getContractBurnable,
    getOne,
    getOneBySymbol,
    remove,
    update,
} from '../../../scripts/manager';
import { dataSource, setDataSource } from '../../../scripts/utilities/database';

export const contractRoute = Router();

/* GET all contracts */
contractRoute.get(
    '/Contract/GetAll',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { withAssets } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            let contracts: Array<any>;
            if (withAssets === 'false')
                contracts = (await getAll(
                    ContractEntity
                )) as Array<ContractEntity>;
            else contracts = (await getAllWithAssets()) as Array<any>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: contracts.length,
                assets: contracts,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

contractRoute.get(
    '/Contract/GetAll/Burnable',
    setDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contracts =
                (await getContractBurnable()) as Array<ContractEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: contracts.length,
                assets: contracts,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

contractRoute.get(
    '/Contract/GetOne/:contractId',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOne(
                ContractEntity,
                contractId
            )) as ContractEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                contract: contract,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

contractRoute.get(
    '/Contract/GetOneBySymbol/:symbol',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { symbol } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const contract = (await getOneBySymbol(symbol)) as ContractEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                contract: contract,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

contractRoute.post(
    '/Contract/Add',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contract }: AddContractRequest = req.body;
        const { ...createData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await add(ContractEntity, {
                ...contract,
                ...createData,
            });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(201).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
contractRoute.patch(
    '/Contract/Update',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contract }: UpdateContractRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await update(ContractEntity, {
                ...contract,
                ...updateData,
            });
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

contractRoute.patch(
    '/Contract/Archive',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId }: ArchiveContractRequest = req.body;
        const { createdBy: omitted, ...updateData } = await getUpdateData(
            req.headers['walletaddress']
        );
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await archive(ContractEntity, contractId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);

contractRoute.delete(
    '/Contract/Delete',
    setDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { contractId }: DeleteContractRequest = req.body;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const result = await remove(ContractEntity, contractId);
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(204).json(result);
        } catch (error: any) {
            next(error.message);
        }
    }
);
