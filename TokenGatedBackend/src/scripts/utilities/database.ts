import { DataSource } from 'typeorm';
import { checkOriginFrom } from './util';
import { getDataSource } from '../../app-data-source';

export let dataSource: DataSource;

export const setDataSource = async (req: any, res: any, next: any) => {
    try {
        const origin = req.header('Origin');
        const db = checkOriginFrom(origin);
        if (db) dataSource = await getDataSource(db);
        next();
    } catch (error: any) {
        next(error.message);
    }
};

export const setPVDataSource = async (req: any, res: any, next: any) => {
    try {
        const db = 'ProjectVenkman';
        if (db) dataSource = await getDataSource(db);
        next();
    } catch (error: any) {
        next(error.message);
    }
};

export const setForeverDataSource = async (req: any, res: any, next: any) => {
    try {
        const db = 'TheForever';
        if (db) dataSource = await getDataSource(db);
        console.log(db);
        next();
    } catch (error: any) {
        next(error.message);
    }
};
