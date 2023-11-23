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
exports.getShopsByWalletAddressAndType = exports.getShopsByWalletAddress = exports.getShopsByType = exports.getShops = void 0;
const database_1 = require("../utilities/database");
const entity_1 = require("../../entity");
const getShops = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('shop.archived = (:archived)', {
        archived: false,
    })
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
});
exports.getShops = getShops;
const getShopsByType = (type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('shop.archived = (:archived) AND shop.type = (:type)', {
        archived: false,
        type: type,
    })
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
});
exports.getShopsByType = getShopsByType;
const getShopsByWalletAddress = (walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('shop.archived = (:archived) AND owner.walletAddress = (:walletAddress)', {
        archived: false,
        walletAddress: walletAddress,
    })
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
});
exports.getShopsByWalletAddress = getShopsByWalletAddress;
const getShopsByWalletAddressAndType = (walletAddress, type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ShopEntity, 'shop')
        .leftJoinAndSelect('shop.asset', 'asset')
        .leftJoinAndSelect('asset.owner', 'owner')
        .leftJoinAndSelect('asset.contract', 'contract')
        .where('shop.archived = (:archived) AND owner.walletAddress = (:walletAddress) AND shop.type = (:type)', {
        archived: false,
        walletAddress: walletAddress,
        type: type,
    })
        .orderBy('asset.tokenId', 'ASC')
        .getMany();
});
exports.getShopsByWalletAddressAndType = getShopsByWalletAddressAndType;
