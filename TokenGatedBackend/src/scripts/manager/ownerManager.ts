import { dataSource } from '../utilities/database';
import { OwnerEntity } from '../../entity';
import { getOne } from './baseManager';

export const getOwnerByWalletAddress = async (walletAddress: string) => {
    return await dataSource
        .createQueryBuilder(OwnerEntity, 'o')
        .insert()
        .into(OwnerEntity)
        .values({ walletAddress: walletAddress })
        .orUpdate(['walletAddress'], ['walletAddress'], {})
        .execute()
        .then(async (res) => {
            const id = res.identifiers[0].id;
            return await getOne(OwnerEntity, id);
        })
        .catch(async (err: any) => {
            return await dataSource
                .createQueryBuilder(OwnerEntity, 'o')
                .where(
                    'o.archived = (:archived) AND o.walletAddress = (:walletAddress)',
                    {
                        archived: false,
                        walletAddress: walletAddress,
                    }
                )
                .getOne()
                .then(async (res) => {
                    return res;
                });
        });
};

export const getOwnerByEmail = async (email: string) => {
    return await dataSource
        .createQueryBuilder(OwnerEntity, 'o')
        .where('o.archived = (:archived) AND o.email = (:email)', {
            archived: false,
            email: email,
        })
        .getMany()
        .catch((err: any) => {
            return { error: err, message: 'Cannot find owner' };
        });
};

export const addOwner = async (data: {
    walletAddress: string;
    email?: string;
}) => {
    let updateData: any = data;
    updateData.updatedDate = new Date();
    return await dataSource
        .createQueryBuilder(OwnerEntity, 'o')
        .insert()
        .into(OwnerEntity)
        .values(data)
        .orUpdate(
            ['walletAddress', 'email', 'updatedDate'],
            ['walletAddress'],
            {
                skipUpdateIfNoValuesChanged: true,
            }
        )
        .execute()
        .then(async (res) => {
            const id = res.identifiers[0].id;
            return await getOne(OwnerEntity, id);
        })
        .catch((err: any) => {
            return { error: err, message: 'Cannot add owner' };
        });
};
