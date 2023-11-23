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
exports.collectRoute = void 0;
const express_1 = require("express");
const database_1 = require("../../../scripts/utilities/database");
const manager_1 = require("../../../scripts/manager");
const entity_1 = require("../../../entity");
const manager_2 = require("../../../scripts/manager");
exports.collectRoute = (0, express_1.Router)();
exports.collectRoute.get('/Collect/GetAll', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let collects = (yield (0, manager_1.getAll)(entity_1.CollectEntity));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: 0,
            collects: collects,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.collectRoute.get('/Collect/GetCount/Contract/:contractId/Owner/:ownerId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, ownerId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const count = yield database_1.dataSource
            .createQueryBuilder(entity_1.AssetEntity, 'a')
            .where('a.archived = (:archived) AND a.contractId = (:contractId) AND a.ownerId = (:ownerId)', {
            archived: false,
            contractId: contractId,
            ownerId: ownerId,
        })
            .getCount();
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            count: count,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.collectRoute.get('/Collect/GetOne/:id', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let collect = (yield (0, manager_1.getOne)(entity_1.CollectEntity, id));
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            collect: collect,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.collectRoute.get('/Collect/GetOneByShortName/:shortName', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { shortName } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let collect = yield (0, manager_2.getOneByShortName)(shortName);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            collect: collect,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.collectRoute.post('/Collect/TransferBMOE/DropContract/:contractId/WalletAddress/:walletAddress', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { contractId, walletAddress } = req.params;
    let { email } = req.body;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        let ownerValues = { walletAddress: walletAddress };
        if (email)
            ownerValues['email'] = email;
        const toOwner = (yield (0, manager_1.addOwner)(ownerValues));
        let dropContract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, contractId));
        let transferredAsset = yield (0, manager_2.transferBMOE)(dropContract, toOwner);
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        if (!transferredAsset) {
            res.status(404).json({
                status: 'success',
                code: 404,
                message: 'You have reached the maximum number of BMOE tokens allowed',
            });
        }
        res.status(200).json({
            status: 'success',
            code: 200,
            asset: transferredAsset,
            message: 'Transfer complete',
        });
    }
    catch (error) {
        next(error.message);
    }
}));
exports.collectRoute.get('/Collect/TransferTokenToOwners/DropContract/:dropContractId/Contract/:contractId', database_1.setDataSource, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { dropContractId, contractId } = req.params;
    try {
        if (!database_1.dataSource.isInitialized)
            yield database_1.dataSource.initialize();
        const dropContract = (yield (0, manager_1.getOne)(entity_1.ContractEntity, dropContractId));
        const receipts = yield (0, manager_2.transferTokenToOwners)(dropContract, contractId);
        /*const key = getWalletKey(dropContract.symbol as string) as string;
        const provider = getAlchemyProvider(dropContract.chainId as number);
        const bmoeSigner = new Wallet(key, provider);
        const assets = (await getAssetsByContract(
            contractId
        )) as Array<AssetEntity>;
        const shuffledAssets = assets.sort(() => 0.5 - Math.random());
        const dropAssets = await getAssetsByContractAndLimit(
            dropContractId,
            shuffledAssets.length
        );
        const transferContract = new Contract(
            dropContract.address,
            dropContract.abi,
            bmoeSigner
        );

        const signedTransferContract = transferContract.connect(bmoeSigner);
        for (let i = 0; i < shuffledAssets.length; i++) {
            const toAddress = (
                (await getOne(
                    OwnerEntity,
                    shuffledAssets[i].ownerId
                )) as OwnerEntity
            ).walletAddress;
            console.log(
                bmoeSigner.address,
                toAddress,
                dropAssets[i].tokenId
            );*/
        /*const tx = await signedTransferContract.getFunction(
                'safeTransferFrom'
            )(bmoeSigner.address, toAddress, dropAssets[i].tokenId);
            await tx.wait();
        }*/
        if (database_1.dataSource.isInitialized)
            yield database_1.dataSource.destroy();
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Transfer complete',
            receipts: receipts,
        });
    }
    catch (error) {
        next(error.message);
    }
}));
