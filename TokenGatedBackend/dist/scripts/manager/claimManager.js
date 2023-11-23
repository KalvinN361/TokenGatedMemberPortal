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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClaimsByAssetIds = exports.updateCoinInventory = exports.getUnclaimedCoinsByName = exports.getCoinsByName = exports.getClaimsByType = void 0;
const entity_1 = require("../../entity");
const database_1 = require("../utilities/database");
const getClaimsByType = (type) => __awaiter(void 0, void 0, void 0, function* () {
    let claimsWithAssetName = [];
    return (yield database_1.dataSource
        .createQueryBuilder(entity_1.ClaimEntity, 'c')
        .leftJoinAndSelect('c.asset', 'asset')
        .where('c.archived = (:archived) AND c.type = (:type)', {
        archived: false,
        type: type,
    })
        .getMany());
    /*for (let claim of claims) {
        const assetId = claim.assetId;
        const asset = (await getAssetOne(assetId)) as AssetEntity;

        claimsWithAssetName.push({
            ...claim,
            assetName: asset.name,
        });
    }*/
    //return claimsWithAssetName;
});
exports.getClaimsByType = getClaimsByType;
const getCoinsByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ClaimEntity, 'c')
        .where('c.archived = (:archived) AND c.type = (:type) AND c.name = (:name)', {
        archived: false,
        type: 'coin',
        name: name,
    })
        .getMany();
});
exports.getCoinsByName = getCoinsByName;
const getUnclaimedCoinsByName = (name, treasury, contractId) => __awaiter(void 0, void 0, void 0, function* () {
    const venkmanBillId = '3c597bbc-9691-41cc-9e64-a92e2eac8c1e';
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ClaimEntity, 'c')
        .leftJoinAndSelect('c.asset', 'asset')
        .leftJoinAndSelect('asset.attributes', 'attributes')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('c.archived = :archived AND c.type = :type AND c.name = :name AND c.claimed = :claimed AND asset.ownerId != :ownerId AND asset.contractId = :contractId', {
        archived: false,
        type: 'coin',
        name: name,
        claimed: false,
        ownerId: treasury ? venkmanBillId : '',
        contractId: contractId,
    })
        .getMany();
});
exports.getUnclaimedCoinsByName = getUnclaimedCoinsByName;
const updateCoinInventory = (claim) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder()
        .update(entity_1.ClaimEntity)
        .set(claim)
        .where('id = :id', { id: claim.id })
        .execute();
});
exports.updateCoinInventory = updateCoinInventory;
const getClaimsByAssetIds = (assetIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ClaimEntity, 'c')
        .leftJoinAndSelect('c.asset', 'asset')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('c.archived = (:archived) AND c.assetId IN (:...assetIds)', {
        archived: false,
        assetIds: assetIds,
    })
        .getMany();
});
exports.getClaimsByAssetIds = getClaimsByAssetIds;
