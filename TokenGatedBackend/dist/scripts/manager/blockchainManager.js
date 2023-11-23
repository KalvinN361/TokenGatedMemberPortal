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
exports.mintToken = exports.checkOwnedAndTransfer = void 0;
const database_1 = require("../utilities/database");
const utilities_1 = require("../utilities");
const ownerManager_1 = require("./ownerManager");
const checkOwnedAndTransfer = (contract, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const ownedTokens = yield (0, utilities_1.HMgetOwnedTokens)(contract.partnerContractId, '0x8697e2B04b16eFfDf399Ff1bC7D42663709a8851');
    if (ownedTokens.tokens.length > 0) {
        let pc = contract.partnerContractId;
        let tokenId = ownedTokens.tokens[0].tokenId;
        let tx = yield (0, utilities_1.HMtransferToken)(pc, walletAddress, tokenId.toString());
        console.log({ tx });
        let txStatus = yield (0, utilities_1.HMgetTransferStatus)(pc, tx.id);
        console.log({ txStatus });
        return { status: 'success', code: 200, txStatus };
    }
    return { status: 'failed', code: 404, message: 'No tokens to transfer' };
});
exports.checkOwnedAndTransfer = checkOwnedAndTransfer;
const mintToken = (contract, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    let pc = contract.partnerContractId;
    console.log(`PV::${new Date()}::Getting owner for ${walletAddress}`);
    let owner = (yield (0, ownerManager_1.getOwnerByWalletAddress)(walletAddress));
    console.log(`PV::${new Date()}::Minting token for ${walletAddress}`);
    let mTx = yield (0, utilities_1.HMmint)(pc, walletAddress, 0, 1);
    console.log(`PV::${new Date()}::Minting status for ${walletAddress} with transaction Id ${mTx.id}`);
    let mTxStatus = yield (0, utilities_1.HMmintStatus)(pc, mTx.id);
    do {
        mTxStatus = yield (0, utilities_1.HMmintStatus)(pc, mTx.id);
        yield (0, utilities_1.delay)(5000);
    } while (mTxStatus.status !== 'Complete' && mTxStatus.status !== 'Failed');
    if (mTxStatus.status === 'Complete') {
        yield (0, utilities_1.delay)(5000);
        mTxStatus = yield (0, utilities_1.HMmintStatus)(pc, mTx.id);
        console.log(`PV::${new Date()}::Minting complete for ${walletAddress}`);
        console.log('tokens', mTxStatus.result);
        let token = mTxStatus.result[0];
        console.log(`PV::${new Date()}::Getting metadata for token ${token.id} from contract ${pc}`);
        let tokenMetadata = yield (0, utilities_1.HMgetTokenHostedMetadata)(pc, token.id.toString());
        console.log(`PV::${new Date()}::Adding asset ${token.id} to database`);
        let insertAssetResult = yield database_1.dataSource
            .createQueryBuilder()
            .insert()
            .into('AssetEntity')
            .values({
            contractId: contract.id,
            ownerId: owner.id,
            tokenId: token.id,
            image: tokenMetadata.image,
            animation: tokenMetadata.animation_url,
            name: tokenMetadata.name,
            description: tokenMetadata.description,
        })
            .execute();
        console.log(`PV::${new Date()}::Adding attributes to database`);
        let assetId = insertAssetResult.identifiers[0].id;
        let hmAttributes = tokenMetadata.attributes;
        let attributes = [];
        for (let attribute of hmAttributes) {
            let tmp = {
                assetId: assetId,
                traitType: attribute.trait_type,
                value: attribute.value,
            };
            attributes.push(tmp);
        }
        yield database_1.dataSource
            .createQueryBuilder()
            .insert()
            .into('AttributeEntity')
            .values(attributes)
            .execute();
        return { status: 'success', code: 200, response: mTxStatus };
    }
    else if (mTxStatus.status === 'Failed')
        return {
            status: 'failed',
            code: 404,
            response: 'Minting failed. Please contact Project Venkman.',
        };
});
exports.mintToken = mintToken;
