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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseRoute = void 0;
const express_1 = require("express");
const utilities_1 = require("../../../scripts/utilities");
const database_1 = require("../../../scripts/utilities/database");
const entity_1 = require("../../../entity");
const manager_1 = require("../../../scripts/manager");
const ethers_1 = require("ethers");
const chalk_1 = __importDefault(require("chalk"));
exports.databaseRoute = (0, express_1.Router)();
exports.databaseRoute.post('/Database/BackFillByContract721', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, database } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        yield (0, utilities_1.BackFill721)(address, database, database_1.dataSource).then();
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
            message: `Owners, Assets, and Attributes are done for contract ${address}`,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.databaseRoute.post('/Database/BackFill1155HyperMint', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let message;
        if (contractId) {
            console.log('contractId', contractId);
            message = yield (0, utilities_1.BackFill1155HyperMint)(contractId).then((res) => {
                return res;
            });
        }
        else {
            console.log('no contractId');
            message = yield (0, utilities_1.BackFill1155HyperMint)().then((res) => {
                {
                    return res;
                }
            });
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
            message: message,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.databaseRoute.get('/Database/BackFillAttributes/Contract/:contractId/StartIndex/:startIndex', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, startIndex } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let assets = yield database_1.dataSource
            .createQueryBuilder(entity_1.AssetEntity, 'a')
            .where('a.archived = (:archived) AND a.contractId = (:contractId) AND a.tokenId :: integer > :tokenId', {
            archived: false,
            contractId: contractId,
            tokenId: startIndex,
        })
            .orderBy('a.tokenId :: integer', 'ASC')
            .getMany()
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            return res;
        }));
        for (let asset of assets) {
            console.log(`PV::${new Date().toISOString()}::Inserting attributes for ${asset.tokenId} - ${asset.id}`);
            let insertValues = [
                { traitType: 'Color', value: 'Blue', assetId: asset.id },
                { traitType: 'OBs', value: 'No', assetId: asset.id },
                {
                    traitType: 'Destinations',
                    value: 'No',
                    assetId: asset.id,
                },
            ];
            yield database_1.dataSource
                .createQueryBuilder(entity_1.AttributeEntity, 'a')
                .insert()
                .into(entity_1.AttributeEntity)
                .values(insertValues)
                .orUpdate(['value'], ['traitType', 'assetId'], {
                skipUpdateIfNoValuesChanged: true,
            })
                .execute()
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                return res;
            }));
        }
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
            message: `Attributes are done for contract ${contractId}`,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.databaseRoute.get('/Database/FillMissingAssets/Contract/:contractId/StartIndex/:startIndex', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, startIndex } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let contract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        console.log(`PV::${new Date().toISOString()}::Got data for contract ${contractId}`);
        const { chainId, address, abi } = contract;
        let provider = (0, utilities_1.getAlchemyProvider)(chainId);
        let blockchainContract = new ethers_1.Contract(address, abi, provider);
        let totalSupply = yield blockchainContract.totalSupply();
        let initialAsset = (yield (0, manager_1.getOne)(entity_1.AssetEntity, '19d2d026-39cc-458a-8247-c0dfeaf0a6f0'));
        const { description, image } = initialAsset;
        for (let i = parseInt(startIndex); i <= totalSupply; i++) {
            console.log(chalk_1.default.blue(`Checking token ${i}`));
            yield database_1.dataSource
                .createQueryBuilder(entity_1.AssetEntity, 'a')
                .insert()
                .into(entity_1.AssetEntity)
                .values({
                contractId: contract.id,
                tokenId: i.toString(),
                name: `Open Edition Membership #${i.toString()}`,
                description: description,
                image: image,
                updatedDate: new Date(),
            })
                .orUpdate(['updatedDate'], ['contractId', 'tokenId'], {
                skipUpdateIfNoValuesChanged: true,
            })
                .execute()
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                if (res.identifiers.length > 0) {
                    console.log(`PV::${new Date().toISOString()}::Inserted asset ${res.identifiers[0].id} for Token ${i}`);
                }
                return res;
            }));
        }
        yield database_1.dataSource.destroy();
        res.status(204).json({
            status: 'success',
            code: 204,
            message: `Assets are done for contract ${contractId}`,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.databaseRoute.get('/Database/AddressChecksum', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.dataSource.isInitialized)
        yield database_1.dataSource.initialize();
    let owners = yield (0, manager_1.getAll)(entity_1.OwnerEntity);
    for (let owner of owners) {
        let workingAddress = owner.walletAddress;
        try {
            console.log(chalk_1.default.blue(`Checking address ${workingAddress}`));
            if ((0, ethers_1.isAddress)(workingAddress)) {
                console.log(chalk_1.default.green(`Address ${workingAddress} is valid`));
                continue;
            }
            console.log(chalk_1.default.red(`Address ${workingAddress} is invalid`));
            let checksumAddress = (0, ethers_1.getAddress)(workingAddress);
            console.log(chalk_1.default.green(`Checksum address is ${checksumAddress}`));
            yield database_1.dataSource
                .createQueryBuilder(entity_1.OwnerEntity, 'o')
                .update(entity_1.OwnerEntity)
                .set({
                walletAddress: checksumAddress,
                updatedDate: new Date(),
            })
                .where('o.id = (:id)', {
                id: owner.id,
            })
                .execute();
        }
        catch (error) {
            console.log(chalk_1.default.red(`Error: ${error.message}`));
        }
    }
    yield database_1.dataSource.destroy();
    res.status(204).json({
        status: 'success',
        code: 204,
        message: `Address checksums are done`,
    });
}));
exports.databaseRoute.get('/Database/DuplicateChecksum', database_1.setDataSource, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!database_1.dataSource.isInitialized)
        yield database_1.dataSource.initialize();
    let owners = yield database_1.dataSource
        .createQueryBuilder(entity_1.OwnerEntity, 'o')
        .orderBy('o.walletAddress', 'ASC')
        .getMany();
    for (let owner of owners) {
        if (owner.walletAddress === (0, ethers_1.getAddress)(owner.walletAddress))
            console.log(chalk_1.default.green(`Address ${owner.walletAddress} is valid`));
        else {
            let assetCount = yield (0, manager_1.getAssetsCountByOwner)(owner.id);
            if (!assetCount) {
                yield database_1.dataSource
                    .createQueryBuilder()
                    .delete()
                    .from(entity_1.OwnerEntity)
                    .where('id = (:id)', {
                    id: owner.id,
                })
                    .execute();
                console.log(`Deleted ${owner.walletAddress} with ${assetCount} assets`);
            }
            else {
                let assets = (yield (0, manager_1.getAssetsByWalletAddress)(owner.walletAddress));
                let correctOwner = (yield (0, manager_1.getOwnerByWalletAddress)((0, ethers_1.getAddress)(owner.walletAddress)));
                if (correctOwner) {
                    for (let asset of assets) {
                        yield database_1.dataSource
                            .createQueryBuilder()
                            .update(entity_1.AssetEntity)
                            .set({
                            ownerId: correctOwner.id,
                            updatedDate: new Date(),
                        })
                            .where('id = (:id)', {
                            id: asset.id,
                        })
                            .execute();
                    }
                    console.log(chalk_1.default.yellow(`Updated assets for ${owner.walletAddress} to ${correctOwner.walletAddress} with ${assetCount} assets`));
                }
                else {
                    yield database_1.dataSource
                        .createQueryBuilder()
                        .update(entity_1.OwnerEntity)
                        .set({
                        walletAddress: (0, ethers_1.getAddress)(owner.walletAddress),
                    })
                        .where('id = (:id)', {
                        id: owner.id,
                    })
                        .execute();
                    console.log(chalk_1.default.blue(`Updated ${owner.walletAddress} to ${(0, ethers_1.getAddress)(owner.walletAddress)} with ${assetCount} assets`));
                }
                console.log(chalk_1.default.red(`Address ${owner.walletAddress} is incorrect with ${assetCount} assets. ${(0, ethers_1.getAddress)(owner.walletAddress)} is the correct checksum`));
            }
        }
    }
    res.status(204).json({
        status: 'success',
        code: 204,
        message: `Address checksums are done`,
    });
}));
