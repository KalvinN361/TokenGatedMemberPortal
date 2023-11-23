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
exports.getAssets1155ByWalletAddressAndToken = exports.getAssets1155ByWalletAddress = exports.getOneByToken = exports.getOneByContractAndTokenId = void 0;
const database_1 = require("../utilities/database");
const entity_1 = require("../../entity");
const ownerManager_1 = require("./ownerManager");
const getOneByContractAndTokenId = (contract, tokenId, archived = false) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Token1155Entity, 't')
        .where('t.archived=:archived and t.contractId=:contractId and t.tokenId=:tokenId', {
        archived: archived,
        contractId: contract.id,
        tokenId: tokenId,
    })
        .getOne()
        .then((result) => {
        return result;
    })
        .catch((err) => {
        return { error: err, message: 'No assets exist' };
    });
});
exports.getOneByContractAndTokenId = getOneByContractAndTokenId;
const getOneByToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Asset1155Entity, 'a')
        .where('a.token1155Id = (:id)', {
        id: id,
    })
        .getMany();
});
exports.getOneByToken = getOneByToken;
const getAssets1155ByWalletAddress = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Asset1155Entity, 'a')
        .where('a.archived = (:archived) AND a.ownerId = (:ownerId)', {
        archived: false,
        ownerId: owner.id,
    })
        .getMany()
        .catch((err) => {
        return new Error('Owner does not have any assets');
    });
});
exports.getAssets1155ByWalletAddress = getAssets1155ByWalletAddress;
const getAssets1155ByWalletAddressAndToken = (walletAddress, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    let owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Asset1155Entity, 'a')
        .leftJoinAndSelect('a.token1155', 't')
        .where('a.archived=:archived AND a.ownerId=:ownerId AND a.token1155Id=:tokenId', {
        archived: false,
        ownerId: owner.id,
        tokenId: tokenId,
    })
        .getOne()
        .catch((err) => {
        return new Error('Owner does not have any assets');
    });
});
exports.getAssets1155ByWalletAddressAndToken = getAssets1155ByWalletAddressAndToken;
