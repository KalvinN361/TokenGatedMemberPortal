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
exports.addOwner = exports.getOwnerByEmail = exports.getOwnerByWalletAddress = void 0;
const database_1 = require("../utilities/database");
const entity_1 = require("../../entity");
const baseManager_1 = require("./baseManager");
const getOwnerByWalletAddress = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.OwnerEntity, 'o')
        .insert()
        .into(entity_1.OwnerEntity)
        .values({ walletAddress: walletAddress })
        .orUpdate(['walletAddress'], ['walletAddress'], {})
        .execute()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = res.identifiers[0].id;
        return yield (0, baseManager_1.getOne)(entity_1.OwnerEntity, id);
    }))
        .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.dataSource
            .createQueryBuilder(entity_1.OwnerEntity, 'o')
            .where('o.archived = (:archived) AND o.walletAddress = (:walletAddress)', {
            archived: false,
            walletAddress: walletAddress,
        })
            .getOne()
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            return res;
        }));
    }));
});
exports.getOwnerByWalletAddress = getOwnerByWalletAddress;
const getOwnerByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.OwnerEntity, 'o')
        .where('o.archived = (:archived) AND o.email = (:email)', {
        archived: false,
        email: email,
    })
        .getMany()
        .catch((err) => {
        return { error: err, message: 'Cannot find owner' };
    });
});
exports.getOwnerByEmail = getOwnerByEmail;
const addOwner = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let updateData = data;
    updateData.updatedDate = new Date();
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.OwnerEntity, 'o')
        .insert()
        .into(entity_1.OwnerEntity)
        .values(data)
        .orUpdate(['walletAddress', 'email', 'updatedDate'], ['walletAddress'], {
        skipUpdateIfNoValuesChanged: true,
    })
        .execute()
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = res.identifiers[0].id;
        return yield (0, baseManager_1.getOne)(entity_1.OwnerEntity, id);
    }))
        .catch((err) => {
        return { error: err, message: 'Cannot add owner' };
    });
});
exports.addOwner = addOwner;
