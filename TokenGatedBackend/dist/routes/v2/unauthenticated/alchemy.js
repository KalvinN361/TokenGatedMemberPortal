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
exports.alchemyRoute = void 0;
const express_1 = require("express");
const database_1 = require("../../../scripts/utilities/database");
const entity_1 = require("../../../entity");
const manager_1 = require("../../../scripts/manager");
const bmoeOwners_1 = require("../../../scripts/data/bmoeOwners");
const ethers_1 = require("ethers");
exports.alchemyRoute = (0, express_1.Router)();
exports.alchemyRoute.get('/Alchemy/GetOwner/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { chainAPIKey, address, chainId } = contract;
        const owners = yield (0, manager_1.getOwners)(chainAPIKey, chainId, address);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            owners: owners,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.alchemyRoute.get('/Alchemy/GetNFTs/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    const { limit } = req.query;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { chainAPIKey, address, chainId } = contract;
        const nfts = yield (0, manager_1.getNFTs)(chainAPIKey, chainId, address, parseInt(limit));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            nfts: nfts,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.alchemyRoute.get('/Alchemy/GetNFTsForOwner/Contract/:contractId/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, walletAddress } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { chainAPIKey, address, chainId } = contract;
        const ownedNfts = yield (0, manager_1.getNFTsForOwner)(chainAPIKey, chainId, [address], walletAddress);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: ownedNfts.length,
            OwnedNfts: ownedNfts,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.alchemyRoute.get('/Alchemy/UpdateNFTOwners/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        const { chainAPIKey, address, chainId } = contract;
        const owners = yield (0, manager_1.getOwners)(chainAPIKey, chainId, address);
        for (let owner of bmoeOwners_1.bmoeOwners) {
            let checksumAddress = (0, ethers_1.getAddress)(owner);
            let dbOwner = (yield (0, manager_1.getOwnerByWalletAddress)(checksumAddress));
            const { walletAddress } = dbOwner;
            let ownerAssets = yield (0, manager_1.getNFTsForOwner)(chainAPIKey, chainId, [address], walletAddress);
            let assetIds = ownerAssets.map((asset) => asset.tokenId);
            for (let assetId of assetIds) {
                console.log(`PV::${new Date().toISOString()}::Updating ${assetId} for ${contract.description} with owner ${dbOwner.id} (${walletAddress})`);
                yield database_1.dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(entity_1.AssetEntity)
                    .values({
                    tokenId: assetId,
                    contractId: contract.id,
                    ownerId: dbOwner.id,
                    updatedDate: new Date(),
                })
                    .orUpdate(['ownerId', 'updatedDate'], ['tokenId', 'contractId'], {
                    skipUpdateIfNoValuesChanged: true,
                })
                    .execute()
                    .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                    return result;
                }))
                    .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
                    return err;
                }));
            }
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Owners updated',
        });
    }
    catch (error) {
        next(error.message);
    }
}));
