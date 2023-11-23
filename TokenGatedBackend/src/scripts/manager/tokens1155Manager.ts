import { dataSource } from '../utilities/database';
import { OwnerEntity, Token1155Entity } from '../../entity';
import { getOne } from './baseManager';
import { getOwnerByWalletAddress } from './ownerManager';

export const getOneById = async (id: string) => {
    return await dataSource
        .createQueryBuilder(Token1155Entity, 't')
        .where('t.id = (:id)', {
            id: id,
        })
        .getOne();
};

export const getTokens1155ByContractAndToken = async (
    contractId: string,
    tokenId: string
) => {
    return await dataSource
        .createQueryBuilder(Token1155Entity, 't')
        .where(
            't.archived=:archived AND t.contractId=:contractId AND t.tokenId=:tokenId',
            {
                archived: false,
                contractId: contractId,
                tokenId: tokenId,
            }
        )
        .getMany();
};

export const getTokens1155ByWalletAddress = async (walletAddress: string) => {
    const owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return await dataSource
        .createQueryBuilder(Token1155Entity, 't')
        .leftJoinAndSelect('t.assets1155', 'a')
        .where('t.archived=:archived AND a.ownerId=:ownerId', {
            archived: false,
            ownerId: owner.id,
        })
        .getMany();
};

export const addTokens1155 = async (data: any) => {
    return await dataSource
        .createQueryBuilder(Token1155Entity, 'a')
        .insert()
        .into(Token1155Entity)
        .values(data)
        .orIgnore()
        /*.orUpdate([''], ['token1155Id', 'contractId'], {
            skipUpdateIfNoValuesChanged: true,
        })*/
        .execute()
        .then(async (result) => {
            let resultData: Array<any> = [];
            for (let res of result.identifiers) {
                if (res === undefined) continue;
                let data = await getOne(Token1155Entity, res.id);
                resultData.push(data);
            }
            return resultData;
        })
        .catch((err: any) => {
            return { error: err, message: 'Error in addAsset1155' };
        });
};
