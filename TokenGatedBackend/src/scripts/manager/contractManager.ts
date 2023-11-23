import { dataSource } from '../utilities/database';
import { ContractEntity } from '../../entity';

export const getAllByContractType = async (type: 'ERC721' | 'ERC1155') => {
    return await dataSource
        .createQueryBuilder(ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.type = (:type)', {
            archived: false,
            type: type,
        })
        .getMany()
        .then((res) => {
            return res;
        });
};

export const getContractByAddress = async (address: string) => {
    return await dataSource
        .createQueryBuilder(ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.address = (:address)', {
            archived: false,
            address: address,
        })
        .getOne();
};

export const getContractBurnable = async () => {
    return await dataSource
        .createQueryBuilder(ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.burnable = (:burnable)', {
            archived: false,
            burnable: true,
        })
        .getMany()
        .catch((err: any) => {
            return { error: err, message: 'Error in getContractBurnable' };
        });
};

export const getContractTests = async () => {
    return await dataSource
        .createQueryBuilder(ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.symbol LIKE (:test)', {
            archived: false,
            test: '%-TEST',
        })
        .getMany()
        .catch((err: any) => {
            return { error: err, message: 'Error in getContractBurnable' };
        });
};

export const getAllWithAssets = async () => {
    return await dataSource
        .createQueryBuilder(ContractEntity, 'c')
        .select([
            'c.id',
            'c.description',
            'c.symbol',
            'c.address',
            'c.type',
            'c.minter',
            'c.partnerContractId',
        ])
        .leftJoinAndSelect('c.assets', 'assets')
        .leftJoinAndSelect('assets.attributes', 'attributes')
        .where('c.archived = (:archived)', {
            archived: false,
        })
        .getMany()
        .catch((err: any) => {
            return { error: err, message: 'Error in getAllWithAssets' };
        });
};

export const getOneBySymbol = async (symbol: string) => {
    return await dataSource
        .createQueryBuilder(ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.symbol = (:symbol)', {
            archived: false,
            symbol: symbol,
        })
        .getOne()
        .catch((err: any) => {
            return { error: err, message: 'Error in getOneBySymbol' };
        });
};
