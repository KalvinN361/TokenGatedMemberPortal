import { DataSource, DataSourceOptions } from 'typeorm';
import * as e from './entity';

export const getDataSource = async (database: string) => {
    return new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        connectTimeoutMS: 0,
        maxQueryExecutionTime: 0,
        extra: {
            connectionTimeoutMillis: 0,
            query_timeout: 0,
            statement_timeout: 0,
            poolSize: 1000,
        },
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: database,
        entities: [
            e.AccessListEntity,
            e.AnnouncementEntity,
            e.AssetEntity,
            e.Asset1155Entity,
            e.AttributeEntity,
            e.OwnerEntity,
            e.ChiveBarsEntity,
            e.ClaimEntity,
            e.CollectEntity,
            e.CompanyEntity,
            e.ContractEntity,
            e.EventEntity,
            e.ShopEntity,
            e.MediaEntity,
            e.OwnerDataEntity,
            e.PrizeEntity,
            e.QueueEntity,
            e.RefreshTokenEntity,
            e.Token1155Entity,
        ],
        synchronize: false,
        logging: false,
    } as DataSourceOptions);
};
