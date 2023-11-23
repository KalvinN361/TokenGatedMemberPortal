import { dataSource } from '../utilities/database';
import { ShopEntity } from '../../entity';

export const getShops = async () => {
    return await dataSource
        .createQueryBuilder(ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('shop.archived = (:archived)', {
            archived: false,
        })
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
};
export const getShopsByType = async (type: string) => {
    return await dataSource
        .createQueryBuilder(ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('shop.archived = (:archived) AND shop.type = (:type)', {
            archived: false,
            type: type,
        })
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
};

export const getShopsByWalletAddress = async (walletAddress: string) => {
    return await dataSource
        .createQueryBuilder(ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where(
            'shop.archived = (:archived) AND owner.walletAddress = (:walletAddress)',
            {
                archived: false,
                walletAddress: walletAddress,
            }
        )
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
};

export const getShopsByWalletAddressAndType = async (
    walletAddress: string,
    type: string
) => {
    return await dataSource
        .createQueryBuilder(ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where(
            'shop.archived = (:archived) AND owner.walletAddress = (:walletAddress) AND shop.type = (:type)',
            {
                archived: false,
                walletAddress: walletAddress,
                type: type,
            }
        )
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
};
