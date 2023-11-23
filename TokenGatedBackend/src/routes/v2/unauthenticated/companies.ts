import { NextFunction, Request, Response, Router } from 'express';
import {
    dataSource,
    setPVDataSource,
} from '../../../scripts/utilities/database';
import { CompanyEntity } from '../../../entity';
import { getAll } from '../../../scripts/manager';
import { getCompanyData } from '../../../scripts/manager';

export const companyRoute = Router();

companyRoute.get(
    '/Company/GetAll',
    setPVDataSource,
    async (_: Request, res: Response, next: NextFunction) => {
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const companies = (await getAll(
                CompanyEntity
            )) as Array<CompanyEntity>;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                count: companies.length,
                companies: companies,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);

companyRoute.get(
    '/Company/GetOne/:domain',
    setPVDataSource,
    async (req: Request, res: Response, next: NextFunction) => {
        const { domain } = req.params;
        try {
            if (!dataSource.isInitialized) await dataSource.initialize();
            const company = (await getCompanyData(domain)) as CompanyEntity;
            if (dataSource.isInitialized) await dataSource.destroy();
            res.status(200).json({
                status: 'success',
                code: 200,
                company: company,
            });
        } catch (error: any) {
            next(error.message);
        }
    }
);
