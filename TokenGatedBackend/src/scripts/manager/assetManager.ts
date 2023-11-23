import { dataSource } from '../utilities/database';
import {
    AssetEntity,
    AttributeEntity,
    ContractEntity,
    OwnerEntity,
} from '../../entity';
import { getOwnerByWalletAddress } from './ownerManager';
import { getContractBurnable, getContractTests } from './contractManager';
import { InsertResult } from 'typeorm';
import {
    getHandEmbellishment,
    getNewFrameColor,
    getUpdateData,
    merge3DImages,
    uploadToGCP,
} from '../utilities';
import { BurnableAsset, HMMetadataAttribute } from '../../definitions';
import fs from 'fs';
import { getOne } from './baseManager';
import sharp from 'sharp';

export const getAllWithData = async () => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .leftJoinAndSelect('a.owner', 'owner')
        .where('a.archived = (:archived)', {
            archived: false,
        })
        .getMany()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return { error: err, message: 'No assets exist' };
        });
};

export const getAssetsByIds = async (assetIds: Array<string>) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.id IN (:...assetIds)', {
            archived: false,
            assetIds: assetIds,
        })
        .getMany()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return { error: err, message: 'No assets exist' };
        });
};

export const getAssetsCountByContract = async (contractId: string) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .where('a.archived=:archived AND a.contractId=:contractId', {
            archived: false,
            contractId: contractId,
        })
        .getCount()
        .then(async (res) => {
            return res;
        });
};

export const getAssetsCountByOwner = async (ownerId: string) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId)', {
            archived: false,
            ownerId: ownerId,
        })
        .getCount()
        .then(async (res) => {
            return res;
        });
};

export const getAssetsByIdsForCoins = async (assetIds: Array<string>) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .leftJoinAndSelect('a.contract', 'contract')
        .where('a.archived = (:archived) AND a.id IN (:...assetIds)', {
            archived: false,
            assetIds: assetIds,
        })
        .orderBy('a.contractId', 'ASC')
        .getMany()
        .catch((err: any) => {
            return { error: err, message: 'No assets exist' };
        })
        .then(async (res) => {
            return res;
        });
};
export const getAssetOne = async (assetId: string) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.id = (:assetId)', {
            archived: false,
            assetId: assetId,
        })
        .getOne()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return { error: err, message: 'Asset does not exist' };
        });
};

export const getAssetsByContract = async (contractId: string) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.contractId = (:contractId)', {
            archived: false,
            contractId: contractId,
        })
        .orderBy('a.tokenId :: integer', 'ASC')
        .getMany()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return { error: err, message: 'Contract does not have any assets' };
        });
};

export const getAssetsByContracts = async (contractIds: Array<string>) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.contractId IN (:...contractIds)',
            {
                archived: false,
                contractIds: contractIds,
            }
        )
        .getMany()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return {
                error: err,
                message: 'Contracts do not contain any assets',
            };
        });
};

export const getAssetsByContractAndTokenId = async (
    contractId: string,
    tokenId: string
) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.contractId = (:contractId) AND a.tokenId = (:tokenId)',
            {
                archived: false,
                contractId: contractId,
                tokenId: tokenId,
            }
        )
        .getOne()
        .then(async (res) => {
            return res as AssetEntity;
        });
};

export const getAssetsByWalletAddress = async (walletAddress: string) => {
    let owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId)', {
            archived: false,
            ownerId: owner?.id,
        })
        .getMany()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return new Error('Owner does not have any assets');
        });
};

export const getAssetsByWalletWithBurnables = async (walletAddress: string) => {
    if (!dataSource.isInitialized) await dataSource.initialize();
    let owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    let contractsBurnable = (
        (await getContractBurnable()) as Array<ContractEntity>
    ).map((c) => c.id);
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.ownerId = (:ownerId) AND a.contractId IN (:...contracts)',
            {
                archived: false,
                ownerId: owner?.id,
                contracts: contractsBurnable,
            }
        )
        .getMany()
        .then(async (res) => {
            let tempBurnableAssets: Array<BurnableAsset> = [];
            for (let asset of res) {
                let contract = (await getOne(
                    ContractEntity,
                    asset.contractId
                )) as ContractEntity;
                asset.name = contract.description;
                tempBurnableAssets.push({
                    ...asset,
                    contractAddress: contract.address,
                    burnNow: contract.burnNow,
                } as BurnableAsset);
            }
            return tempBurnableAssets;
        });
};

export const getAssetsByWalletNoBurnables = async (walletAddress: string) => {
    let owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    let contractsBurnable = (
        (await getContractBurnable()) as Array<ContractEntity>
    ).map((c) => c.id);
    let contractsTest = (
        (await getContractTests()) as Array<ContractEntity>
    ).map((c) => c.id);
    let notIncludedContracts = [...contractsBurnable, ...contractsTest];
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.ownerId = (:ownerId) AND a.contractId NOT IN (:...contracts)',
            {
                archived: false,
                ownerId: owner?.id,
                contracts: notIncludedContracts,
            }
        )
        .getMany()
        .then(async (res) => {
            return res;
        });
};

export const getAssetsByWalletAndContract = async (
    walletAddress: string,
    contractIds: Array<string>
) => {
    let owner = (await getOwnerByWalletAddress(walletAddress)) as OwnerEntity;
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.ownerId = (:ownerId) AND a.contractId IN (:...contracts)',
            {
                archived: false,
                ownerId: owner?.id,
                contracts: contractIds,
            }
        )
        .getMany()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return {
                error: err,
                message: 'Owner does not have any assets',
                function: 'getAssetsByWalletAddressAndContract',
            };
        });
};

export const getAssetsByContractAndLimit = async (
    contractId: string,
    limit: number,
    ownerId?: string
) => {
    let assets = await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            `a.archived=:archived AND a.contractId=:contractId AND a.ownerId=:ownerId`,
            {
                archived: false,
                contractId: contractId,
                ownerId: ownerId,
            }
        )
        .orderBy('a.tokenId :: integer', 'ASC')
        .getMany()
        .then(async (res) => {
            return res;
        });
    return assets.slice(0, limit);
};

export const getAssetsByContractSale = async (contractId: string) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.contractId = (:contractId) AND a.status = (:status)',
            {
                archived: false,
                contractId: contractId,
                status: 'For Sale',
            }
        )
        .getMany()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return {
                error: err,
                message: 'Contract does not have any assets',
                function: 'getAssetsByContractSale',
            };
        });
};

export const getAssetOneByContractAndTokenId = async (
    contractId: string,
    tokenId: string
) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.contractId = (:contractId) AND a.tokenId = (:tokenId)',
            {
                archived: false,
                contractId: contractId,
                tokenId: tokenId,
            }
        )
        .getOne()
        .then(async (res) => {
            return res;
        })
        .catch((err: any) => {
            return {
                error: err,
                message: 'Asset does not exist',
                function: 'getAssetOneByContractAndTokenId',
            };
        });
};

export const getAssetsByStatus = async (status: string) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.status = (:status)', {
            archived: false,
            status: status,
        })
        .getMany()
        .then(async (res) => {
            return res;
        });
};

export const getAssetsByStatusAndContract = async (
    status: string,
    contractId: string
) => {
    return await dataSource
        .createQueryBuilder(AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(
            'a.archived = (:archived) AND a.status = (:status) AND a.contractId = (:contractId)',
            {
                archived: false,
                status: status,
                contractId: contractId,
            }
        )
        .getMany()
        .then(async (res) => {
            return res;
        });
};

// TODO: JTN Finish this function
export const addAssets = async (assets: Array<any>, walletAddress: string) => {
    const { ...createData } = await getUpdateData(walletAddress);
    for (let asset of assets) {
        let assetResult = await dataSource
            .createQueryBuilder()
            .insert()
            .into(AssetEntity)
            .values(assets)
            .execute()
            .then(async (result) => {
                return result;
            })
            .catch((err: any) => {
                return { error: err, message: 'Failed to add assets' };
            });

        if (asset.hasOwnProperty('attributes')) {
            let attributeGroup = [];
            for (let attribute of asset.attributes) {
                attributeGroup.push({
                    assetId: (assetResult as InsertResult).identifiers[0].id,
                    ...asset.attributes,
                    ...createData,
                });
            }
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(AttributeEntity)
                .values(attributeGroup)
                .execute()
                .then(async (result) => {
                    return result;
                })
                .catch((err: any) => {
                    return {
                        error: err,
                        message: 'Failed to add attributes',
                        function: 'addAssets',
                    };
                });
        }
    }
};

// TODO: JTN Finish this function
export const addAttributes = async (attributes: Array<AttributeEntity>) => {
    await dataSource
        .createQueryBuilder()
        .insert()
        .into(AttributeEntity)
        .values(attributes)
        .execute()
        .then(async (result) => {
            return result;
        })
        .catch((err: any) => {
            return {
                error: err,
                message: 'Failed to add attributes',
                function: 'addAttributes',
            };
        });
};

export const updateAssetOwner = async (asset: AssetEntity, ownerId: string) => {
    asset.ownerId = ownerId;
    asset.updatedDate = new Date();
    return await dataSource
        .createQueryBuilder()
        .insert()
        .into(AssetEntity)
        .values(asset)
        .orUpdate(['ownerId', 'updatedDate'], ['contractId', 'tokenId'], {
            skipUpdateIfNoValuesChanged: true,
        })
        .execute()
        .then(async (result) => {
            return result;
        })
        .then(async (result) => {
            let id = result.identifiers[0].id;
            return (await getOne(AssetEntity, id)) as AssetEntity;
        });
};

export const updateAssets = async (assets: any) => {
    return await dataSource
        .createQueryBuilder()
        .insert()
        .into(AssetEntity)
        .values(assets)
        .orUpdate(
            [
                'ownerId',
                'name',
                'description',
                'image',
                'animation',
                'updatedDate',
            ],
            ['id'],
            {
                skipUpdateIfNoValuesChanged: true,
            }
        )
        .execute()
        .then(async (result) => {
            let identifiers = result.identifiers;
            let assetIds = identifiers.map((i) => i.id);
            return await dataSource
                .createQueryBuilder(AssetEntity, 'a')
                .where('a.id IN (:...assetIds)', {
                    assetIds: assetIds,
                })
                .getMany()
                .then(async (res) => {
                    return res;
                });
        });
};

export const updateAttributes = async (attributes: any) => {
    return await dataSource
        .createQueryBuilder()
        .insert()
        .into(AttributeEntity)
        .values(attributes)
        .orUpdate(['value', 'updatedDate'], ['assetId', 'traitType'], {
            skipUpdateIfNoValuesChanged: true,
        })
        .execute()
        .then(async (result) => {
            let identifiers = result.identifiers;
            let attributeIds = identifiers.map((i) => i.id);
            return await dataSource
                .createQueryBuilder(AttributeEntity, 'a')
                .where('a.id IN (:...attributeIds)', {
                    attributeIds: attributeIds,
                })
                .getMany()
                .then(async (res) => {
                    return res;
                });
        });
};

/*export const updateAttributes = async (attributes: Array<AttributeEntity>) => {
    return await dataSource
        .createQueryBuilder()
        .update(AttributeEntity)
        .set(attributes)
        .whereInIds(attributes)
        .andWhere('archived = :archived', { archived: false })
        .execute()
        .catch((err: any) => {
            return {
                error: err,
                message: 'Failed to update attributes',
                function: 'updateAttributes',
            };
        });
};*/

export const upgradeBillGlasses = async (assetId: string) => {
    const tempDir = `${process.cwd()}/temp`;
    const glassesGCPDir = `https://storage.googleapis.com/billmurray1000/3DUpgrades/`;
    const rick = 'efe0d138-eb40-4ec8-8714-0d02ca5b59ab';

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const dbAsset = (await getOne(AssetEntity, assetId)) as AssetEntity;
    const dbAttributes = dbAsset.attributes;
    const contract = (await getOne(
        ContractEntity,
        dbAsset.contractId
    )) as ContractEntity;
    const hmContractId = contract.partnerContractId as string;

    const currentFrames = (
        dbAttributes.find((a) => a.traitType === 'Frames') as AttributeEntity
    ).value;
    const embellishment = (
        dbAttributes.find(
            (a) => a.traitType === 'Hand Embellishments'
        ) as AttributeEntity
    ).value;

    const newFrames = getNewFrameColor(currentFrames);
    if (!newFrames)
        return {
            status: 'failed',
            code: 400,
            message: 'This Bill asset cannot be upgraded any further.',
        };

    const embellish = getHandEmbellishment(embellishment);

    let glassImage = `${glassesGCPDir}${newFrames}-GLASSES${
        !embellish ? '' : `-${embellish}`
    }.png`;
    if (dbAsset.contractId === rick)
        glassImage = glassImage.replace('GLASSES', 'SHIRT');

    const mergedImage = await merge3DImages(dbAsset, glassImage);

    /*await HMuploadTokenMetadataImage(
        hmContractId,
        dbAsset.tokenId,
        mergedImage
    );*/

    /*const hmAsset = await HMgetTokenHostedMetadata(
        hmContractId,
        dbAsset.tokenId
    );*/
    /*const frameIndex = hmAsset.attributes!.findIndex(
        (a) => a.trait_type === 'Frames'
    );*/
    //hmAsset.attributes![frameIndex].value = toTitleCase(newFrames);
    //hmAsset.attributes!.push({ trait_type: 'Upgraded', value: 'Yes' });

    //await HMsetTokenHostedMetadata(hmContractId, dbAsset.tokenId, hmAsset);
    /*const updatedHMAsset = await HMgetTokenHostedMetadata(
        hmContractId,
        dbAsset.tokenId
    );*/
    await billResizeSmall(dbAsset, mergedImage);
    let smallImage = await uploadToGCP(
        `${tempDir}/${dbAsset.tokenId}-small.png`,
        `${dbAsset?.contractId}/${dbAsset?.tokenId}.png`,
        'billmurray1000'
    );

    //let newDBAsset: AssetEntity = dbAsset;
    //newDBAsset.image = hmAsset.image as string;
    //newDBAsset.imageSmall = smallImage;
    //await updateDBBillImage(newDBAsset);

    //let hmAttributes = updatedHMAsset.attributes as Array<HMMetadataAttribute>;
    //await updateBillAttributes(dbAsset, hmAttributes);
    //fs.unlinkSync(mergedImage);
    //fs.unlinkSync(`${tempDir}/${dbAsset.tokenId}-small.png`);
    //fs.rmSync(tempDir, { recursive: true, force: true });
};

export const billResizeSmall = async (asset: AssetEntity, image: string) => {
    const tempDir = `${process.cwd()}/temp`;
    const imageLocation = `${tempDir}/${asset.tokenId}-small.png`;
    await sharp(image)
        .metadata()
        .then(({ width }) =>
            sharp(image)
                .resize(Math.round(width! * 0.25))
                .png({ compressionLevel: 1, quality: 100 })
                .toFile(imageLocation)
        );
};

export const updateDBBillImage = async (asset: AssetEntity) => {
    await dataSource
        .createQueryBuilder()
        .insert()
        .into(AssetEntity)
        .values(asset)
        .orUpdate(['image', 'updatedDate'], ['id'], {
            skipUpdateIfNoValuesChanged: true,
        })
        .execute()
        .then(async (result) => {
            return result;
        });
};

export const updateBillAttributes = async (
    Asset: AssetEntity,
    attributes: Array<HMMetadataAttribute>
) => {
    let newAttributes = [];
    for (let attribute of attributes) {
        let newAttribute = {
            assetId: Asset.id,
            traitType: attribute.trait_type as string,
            value: attribute.value as string,
            updatedDate: new Date(),
        };
        newAttributes.push(newAttribute);
    }
    await dataSource
        .createQueryBuilder()
        .insert()
        .into(AttributeEntity)
        .values(newAttributes)
        .orUpdate(['value', 'updatedDate'], ['assetId', 'traitType'], {
            skipUpdateIfNoValuesChanged: true,
        })
        .execute()
        .then(async (result) => {
            return result;
        });
};
