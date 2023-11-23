import { dataSource } from '../utilities/database';
import { CompanyEntity } from '../../entity';

export const getCompanyData = async (domain: string) => {
    return await dataSource
        .createQueryBuilder(CompanyEntity, 'c')
        .where('c.archived=:archived AND c.domain LIKE :domain', {
            archived: false,
            domain: `%${domain}%`,
        })
        .getOne();
};
