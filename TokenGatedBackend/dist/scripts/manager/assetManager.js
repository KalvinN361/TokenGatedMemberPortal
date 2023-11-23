"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBillAttributes = exports.updateDBBillImage = exports.billResizeSmall = exports.upgradeBillGlasses = exports.updateAttributes = exports.updateAssets = exports.updateAssetOwner = exports.addAttributes = exports.addAssets = exports.getAssetsByStatusAndContract = exports.getAssetsByStatus = exports.getAssetOneByContractAndTokenId = exports.getAssetsByContractSale = exports.getAssetsByContractAndLimit = exports.getAssetsByWalletAndContract = exports.getAssetsByWalletNoBurnables = exports.getAssetsByWalletWithBurnables = exports.getAssetsByWalletAddress = exports.getAssetsByContractAndTokenId = exports.getAssetsByContracts = exports.getAssetsByContract = exports.getAssetOne = exports.getAssetsByIdsForCoins = exports.getAssetsCountByOwner = exports.getAssetsCountByContract = exports.getAssetsByIds = exports.getAllWithData = void 0;
const database_1 = require("../utilities/database");
const entity_1 = require("../../entity");
const ownerManager_1 = require("./ownerManager");
const contractManager_1 = require("./contractManager");
const utilities_1 = require("../utilities");
const fs_1 = __importDefault(require("fs"));
const baseManager_1 = require("./baseManager");
const sharp_1 = __importDefault(require("sharp"));
const getAllWithData = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .leftJoinAndSelect('a.owner', 'owner')
        .where('a.archived = (:archived)', {
        archived: false,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return { error: err, message: 'No assets exist' };
    });
});
exports.getAllWithData = getAllWithData;
const getAssetsByIds = (assetIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.id IN (:...assetIds)', {
        archived: false,
        assetIds: assetIds,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return { error: err, message: 'No assets exist' };
    });
});
exports.getAssetsByIds = getAssetsByIds;
const getAssetsCountByContract = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .where('a.archived=:archived AND a.contractId=:contractId', {
        archived: false,
        contractId: contractId,
    })
        .getCount()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
});
exports.getAssetsCountByContract = getAssetsCountByContract;
const getAssetsCountByOwner = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId)', {
        archived: false,
        ownerId: ownerId,
    })
        .getCount()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
});
exports.getAssetsCountByOwner = getAssetsCountByOwner;
const getAssetsByIdsForCoins = (assetIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .leftJoinAndSelect('a.contract', 'contract')
        .where('a.archived = (:archived) AND a.id IN (:...assetIds)', {
        archived: false,
        assetIds: assetIds,
    })
        .orderBy('a.contractId', 'ASC')
        .getMany()
        .catch((err) => {
        return { error: err, message: 'No assets exist' };
    })
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
});
exports.getAssetsByIdsForCoins = getAssetsByIdsForCoins;
const getAssetOne = (assetId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.id = (:assetId)', {
        archived: false,
        assetId: assetId,
    })
        .getOne()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return { error: err, message: 'Asset does not exist' };
    });
});
exports.getAssetOne = getAssetOne;
const getAssetsByContract = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.contractId = (:contractId)', {
        archived: false,
        contractId: contractId,
    })
        .orderBy('a.tokenId :: integer', 'ASC')
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return { error: err, message: 'Contract does not have any assets' };
    });
});
exports.getAssetsByContract = getAssetsByContract;
const getAssetsByContracts = (contractIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.contractId IN (:...contractIds)', {
        archived: false,
        contractIds: contractIds,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return {
            error: err,
            message: 'Contracts do not contain any assets',
        };
    });
});
exports.getAssetsByContracts = getAssetsByContracts;
const getAssetsByContractAndTokenId = (contractId, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.contractId = (:contractId) AND a.tokenId = (:tokenId)', {
        archived: false,
        contractId: contractId,
        tokenId: tokenId,
    })
        .getOne()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
});
exports.getAssetsByContractAndTokenId = getAssetsByContractAndTokenId;
const getAssetsByWalletAddress = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId)', {
        archived: false,
        ownerId: owner === null || owner === void 0 ? void 0 : owner.id,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return new Error('Owner does not have any assets');
    });
});
exports.getAssetsByWalletAddress = getAssetsByWalletAddress;
const getAssetsByWalletWithBurnables = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.dataSource.isInitialized)
        yield database_1.dataSource.initialize();
    let owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    let contractsBurnable = (yield (0, contractManager_1.getContractBurnable)()).map((c) => c.id);
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId) AND a.contractId IN (:...contracts)', {
        archived: false,
        ownerId: owner === null || owner === void 0 ? void 0 : owner.id,
        contracts: contractsBurnable,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        let tempBurnableAssets = [];
        for (let asset of res) {
            let contract = (yield (0, baseManager_1.getOne)(entity_1.ContractEntity, asset.contractId));
            asset.name = contract.description;
            tempBurnableAssets.push(Object.assign(Object.assign({}, asset), { contractAddress: contract.address, burnNow: contract.burnNow }));
        }
        return tempBurnableAssets;
    }));
});
exports.getAssetsByWalletWithBurnables = getAssetsByWalletWithBurnables;
const getAssetsByWalletNoBurnables = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    let contractsBurnable = (yield (0, contractManager_1.getContractBurnable)()).map((c) => c.id);
    let contractsTest = (yield (0, contractManager_1.getContractTests)()).map((c) => c.id);
    let notIncludedContracts = [...contractsBurnable, ...contractsTest];
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId) AND a.contractId NOT IN (:...contracts)', {
        archived: false,
        ownerId: owner === null || owner === void 0 ? void 0 : owner.id,
        contracts: notIncludedContracts,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
});
exports.getAssetsByWalletNoBurnables = getAssetsByWalletNoBurnables;
const getAssetsByWalletAndContract = (walletAddress, contractIds) => __awaiter(void 0, void 0, void 0, function* () {
    let owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId) AND a.contractId IN (:...contracts)', {
        archived: false,
        ownerId: owner === null || owner === void 0 ? void 0 : owner.id,
        contracts: contractIds,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return {
            error: err,
            message: 'Owner does not have any assets',
            function: 'getAssetsByWalletAddressAndContract',
        };
    });
});
exports.getAssetsByWalletAndContract = getAssetsByWalletAndContract;
const getAssetsByContractAndLimit = (contractId, limit, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    let assets = yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where(`a.archived=:archived AND a.contractId=:contractId AND a.ownerId=:ownerId`, {
        archived: false,
        contractId: contractId,
        ownerId: ownerId,
    })
        .orderBy('a.tokenId :: integer', 'ASC')
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
    return assets.slice(0, limit);
});
exports.getAssetsByContractAndLimit = getAssetsByContractAndLimit;
const getAssetsByContractSale = (contractId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.contractId = (:contractId) AND a.status = (:status)', {
        archived: false,
        contractId: contractId,
        status: 'For Sale',
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return {
            error: err,
            message: 'Contract does not have any assets',
            function: 'getAssetsByContractSale',
        };
    });
});
exports.getAssetsByContractSale = getAssetsByContractSale;
const getAssetOneByContractAndTokenId = (contractId, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.contractId = (:contractId) AND a.tokenId = (:tokenId)', {
        archived: false,
        contractId: contractId,
        tokenId: tokenId,
    })
        .getOne()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }))
        .catch((err) => {
        return {
            error: err,
            message: 'Asset does not exist',
            function: 'getAssetOneByContractAndTokenId',
        };
    });
});
exports.getAssetOneByContractAndTokenId = getAssetOneByContractAndTokenId;
const getAssetsByStatus = (status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.status = (:status)', {
        archived: false,
        status: status,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
});
exports.getAssetsByStatus = getAssetsByStatus;
const getAssetsByStatusAndContract = (status, contractId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .leftJoinAndSelect('a.attributes', 'attributes')
        .where('a.archived = (:archived) AND a.status = (:status) AND a.contractId = (:contractId)', {
        archived: false,
        status: status,
        contractId: contractId,
    })
        .getMany()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        return res;
    }));
});
exports.getAssetsByStatusAndContract = getAssetsByStatusAndContract;
// TODO: JTN Finish this function
const addAssets = (assets, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const createData = __rest(yield (0, utilities_1.getUpdateData)(walletAddress), []);
    for (let asset of assets) {
        let assetResult = yield database_1.dataSource
            .createQueryBuilder()
            .insert()
            .into(entity_1.AssetEntity)
            .values(assets)
            .execute()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            return result;
        }))
            .catch((err) => {
            return { error: err, message: 'Failed to add assets' };
        });
        if (asset.hasOwnProperty('attributes')) {
            let attributeGroup = [];
            for (let attribute of asset.attributes) {
                attributeGroup.push(Object.assign(Object.assign({ assetId: assetResult.identifiers[0].id }, asset.attributes), createData));
            }
            yield database_1.dataSource
                .createQueryBuilder()
                .insert()
                .into(entity_1.AttributeEntity)
                .values(attributeGroup)
                .execute()
                .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                return result;
            }))
                .catch((err) => {
                return {
                    error: err,
                    message: 'Failed to add attributes',
                    function: 'addAssets',
                };
            });
        }
    }
});
exports.addAssets = addAssets;
// TODO: JTN Finish this function
const addAttributes = (attributes) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.dataSource
        .createQueryBuilder()
        .insert()
        .into(entity_1.AttributeEntity)
        .values(attributes)
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }))
        .catch((err) => {
        return {
            error: err,
            message: 'Failed to add attributes',
            function: 'addAttributes',
        };
    });
});
exports.addAttributes = addAttributes;
const updateAssetOwner = (asset, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    asset.ownerId = ownerId;
    asset.updatedDate = new Date();
    return yield database_1.dataSource
        .createQueryBuilder()
        .insert()
        .into(entity_1.AssetEntity)
        .values(asset)
        .orUpdate(['ownerId', 'updatedDate'], ['contractId', 'tokenId'], {
        skipUpdateIfNoValuesChanged: true,
    })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }))
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        let id = result.identifiers[0].id;
        return (yield (0, baseManager_1.getOne)(entity_1.AssetEntity, id));
    }));
});
exports.updateAssetOwner = updateAssetOwner;
const updateAssets = (assets) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder()
        .insert()
        .into(entity_1.AssetEntity)
        .values(assets)
        .orUpdate([
        'ownerId',
        'name',
        'description',
        'image',
        'animation',
        'updatedDate',
    ], ['id'], {
        skipUpdateIfNoValuesChanged: true,
    })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        let identifiers = result.identifiers;
        let assetIds = identifiers.map((i) => i.id);
        return yield database_1.dataSource
            .createQueryBuilder(entity_1.AssetEntity, 'a')
            .where('a.id IN (:...assetIds)', {
            assetIds: assetIds,
        })
            .getMany()
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            return res;
        }));
    }));
});
exports.updateAssets = updateAssets;
const updateAttributes = (attributes) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder()
        .insert()
        .into(entity_1.AttributeEntity)
        .values(attributes)
        .orUpdate(['value', 'updatedDate'], ['assetId', 'traitType'], {
        skipUpdateIfNoValuesChanged: true,
    })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        let identifiers = result.identifiers;
        let attributeIds = identifiers.map((i) => i.id);
        return yield database_1.dataSource
            .createQueryBuilder(entity_1.AttributeEntity, 'a')
            .where('a.id IN (:...attributeIds)', {
            attributeIds: attributeIds,
        })
            .getMany()
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            return res;
        }));
    }));
});
exports.updateAttributes = updateAttributes;
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
const upgradeBillGlasses = (assetId) => __awaiter(void 0, void 0, void 0, function* () {
    const tempDir = `${process.cwd()}/temp`;
    const glassesGCPDir = `https://storage.googleapis.com/billmurray1000/3DUpgrades/`;
    const rick = 'efe0d138-eb40-4ec8-8714-0d02ca5b59ab';
    if (!fs_1.default.existsSync(tempDir))
        fs_1.default.mkdirSync(tempDir);
    const dbAsset = (yield (0, baseManager_1.getOne)(entity_1.AssetEntity, assetId));
    const dbAttributes = dbAsset.attributes;
    const contract = (yield (0, baseManager_1.getOne)(entity_1.ContractEntity, dbAsset.contractId));
    const hmContractId = contract.partnerContractId;
    const currentFrames = dbAttributes.find((a) => a.traitType === 'Frames').value;
    const embellishment = dbAttributes.find((a) => a.traitType === 'Hand Embellishments').value;
    const newFrames = (0, utilities_1.getNewFrameColor)(currentFrames);
    if (!newFrames)
        return {
            status: 'failed',
            code: 400,
            message: 'This Bill asset cannot be upgraded any further.',
        };
    const embellish = (0, utilities_1.getHandEmbellishment)(embellishment);
    let glassImage = `${glassesGCPDir}${newFrames}-GLASSES${!embellish ? '' : `-${embellish}`}.png`;
    if (dbAsset.contractId === rick)
        glassImage = glassImage.replace('GLASSES', 'SHIRT');
    const mergedImage = yield (0, utilities_1.merge3DImages)(dbAsset, glassImage);
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
    yield (0, exports.billResizeSmall)(dbAsset, mergedImage);
    let smallImage = yield (0, utilities_1.uploadToGCP)(`${tempDir}/${dbAsset.tokenId}-small.png`, `${dbAsset === null || dbAsset === void 0 ? void 0 : dbAsset.contractId}/${dbAsset === null || dbAsset === void 0 ? void 0 : dbAsset.tokenId}.png`, 'billmurray1000');
    //let newDBAsset: AssetEntity = dbAsset;
    //newDBAsset.image = hmAsset.image as string;
    //newDBAsset.imageSmall = smallImage;
    //await updateDBBillImage(newDBAsset);
    //let hmAttributes = updatedHMAsset.attributes as Array<HMMetadataAttribute>;
    //await updateBillAttributes(dbAsset, hmAttributes);
    //fs.unlinkSync(mergedImage);
    //fs.unlinkSync(`${tempDir}/${dbAsset.tokenId}-small.png`);
    //fs.rmSync(tempDir, { recursive: true, force: true });
});
exports.upgradeBillGlasses = upgradeBillGlasses;
const billResizeSmall = (asset, image) => __awaiter(void 0, void 0, void 0, function* () {
    const tempDir = `${process.cwd()}/temp`;
    const imageLocation = `${tempDir}/${asset.tokenId}-small.png`;
    yield (0, sharp_1.default)(image)
        .metadata()
        .then(({ width }) => (0, sharp_1.default)(image)
        .resize(Math.round(width * 0.25))
        .png({ compressionLevel: 1, quality: 100 })
        .toFile(imageLocation));
});
exports.billResizeSmall = billResizeSmall;
const updateDBBillImage = (asset) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.dataSource
        .createQueryBuilder()
        .insert()
        .into(entity_1.AssetEntity)
        .values(asset)
        .orUpdate(['image', 'updatedDate'], ['id'], {
        skipUpdateIfNoValuesChanged: true,
    })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }));
});
exports.updateDBBillImage = updateDBBillImage;
const updateBillAttributes = (Asset, attributes) => __awaiter(void 0, void 0, void 0, function* () {
    let newAttributes = [];
    for (let attribute of attributes) {
        let newAttribute = {
            assetId: Asset.id,
            traitType: attribute.trait_type,
            value: attribute.value,
            updatedDate: new Date(),
        };
        newAttributes.push(newAttribute);
    }
    yield database_1.dataSource
        .createQueryBuilder()
        .insert()
        .into(entity_1.AttributeEntity)
        .values(newAttributes)
        .orUpdate(['value', 'updatedDate'], ['assetId', 'traitType'], {
        skipUpdateIfNoValuesChanged: true,
    })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }));
});
exports.updateBillAttributes = updateBillAttributes;
