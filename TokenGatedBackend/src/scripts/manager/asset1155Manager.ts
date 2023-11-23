import { dataSource } from '../utilities/database';
import {
    Asset1155Entity,
    ContractEntity,
    OwnerEntity,
    Token1155Entity,
} from '../../entity';
import { getOwnerByWalletAddress } from './ownerManager';

export const getOneByContractAndTokenId = async (
    contract: ContractEntity,
    tokenId: string,
    archived: boolean = false
) => {
    return await dataSource
        .createQueryBuilder(Token1155Entity, 't')
        .where(
            't.archived=:archived and t.contractId=:contractId and t.tokenId=:tokenId',
            {
                archived: archived,
                contractId: contract.id,
                tokenId: tokenId,
            }
        )
        .getOne()
        .then((result) => {
            return result;
        })
        .catch((err: any) => {
            return { error: err, message: 'No assets exist' };
        });
};

export const getOneByToken = async (id: string) => {
    return await dataSource
        .createQueryBuilder(Asset1155Entity, 'a')
        .where('a.token1155Id = (:id)', {
            id: id,
        })
        .getMany();
};

export const getAssets1155ByWalletAddress = async (walletAddress: string) => {
    let owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return await dataSource
        .createQueryBuilder(Asset1155Entity, 'a')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId)', {
            archived: false,
            ownerId: owner.id,
        })
        .getMany()
        .catch((err: any) => {
            return new Error('Owner does not have any assets');
        });
};

export const getAssets1155ByWalletAddressAndToken = async (
    walletAddress: string,
    tokenId: string
) => {
    let owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return await dataSource
        .createQueryBuilder(Asset1155Entity, 'a')
        .leftJoinAndSelect('a.token1155', 't')
        .where(
            'a.archived=:archived AND a.ownerId=:ownerId AND a.token1155Id=:tokenId',
            {
                archived: false,
                ownerId: owner.id,
                tokenId: tokenId,
            }
        )
        .getOne()
        .catch((err: any) => {
            return new Error('Owner does not have any assets');
        });
};
