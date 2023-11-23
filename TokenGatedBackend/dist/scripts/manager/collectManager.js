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
exports.transferTokenToOwners = exports.transferBMOE = exports.getOneByShortName = void 0;
const entity_1 = require("../../entity");
const database_1 = require("../utilities/database");
const baseManager_1 = require("./baseManager");
const utilities_1 = require("../utilities");
const ethers_1 = require("ethers");
const assetManager_1 = require("./assetManager");
const ownerManager_1 = require("./ownerManager");
const chalk_1 = __importDefault(require("chalk"));
const openseaManager_1 = require("./openseaManager");
const getOneByShortName = (shortName) => __awaiter(void 0, void 0, void 0, function* () {
    const collect = yield database_1.dataSource
        .createQueryBuilder(entity_1.CollectEntity, 'c')
        .where('c.archived = (:archived) AND c.shortName = (:shortName)', {
        archived: false,
        shortName: shortName,
    })
        .getOne();
    return collect;
});
exports.getOneByShortName = getOneByShortName;
const transferBMOE = (dbContract, owner, email) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, abi, chainId } = dbContract;
    const { walletAddress } = owner;
    const provider = (0, utilities_1.getAlchemyProvider)(chainId);
    const feeData = yield provider.getFeeData();
    const fee = feeData.gasPrice;
    const estimate = yield provider.estimateGas({
        gasPrice: feeData.gasPrice,
    });
    const key = (0, utilities_1.getWalletKey)(dbContract.symbol);
    const signer = new ethers_1.Wallet(key, provider);
    const BMOEContract = new ethers_1.Contract(address, abi, signer);
    const signedBMOEContract = BMOEContract.connect(signer);
    const BMOEOwner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(signer.address));
    const assetCount = yield database_1.dataSource
        .createQueryBuilder(entity_1.AssetEntity, 'a')
        .where('a.archived=:archived AND a.contractId=:contractId AND a.ownerId=:ownerId', {
        archived: false,
        contractId: dbContract.id,
        ownerId: owner.id,
    })
        .getCount();
    console.log(owner.id, { assetCount });
    if (assetCount > 200)
        return null;
    let status = 0;
    let retAsset = null;
    while (status !== 1) {
        try {
            const txAsset = yield (0, openseaManager_1.getNextAvailableToken)(dbContract.id, BMOEOwner.id);
            console.log(chalk_1.default.yellow(`PV::${new Date().toISOString()}::Sending token ${txAsset.tokenId} from contract ${address} to ${walletAddress}`));
            const tx = yield signedBMOEContract.getFunction('safeTransferFrom')(signer.address, walletAddress, txAsset.tokenId);
            console.log(tx);
            yield tx.wait();
            status = 1;
            retAsset = yield (0, assetManager_1.updateAssetOwner)(txAsset, owner.id);
        }
        catch (e) {
            console.log(e);
            status = 0;
        }
    }
    return retAsset;
});
exports.transferBMOE = transferBMOE;
const transferTokenToOwners = (dropContract, ownersContractId) => __awaiter(void 0, void 0, void 0, function* () {
    const bmWalletIds = [
        '3c597bbc-9691-41cc-9e64-a92e2eac8c1e',
        '91845f58-1ef4-4848-a314-04489e7e7aaf',
    ];
    let receipts = [];
    const key = (0, utilities_1.getWalletKey)(dropContract.symbol);
    const provider = (0, utilities_1.getAlchemyProvider)(dropContract.chainId);
    const bmoeSigner = new ethers_1.Wallet(key, provider);
    const assets = (yield (0, assetManager_1.getAssetsByContract)(ownersContractId));
    const filteredAssets = assets.filter((asset) => {
        return !bmWalletIds.includes(asset.ownerId);
    });
    const shuffledAssets = filteredAssets.sort(() => 0.5 - Math.random());
    console.log('shuffledAssets', shuffledAssets.length);
    const dropAssets = yield (0, assetManager_1.getAssetsByContractAndLimit)(dropContract.id, shuffledAssets.length, '91845f58-1ef4-4848-a314-04489e7e7aaf');
    /*const filteredDropAssets = dropAssets.filter((asset) => {
        return bmWalletIds.includes(asset.ownerId);
    });*/
    console.log('filteredDropAssets', dropAssets.length);
    const transferContract = new ethers_1.Contract(dropContract.address, dropContract.abi, bmoeSigner);
    const signedTransferContract = transferContract.connect(bmoeSigner);
    for (let i = 0; i < shuffledAssets.length; i++) {
        console.log(`transfer ${dropAssets[i].tokenId} to ${shuffledAssets[i].ownerId}`);
        const toAddress = (yield (0, baseManager_1.getOne)(entity_1.OwnerEntity, shuffledAssets[i].ownerId));
        console.log(bmoeSigner.address, toAddress.walletAddress, dropAssets[i].tokenId);
        const tx = yield signedTransferContract.getFunction('safeTransferFrom')(bmoeSigner.address, toAddress.walletAddress, dropAssets[i].tokenId);
        const tmpReceipt = yield tx.wait();
        receipts.push(tmpReceipt);
        yield database_1.dataSource
            .createQueryBuilder()
            .update(entity_1.AssetEntity)
            .set({
            ownerId: shuffledAssets[i].ownerId,
            updatedDate: new Date(),
        })
            .where('id = :id', { id: dropAssets[i].id })
            .execute();
    }
    return receipts;
});
exports.transferTokenToOwners = transferTokenToOwners;
