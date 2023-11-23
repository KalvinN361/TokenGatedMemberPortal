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
exports.addTokens1155 = exports.getTokens1155ByWalletAddress = exports.getTokens1155ByContractAndToken = exports.getOneById = void 0;
const database_1 = require("../utilities/database");
const entity_1 = require("../../entity");
const baseManager_1 = require("./baseManager");
const ownerManager_1 = require("./ownerManager");
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Token1155Entity, 't')
        .where('t.id = (:id)', {
        id: id,
    })
        .getOne();
});
exports.getOneById = getOneById;
const getTokens1155ByContractAndToken = (contractId, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Token1155Entity, 't')
        .where('t.archived=:archived AND t.contractId=:contractId AND t.tokenId=:tokenId', {
        archived: false,
        contractId: contractId,
        tokenId: tokenId,
    })
        .getMany();
});
exports.getTokens1155ByContractAndToken = getTokens1155ByContractAndToken;
const getTokens1155ByWalletAddress = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    if (!owner)
        return { status: 'failed', code: 404, message: 'Owner does not exist' };
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Token1155Entity, 't')
        .leftJoinAndSelect('t.assets1155', 'a')
        .where('t.archived=:archived AND a.ownerId=:ownerId', {
        archived: false,
        ownerId: owner.id,
    })
        .getMany();
});
exports.getTokens1155ByWalletAddress = getTokens1155ByWalletAddress;
const addTokens1155 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.Token1155Entity, 'a')
        .insert()
        .into(entity_1.Token1155Entity)
        .values(data)
        .orIgnore()
        /*.orUpdate([''], ['token1155Id', 'contractId'], {
            skipUpdateIfNoValuesChanged: true,
        })*/
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        let resultData = [];
        for (let res of result.identifiers) {
            if (res === undefined)
                continue;
            let data = yield (0, baseManager_1.getOne)(entity_1.Token1155Entity, res.id);
            resultData.push(data);
        }
        return resultData;
    }))
        .catch((err) => {
        return { error: err, message: 'Error in addAsset1155' };
    });
});
exports.addTokens1155 = addTokens1155;
