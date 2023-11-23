import { AssetEntity, ClaimEntity } from '../../entity';
import { dataSource, setDataSource } from '../utilities/database';
import { ClaimEntityWithAssetName } from '../../definitions';
import { getAssetOne } from './assetManager';

export const getClaimsByType = async (type: string) => {
    let claimsWithAssetName: Array<ClaimEntityWithAssetName> = [];
    return (await dataSource
        .createQueryBuilder(ClaimEntity, 'c')
        .leftJoinAndSelect('c.asset', 'asset')
        .where('c.archived = (:archived) AND c.type = (:type)', {
            archived: false,
            type: type,
        })
        .getMany()) as unknown as Array<ClaimEntityWithAssetName>;

    /*for (let claim of claims) {
        const assetId = claim.assetId;
        const asset = (await getAssetOne(assetId)) as AssetEntity;

        claimsWithAssetName.push({
            ...claim,
            assetName: asset.name,
        });
    }*/
    //return claimsWithAssetName;
};

export const getCoinsByName = async (name: string) => {
    return await dataSource
        .createQueryBuilder(ClaimEntity, 'c')
        .where(
            'c.archived = (:archived) AND c.type = (:type) AND c.name = (:name)',
            {
                archived: false,
                type: 'coin',
                name: name,
            }
        )
        .getMany();
};

export const getUnclaimedCoinsByName = async (
    name: string,
    treasury: boolean,
    contractId: string
) => {
    const venkmanBillId = '3c597bbc-9691-41cc-9e64-a92e2eac8c1e';
    return await dataSource
        .createQueryBuilder(ClaimEntity, 'c')
        .leftJoinAndSelect('c.asset', 'asset')
        .leftJoinAndSelect('asset.attributes', 'attributes')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where(
            'c.archived = :archived AND c.type = :type AND c.name = :name AND c.claimed = :claimed AND asset.ownerId != :ownerId AND asset.contractId = :contractId',
            {
                archived: false,
                type: 'coin',
                name: name,
                claimed: false,
                ownerId: treasury ? venkmanBillId : '',
                contractId: contractId,
            }
        )
        .getMany();
};

export const updateCoinInventory = async (claim: ClaimEntity) => {
    return await dataSource
        .createQueryBuilder()
        .update(ClaimEntity)
        .set(claim)
        .where('id = :id', { id: claim.id })
        .execute();
};

export const getClaimsByAssetIds = async (assetIds: string[]) => {
    return await dataSource
        .createQueryBuilder(ClaimEntity, 'c')
        .leftJoinAndSelect('c.asset', 'asset')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('c.archived = (:archived) AND c.assetId IN (:...assetIds)', {
            archived: false,
            assetIds: assetIds,
        })
        .getMany();
};
