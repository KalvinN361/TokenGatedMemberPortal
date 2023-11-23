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
exports.getOneBySymbol = exports.getAllWithAssets = exports.getContractTests = exports.getContractBurnable = exports.getContractByAddress = exports.getAllByContractType = void 0;
const database_1 = require("../utilities/database");
const entity_1 = require("../../entity");
const getAllByContractType = (type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.type = (:type)', {
        archived: false,
        type: type,
    })
        .getMany()
        .then((res) => {
        return res;
    });
});
exports.getAllByContractType = getAllByContractType;
const getContractByAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.address = (:address)', {
        archived: false,
        address: address,
    })
        .getOne();
});
exports.getContractByAddress = getContractByAddress;
const getContractBurnable = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.burnable = (:burnable)', {
        archived: false,
        burnable: true,
    })
        .getMany()
        .catch((err) => {
        return { error: err, message: 'Error in getContractBurnable' };
    });
});
exports.getContractBurnable = getContractBurnable;
const getContractTests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.symbol LIKE (:test)', {
        archived: false,
        test: '%-TEST',
    })
        .getMany()
        .catch((err) => {
        return { error: err, message: 'Error in getContractBurnable' };
    });
});
exports.getContractTests = getContractTests;
const getAllWithAssets = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ContractEntity, 'c')
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
        .catch((err) => {
        return { error: err, message: 'Error in getAllWithAssets' };
    });
});
exports.getAllWithAssets = getAllWithAssets;
const getOneBySymbol = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.ContractEntity, 'c')
        .where('c.archived = (:archived) AND c.symbol = (:symbol)', {
        archived: false,
        symbol: symbol,
    })
        .getOne()
        .catch((err) => {
        return { error: err, message: 'Error in getOneBySymbol' };
    });
});
exports.getOneBySymbol = getOneBySymbol;
